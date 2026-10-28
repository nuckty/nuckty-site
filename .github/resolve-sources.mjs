/** Pin the documentation source in config/external.json to the latest nuckty commit with successful CI on main. */
import { readFile, writeFile } from 'node:fs/promises';

const file = process.env.NUCKTY_EXTERNAL_CONFIG ?? new URL('../config/external.json', import.meta.url);
const repository = 'https://github.com/nuckty/nuckty.git';
const headers = { Accept: 'application/vnd.github+json' };

if (process.env.GH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
}
const response = await fetch('https://api.github.com/repos/nuckty/nuckty/actions/workflows/ci.yml/runs?branch=main&event=push&status=success&per_page=1', { headers });

if (!response.ok) {
    throw new Error(`Cannot resolve verified nuckty: HTTP ${response.status}`);
}
const { workflow_runs: runs } = await response.json();
const ref = runs?.[0]?.head_sha;

if (!/^[a-f0-9]{40}$/.test(ref ?? '')) {
    throw new Error('No successful main push CI found for nuckty');
}
const sources = JSON.parse(await readFile(file, 'utf8'));
const docs = sources.find((source) => typeof source === 'object' && source.url === repository);

if (!docs) {
    throw new Error(`config/external.json has no ${repository} source`);
}
docs.ref = ref;
await writeFile(file, `${JSON.stringify(sources, null, 4)}\n`);
console.log(`nuckty: ${ref}`);
