import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { build } from 'esbuild';
import { assertArtifactPath, type DocumentData, type NucktyEnv } from '@nuckty/core';

export function register(env: NucktyEnv): void {
    env.pipeline.before('html', async (ctx) => {
        const corpus = JSON.parse(await readFile(path.join(ctx.cwd, 'content/search-data.json'), 'utf8'));
        const language = ctx.lang === 'ru' ? 'ru' : 'en';
        const index = `${JSON.stringify(corpus[language])}\n`;
        const destination = path.join(ctx.outDir, 'search-index.txt');
        await assertArtifactPath(ctx.outDir, destination);
        await writeFile(destination, index);
        const engine = await build({
            entryPoints: [path.join(ctx.cwd, 'blocks/search/search-engine.mjs')],
            bundle: true, minify: true, write: false, format: 'esm', platform: 'browser', charset: 'utf8', target: ['es2018'],
        });
        const bytes = engine.outputFiles[0]!.contents;
        const hash = createHash('md5').update(bytes).digest('hex').slice(0, 16);
        const enginePath = path.join(ctx.outDir, 'js', `${hash}.js`);
        await assertArtifactPath(ctx.outDir, enginePath);
        await writeFile(enginePath, bytes);
        const sitemap = ctx.store['sitemap'] as DocumentData['sitemap'];

        for (const page of Object.values(sitemap.pages)) {
            page['searchIndexBytes'] = Buffer.byteLength(index);
            page['searchEngineUrl'] = `/${hash}.js`;
        }
    });
}
