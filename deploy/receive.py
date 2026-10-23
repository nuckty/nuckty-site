#!/usr/bin/python3
"""Receive verified static releases through a forced SSH command."""
import fcntl
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile
import tempfile
import urllib.request

ROOT = Path('/srv/nuckty')
DOMAINS = {'site': ('nuckty.ru', 'nuckty.com'), 'demo': ('demo.nuckty.ru', 'demo.nuckty.com')}
MAX_BYTES = 128 * 1024 * 1024


def extract(payload, destination):
    """Accept regular files/directories only and verify the complete file set."""
    with tarfile.open(fileobj=io.BytesIO(payload), mode='r:gz') as archive:
        members = archive.getmembers()
        if len(members) > 5000 or sum(item.size for item in members) > MAX_BYTES:
            raise ValueError('Artifact exceeds release limits')
        seen = set()
        for item in members:
            path = PurePosixPath(item.name)
            if (path.is_absolute() or '..' in path.parts or not path.parts
                    or path.parts[0] not in ('ru', 'en') or item.name in seen
                    or not (item.isdir() or item.isfile())):
                raise ValueError('Unsafe or duplicate archive entry')
            seen.add(item.name)
            target = destination.joinpath(*path.parts)
            if item.isdir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with archive.extractfile(item) as source, target.open('wb') as output:
                    shutil.copyfileobj(source, output)
                target.chmod(0o644)
    for language in ('ru', 'en'):
        base = destination / language
        manifest = json.loads((base / 'manifest.json').read_text())
        actual = {str(file.relative_to(base)) for file in base.rglob('*') if file.is_file()}
        if actual != set(manifest) | {'manifest.json'}:
            raise ValueError('Artifact files do not match the manifest')
        for filename, entry in manifest.items():
            content = (base / filename).read_bytes()
            if len(content) != entry['size'] or hashlib.md5(content).hexdigest()[:16] != entry['hash']:
                raise ValueError('Artifact checksum mismatch')
        if not (base / 'html/index.html').is_file():
            raise ValueError('Missing homepage')


def healthy(project):
    for language, domain in zip(('ru', 'en'), DOMAINS[project]):
        request = urllib.request.Request('http://127.0.0.1:8087/', headers={'Host': domain})
        with urllib.request.urlopen(request, timeout=10) as response:
            body = response.read()
            if response.status != 200 or not re.search(rb'<html[^>]*lang=["\x27]?' + language.encode() + rb'["\x27 >]', body):
                raise ValueError('Deployed homepage failed its language check')


def activate(project, release, check=healthy):
    base = ROOT / project
    current = base / 'current'
    previous = os.readlink(current) if current.is_symlink() else None
    pending = base / '.current-next'
    pending.unlink(missing_ok=True)
    pending.symlink_to(release.relative_to(base), target_is_directory=True)
    os.replace(pending, current)
    try:
        check(project)
    except Exception:
        if previous is None:
            current.unlink()
        else:
            pending.symlink_to(previous, target_is_directory=True)
            os.replace(pending, current)
        raise


def main():
    project = sys.argv[1] if len(sys.argv) == 2 else ''
    match = re.fullmatch(r'deploy ([a-f0-9]{40}) ([0-9]+)', os.environ.get('SSH_ORIGINAL_COMMAND', ''))
    if project not in DOMAINS or not match:
        raise ValueError('Only the deployment command is allowed')
    sha, run = match.groups()
    base = ROOT / project
    with (base / '.deploy.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        metadata = base / 'current/.deployment.json'
        if metadata.is_file() and int(run) < json.loads(metadata.read_text())['run']:
            raise ValueError('A newer CI run is already deployed')
        payload = sys.stdin.buffer.read(MAX_BYTES + 1)
        if len(payload) > MAX_BYTES:
            raise ValueError('Upload exceeds release limits')
        release = Path(tempfile.mkdtemp(prefix=f'{run}-{sha}-', dir=base / 'releases'))
        try:
            extract(payload, release)
            release.chmod(0o755)
            (release / '.deployment.json').write_text(json.dumps({'sha': sha, 'run': int(run)}))
            activate(project, release)
        except Exception:
            shutil.rmtree(release)
            raise
        releases = sorted((base / 'releases').iterdir(), key=lambda item: item.stat().st_mtime, reverse=True)
        for old in releases[5:]:
            if old != release:
                shutil.rmtree(old)
    print(f'Deployed {project} {sha}; both languages passed health checks')


if __name__ == '__main__':
    main()

