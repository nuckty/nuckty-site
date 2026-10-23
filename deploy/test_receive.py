import hashlib
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch
import receive


class DeploymentTests(unittest.TestCase):
    def payload(self, extra=None, corrupt=False):
        output = io.BytesIO()
        with tarfile.open(fileobj=output, mode='w:gz') as archive:
            for language in ('ru', 'en'):
                content = f'<html lang={language}>'.encode()
                manifest = {'html/index.html': {'size': len(content), 'hash': hashlib.md5(content).hexdigest()[:16]}}
                for name, body in [('html/index.html', b'broken' if corrupt else content), ('manifest.json', json.dumps(manifest).encode())]:
                    entry = tarfile.TarInfo(f'{language}/{name}')
                    entry.size = len(body)
                    archive.addfile(entry, io.BytesIO(body))
            if extra is not None:
                archive.addfile(extra, io.BytesIO(b''))
        return output.getvalue()

    def test_valid_pair(self):
        with tempfile.TemporaryDirectory() as directory:
            receive.extract(self.payload(), Path(directory))
            self.assertTrue((Path(directory) / 'en/html/index.html').is_file())

    def test_tampered_file(self):
        with tempfile.TemporaryDirectory() as directory, self.assertRaises(ValueError):
            receive.extract(self.payload(corrupt=True), Path(directory))

    def test_unsafe_entries(self):
        for name, kind in [('../escape', tarfile.REGTYPE), ('/escape', tarfile.REGTYPE), ('ru/link', tarfile.SYMTYPE), ('en/link', tarfile.LNKTYPE)]:
            entry = tarfile.TarInfo(name)
            entry.type = kind
            entry.linkname = '/tmp/escape'
            with self.subTest(name=name), tempfile.TemporaryDirectory() as directory, self.assertRaises(ValueError):
                receive.extract(self.payload(entry), Path(directory))

    def test_health_failure_restores_pair(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(receive, 'ROOT', Path(directory)):
            base = Path(directory) / 'site'
            old = base / 'releases/old'
            new = base / 'releases/new'
            old.mkdir(parents=True)
            new.mkdir()
            (base / 'current').symlink_to('releases/old')
            with self.assertRaises(ValueError):
                receive.activate('site', new, lambda _: (_ for _ in ()).throw(ValueError('unhealthy')))
            self.assertEqual((base / 'current').resolve(), old.resolve())

    def test_success_switches_pair(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(receive, 'ROOT', Path(directory)):
            new = Path(directory) / 'demo/releases/new'
            new.mkdir(parents=True)
            receive.activate('demo', new, lambda _: None)
            self.assertEqual((Path(directory) / 'demo/current').resolve(), new.resolve())


if __name__ == '__main__':
    unittest.main()

