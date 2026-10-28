/** Prepare canonical documentation and search data without network access. */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { searchDocument } from './search-document.mjs';
import { packageExamples } from './package-examples.mjs';

const root = path.resolve(import.meta.dirname, '..');
const docs = path.resolve(root, process.env.NUCKTY_DOCS_DIR ?? 'external/nuckty/docs');
const versions = JSON.parse(await readFile(path.join(root, 'config/config-packages.json'), 'utf8'));
const destination = path.join(root, 'content/docs');
const pages = JSON.parse(await readFile(path.join(docs, 'pages.json'), 'utf8'));

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
const search = { ru: [], en: [] };
const sitemap = { ru: [], en: [] };

for (const page of pages) {
    const route = page === 'index' ? '/docs' : `/${page.replace(/\/index$/, '')}`;

    for (const [language, suffix] of [['ru', '.ru.md'], ['en', '.md']]) {
        const file = page + suffix;
        const text = packageExamples(await readFile(path.join(docs, file), 'utf8'), versions);
        await mkdir(path.dirname(path.join(destination, file)), { recursive: true });
        await writeFile(path.join(destination, file), text);
        const document = searchDocument(route, text);
        search[language].push(document);
        sitemap[language].push(`  - ${document.title.replace(/[\[\]]/g, '')} [${route}, docs/${file}]`);
    }
}

for (const language of ['ru', 'en']) {
    const suffix = language === 'ru' ? '.ru.md' : '.md';
    const lines = [
        'sitemap:',
        `  - ${language === 'ru' ? 'nuckty — сайты из текста и блоков' : 'nuckty — sites from text and blocks'} [/, index${suffix}, { layout: "landing" }]`,
        `  - ${language === 'ru' ? 'Для каких проектов' : 'Use cases'} [/use-cases, use-cases${suffix}]`,
        ...sitemap[language],
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
