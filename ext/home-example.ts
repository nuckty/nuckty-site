import { messages } from './home-example.i18n/index.js';
import { copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { markdownTree } from '../blocks/home/markdown-preview.js';
import { assertArtifactPath, render, type BemNode, type DocumentData, type NucktyEnv } from '@nuckty/core';

export function register(env: NucktyEnv): void {
    env.pipeline.before('compression', async (ctx) => {
        const language = ctx.lang === 'ru' ? 'ru' : 'en';
        const destination = path.join(ctx.outDir, 'nuckty-starter.zip');
        await assertArtifactPath(ctx.outDir, destination);
        await copyFile(path.join(ctx.cwd, `content/downloads/nuckty-starter-${language}.zip`), destination);
    });
    env.pipeline.before('html', async (ctx) => {
        const sitemap = ctx.store['sitemap'] as DocumentData['sitemap'];
        const locale = ctx.lang;
        const t = messages(locale);
        const tree: BemNode = {
            block: 'card',
            content: [
                { elem: 'title', content: t['Field guide'] },
                { elem: 'description', content: t['An interface built from blocks.'] },
            ],
        };
        const children = tree.content as BemNode[];
        const input = [
            '{',
            '  "block": "card",',
            '  "content": [',
            ...children.map(
                (child, index) => `    ${JSON.stringify(child)}${index === children.length - 1 ? '' : ','}`,
            ),
            '  ]',
            '}',
        ].join('\n');

        const source = t['# My first website\n\nThis page is built with nuckty: Markdown → BEMJSON → HTML.'];

        sitemap.pages['/']!['homeExample'] = {
            markdown: { source, html: render(markdownTree(source), { templates: ctx.templates }) },
            tree,
            input,
            template: await readFile(path.join(ctx.cwd, 'blocks/card/card.nu.ts'), 'utf8'),
            html: render(tree, { templates: ctx.templates }),
        };
    });
}
