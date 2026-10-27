import { appendFile } from 'node:fs/promises';

const headers = { Accept: 'application/vnd.github+json' };

if (process.env.GH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
}
for (const name of ['nuckty-docs']) {
    const url = `https://api.github.com/repos/nuckty/${name}/actions/workflows/ci.yml/runs?branch=main&event=push&status=success&per_page=1`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error(`Cannot resolve verified ${name}: HTTP ${response.status}`);
    }
    const { workflow_runs: runs } = await response.json();
    const ref = runs?.[0]?.head_sha;

    if (!/^[a-f0-9]{40}$/.test(ref ?? '')) {
        throw new Error(`No successful main push CI found for ${name}`);
    }
    await appendFile(process.env.GITHUB_ENV, `NUCKTY_DOCS_REF=${ref}\n`);
    console.log(`${name}: ${ref}`);
}
