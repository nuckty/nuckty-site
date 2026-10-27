/** Verify both delivered ZIPs after extraction, without sibling source access. */
import { mkdtempSync, readFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { createServer } from 'node:net';

const root = path.resolve(import.meta.dirname, '..');
const versions = JSON.parse(readFileSync(path.join(root, 'config/config-packages.json'), 'utf8'));
const temp = mkdtempSync(path.join(tmpdir(), 'nuckty starter proof '));
const cache = process.env.NUCKTY_NPM_CACHE ?? path.join(root, '.cache/npm-starter');
const extensions = process.argv.includes('--extensions');
const preview = process.argv.includes('--preview');
const offline = process.argv.includes('--offline') ? ['--offline'] : [];
let passed = false;

async function freePort() {
    const server = createServer();
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
    });
    const port = server.address().port;
    await new Promise(resolve => server.close(resolve));

    return port;
}

async function verifyPreview(consumer, language, env) {
    const bin = path.join(consumer, 'node_modules/.bin/nuckty');
    const port = await freePort();
    const child = spawn(bin, ['serve', '--port', String(port)], { cwd: consumer, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let diagnostics = '';
    child.stderr.on('data', chunk => { diagnostics += chunk; });
    const exited = new Promise((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', code => resolve(code));
    });

    try {
        let initial;

        for (let attempt = 0; attempt < 50; attempt += 1) {
            if (child.exitCode !== null) {
                throw new Error(`Starter preview exited early: ${diagnostics}`);
            }

            try {
                const response = await fetch(`http://127.0.0.1:${port}/`);
                if (response.ok) {
                    initial = await response.text();
                    break;
                }
            } catch {
                // The server is still binding its local socket.
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        assert.ok(initial, 'preview must serve the built starter');
        assert.match(initial, language === 'ru' ? /Привет, nuckty/ : /Hello, nuckty/);
        const heading = language === 'ru' ? 'Страница обновлена' : 'Updated page';
        writeFileSync(path.join(consumer, 'content/index.md'), `# ${heading}\n\nRebuilt while the preview is running.\n`);
        execFileSync('npm', ['run', 'build'], { cwd: consumer, env, stdio: ['ignore', 'pipe', 'pipe'] });
        const response = await fetch(`http://127.0.0.1:${port}/`);
        assert.equal(response.status, 200);
        assert.ok((await response.text()).includes(heading), 'the same preview must serve edited content after rebuilding');
    } finally {
        execFileSync(bin, ['stop'], { cwd: consumer, env, stdio: ['ignore', 'pipe', 'pipe'] });
        const timeout = new Promise((_, reject) => {
            const timer = setTimeout(() => reject(new Error('Starter preview did not stop')), 5000);
            timer.unref();
        });
        assert.equal(await Promise.race([exited, timeout]), 0);
    }

    let stillRunning = false;
    try { stillRunning = (await fetch(`http://127.0.0.1:${port}/`)).ok; } catch { /* Expected after stopping. */ }
    assert.equal(stillRunning, false, 'stop must release the preview port');
}

try {
    for (const language of ['ru', 'en']) {
        const destination = path.join(temp, language);
        execFileSync('python3', ['-c', 'import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; assert all(n.startswith("nuckty-starter/") and ".." not in n.split("/") for n in z.namelist()); z.extractall(sys.argv[2])', path.join(root, `content/downloads/nuckty-starter-${language}.zip`), destination]);
        const consumer = path.join(destination, 'nuckty-starter');
        const manifest = JSON.parse(readFileSync(path.join(consumer, 'package.json'), 'utf8'));
        assert.ok(Object.entries(manifest.dependencies).every(([name, value]) => value === versions[name]));
        assert.equal(existsSync(path.join(consumer, 'packages')), false, 'starter must install registry releases without bundled archives');
        const env = { ...process.env, npm_config_cache: cache, npm_config_registry: 'https://registry.npmjs.org' };
        execFileSync('npm', ['install', ...offline, '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org', '--cache', cache], { cwd: consumer, env, stdio: ['ignore', 'pipe', 'pipe'] });
        if (extensions) {
            execFileSync('npm', ['install', ...offline, '--save-exact', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org', '--cache', cache, ...Object.entries(JSON.parse(readFileSync(path.join(root, 'content/downloads/receipt.json'), 'utf8'))[language].packages).map(([name, version]) => `${name}@${version}`)], { cwd: consumer, env, stdio: ['ignore', 'pipe', 'pipe'] });
        }
        const lock = JSON.parse(readFileSync(path.join(consumer, 'package-lock.json'), 'utf8'));

        for (const [location, entry] of Object.entries(lock.packages)) {
            assert.ok(!entry.link, `${location}: starter must not use local source links`);

            if (location.startsWith('node_modules/@nuckty/')) {
                assert.equal(entry.version, versions[location.slice('node_modules/'.length)]);
                assert.ok(entry.resolved.startsWith('https://registry.npmjs.org/'));
                assert.ok(entry.integrity);
            }
        }

        execFileSync('npm', ['run', 'build'], { cwd: consumer, env, stdio: ['ignore', 'pipe', 'pipe'] });
        const html = readFileSync(path.join(consumer, 'site/html/index.html'), 'utf8');
        assert.match(html, new RegExp(`lang=${language}`));
        assert.match(html, language === 'ru' ? /Привет, nuckty/ : /Hello, nuckty/);
        assert.match(html, /rel=stylesheet/);
        assert.match(html, /<img/);

        if (preview) {
            await verifyPreview(consumer, language, env);
        }
    }

    passed = true;
    process.stdout.write(preview ? 'Both starters passed install, build, serve, edit, rebuild and stop.\n' : 'Both starter ZIPs passed extraction, registry-only install and standalone build.\n');
} finally {
    if (passed) {
        rmSync(temp, { recursive: true, force: true });
    } else {
        process.stderr.write(`Starter fixture preserved at ${temp}\n`);
    }
}

