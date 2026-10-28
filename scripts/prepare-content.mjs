/** Prepare canonical documentation and search data without network access. */
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { searchDocument } from './search-document.mjs';
import { packageExamples } from './package-examples.mjs';

const root = path.resolve(import.meta.dirname, '..');
const docs = path.resolve(root, process.env.NUCKTY_DOCS_DIR ?? '../nuckty/docs');
const versions = JSON.parse(await readFile(path.join(root, 'config/config-packages.json'), 'utf8'));
const destination = path.join(root, 'content/docs');
const files = ['index.md', 'index.ru.md'];

async function collect(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const name = path.posix.join(prefix, entry.name);

        if (entry.isDirectory()) {
            await collect(path.join(directory, entry.name), name);
        } else if (entry.name.endsWith('.md')) {
            files.push(name);
        }
    }
}

for (const section of ['how', 'out', 'ext', 'why']) {
    await collect(path.join(docs, section), section);
}

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
const search = { ru: [], en: [] };
const readingOrder = [
    '/docs', '/how', '/how/start', '/how/bemjson', '/how/templates', '/how/markdown', '/how/sitemap',
    '/how/blocks', '/how/blocks/authoring', '/how/blocks/deps', '/how/blocks/levels', '/how/targets',
    '/how/pipeline', '/how/external', '/how/ext', '/how/ext/block', '/how/ext/markdown', '/how/ext/pipeline',
    '/how/ext/command', '/how/ext/document', '/out', '/out/html', '/out/assets', '/out/images',
    '/out/compression', '/out/hosting', '/ext', '/ext/block', '/ext/block/root', '/ext/block/gallery',
    '/ext/block/grid', '/ext/markdown', '/ext/markdown/typography-ru', '/ext/markdown/video', '/ext/pipeline',
    '/ext/command', '/ext/command/serve', '/ext/command/validate-vnu', '/ext/command/content-external',
    '/ext/command/convert-images', '/ext/command/deploy-ftp', '/ext/document', '/why', '/why/bemjson',
    '/why/markdown', '/why/render', '/why/sitemap', '/why/compression', '/why/hosting', '/why/repos',
];
const rank = new Map(readingOrder.map((route, index) => [route, index]));

for (const file of files.sort()) {
    const text = packageExamples(await readFile(path.join(docs, file), 'utf8'), versions);
    await mkdir(path.dirname(path.join(destination, file)), { recursive: true });
    await writeFile(path.join(destination, file), text);
    const language = file.endsWith('.ru.md') ? 'ru' : 'en';
    const route = file.startsWith('index.') ? '/docs' : `/${file.replace(/(?:\.ru)?\.md$/, '').replace(/\/index$/, '')}`;
    search[language].push(searchDocument(route, text));
}

for (const language of ['ru', 'en']) {
    const suffix = language === 'ru' ? '.ru.md' : '.md';
    const entries = search[language].sort((a, b) => (rank.get(a.url) ?? 1000) - (rank.get(b.url) ?? 1000) || a.url.localeCompare(b.url, 'en'));
    const lines = [
        'sitemap:',
        `  - ${language === 'ru' ? 'nuckty — сайты из текста и блоков' : 'nuckty — sites from text and blocks'} [/, index${suffix}, { layout: "landing" }]`,
        `  - ${language === 'ru' ? 'Для каких проектов' : 'Use cases'} [/use-cases, use-cases${suffix}]`,
        ...entries.map((entry) => {
            const source = entry.url === '/docs' ? 'index' : files.find((file) => {
                return file.endsWith(suffix) && (!file.endsWith('.ru.md') || language === 'ru') && `/${file.replace(/(?:\.ru)?\.md$/, '').replace(/\/index$/, '')}` === entry.url;
            })?.replace(/(?:\.ru)?\.md$/, '');

            if (!source) {
                throw new Error(`Missing source for ${entry.url}`);
            }

            return `  - ${entry.title.replace(/[\[\]]/g, '')} [${entry.url}, docs/${source}${suffix}]`;
        }),
    ];
    await mkdir(path.join(root, 'config', language), { recursive: true });
    await writeFile(path.join(root, 'config', language, 'sitemap.yml'), lines.join('\n') + '\n');
}

for (const language of ['ru', 'en']) {
    const suffix = language === 'ru' ? '.ru.md' : '.md';

    for (const [url, file] of [['/', 'index'], ['/use-cases', 'use-cases']]) {
        search[language].push(searchDocument(url, await readFile(path.join(root, `content/${file}${suffix}`), 'utf8')));
    }
}

await writeFile(path.join(root, 'content/search-data.json'), `${JSON.stringify(search)}\n`);
await rm(path.join(root, 'blocks/search/search-data.js'), { force: true });
