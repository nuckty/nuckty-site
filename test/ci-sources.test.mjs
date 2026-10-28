import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function run(mode) {
    const directory = mkdtempSync(join(tmpdir(), 'nuckty-ci-sources-'));
    const output = join(directory, 'env');
    const bootstrap = `
        import assert from 'node:assert/strict';
        globalThis.fetch = async (url, { headers }) => {
            const parsed = new URL(url);
            if (parsed.searchParams.get('branch') !== 'main' || parsed.searchParams.get('event') !== 'push' || parsed.searchParams.get('status') !== 'success' || headers.Authorization !== 'Bearer fixture-token') {
                throw new Error('Invalid verified-source request');
            }
            assert.equal(parsed.pathname, '/repos/nuckty/nuckty/actions/workflows/ci.yml/runs');
            return {
                ok: !(process.env.MOCK_MODE === 'http'),
                status: 403,
                json: async () => ({ workflow_runs: process.env.MOCK_MODE === 'missing' ? [] : [{ head_sha: process.env.MOCK_MODE === 'invalid' ? 'main' : 'a'.repeat(40) }] }),
            };
        };
        await import(${JSON.stringify(new URL('../.github/resolve-sources.mjs', import.meta.url).href)});
    `;
    try {
        const result = spawnSync(process.execPath, ['--input-type=module', '-e', bootstrap], {
            encoding: 'utf8',
            env: { ...process.env, GH_TOKEN: 'fixture-token', GITHUB_ENV: output, MOCK_MODE: mode },
        });
        let env = '';
        try {
            env = readFileSync(output, 'utf8');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return { ...result, env };
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
}

test('CI resolves only canonical documentation to a verified SHA', () => {
    const result = run('success');
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.env.trim(), `NUCKTY_DOCS_REF=${'a'.repeat(40)}`);
});

for (const mode of ['http', 'missing', 'invalid']) {
    test(`CI rejects ${mode} documentation verification instead of using an old pin`, () => {
        const result = run(mode);
        assert.notEqual(result.status, 0);
        assert.ok(!result.env.includes('NUCKTY_DOCS_REF='));
    });
}
