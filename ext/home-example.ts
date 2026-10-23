import { copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertArtifactPath, render, type BemNode, type DocumentData, type NucktyEnv } from 'nuckty';

export function register(env: NucktyEnv): void {
    env.pipeline.before('compression', async (ctx) => {
        const language = ctx.lang === 'ru' ? 'ru' : 'en';
        const destination = path.join(ctx.outDir, 'nuckty-starter.zip');
        await assertArtifactPath(ctx.outDir, destination);
        await copyFile(path.join(ctx.cwd, `content/downloads/nuckty-starter-${language}.zip`), destination);
    });
    env.pipeline.before('html', async (ctx) => {
        const sitemap = ctx.store['sitemap'] as DocumentData['sitemap'];
        const ru = ctx.lang === 'ru';
        const tree: BemNode = {
            block: 'card',
            content: [
                { elem: 'title', content: ru ? 'Справочник' : 'Field guide' },
                { elem: 'description', content: ru ? 'Руководства из Markdown, интерфейс из блоков.' : 'Markdown guides, with an interface built from blocks.' },
            ],
        };
        const children = tree.content as BemNode[];
        const input = ['{', '  "block": "card",', '  "content": [', ...children.map((child, index) => `    ${JSON.stringify(child)}${index === children.length - 1 ? '' : ','}`), '  ]', '}'].join('\n');

        sitemap.pages['/']!['homeExample'] = {
            tree, input,
            template: await readFile(path.join(ctx.cwd, 'blocks/card/card.nu.ts'), 'utf8'),
            html: render(tree, { templates: ctx.templates }),
        };
    });
}
