import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createSearch, searchPages, matchingRanges, excerpt } from '../blocks/search/search-engine.mjs';
import { searchDocument } from '../scripts/search-document.mjs';

const corpus = JSON.parse(await readFile(new URL('../content/search-data.json', import.meta.url), 'utf8'));
const databases = Object.fromEntries(Object.entries(corpus).map(([language, pages]) => [language, createSearch(pages, language)]));

for (const language of ['ru', 'en']) {
    test(`${language}: every built page is indexed`, async () => {
        const pages = await readdir(new URL(`../site/${language}/html/`, import.meta.url));
        const routes = pages.filter((file) => file.endsWith('.html')).map((file) => file === 'index.html' ? '/' : `/${file.slice(0, -5).replaceAll('_', '/')}`);
        assert.deepEqual(corpus[language].map((page) => page.url).sort(), routes.sort());
        const artifact = JSON.parse(await readFile(new URL(`../site/${language}/search-index.txt`, import.meta.url), 'utf8'));
        assert.deepEqual(artifact, corpus[language]);
    });

    test(`${language}: engine is a separate working module and progress size matches UTF-8`, async () => {
        const html = await readFile(new URL(`../site/${language}/html/index.html`, import.meta.url), 'utf8');
        const engineUrl = html.match(/data-engine-url=([^\s>]+)/)[1];
        const bytes = Number(html.match(/data-index-bytes=(\d+)/)[1]);
        const index = await readFile(new URL(`../site/${language}/search-index.txt`, import.meta.url));
        assert.equal(bytes, index.length);
        const baseUrl = html.match(/<script\s+src=([^\s>]+)/)[1];
        assert.notEqual(engineUrl, baseUrl);
        const artifactUrl = new URL(`../site/${language}/js/${engineUrl.slice(1)}`, import.meta.url);
        const engine = await import(artifactUrl.href);
        const database = engine.createSearch(JSON.parse(index.toString()), language);
        assert.equal(engine.searchPages(database, language === 'ru' ? 'шаблны' : 'templtes').hits[0]?.document.url, '/how/templates');
    });

    test(`${language}: inflections and a typo find the template guide`, () => {
        for (const term of language === 'ru' ? ['шаблонами', 'шаблны', 'шаблны nu', 'шаблоны nu.ts'] : ['template', 'templtes', 'templtes nu', 'nu.ts templates']) {
            assert.equal(searchPages(databases[language], term).hits[0]?.document.url, '/how/templates', term);
        }
    });

    test(`${language}: API examples and package names are searchable`, () => {
        const code = searchPages(databases[language], 'defineNucktyConfig');
        assert.ok(code.hits.length > 0);
        assert.ok(code.hits.every((hit) => hit.document.text.includes('defineNucktyConfig')));
        assert.equal(searchPages(databases[language], 'nuckty-ext-command-serve').hits[0]?.document.url, '/ext/command/serve');
        assert.ok(searchPages(databases[language], 'env.commands.add').hits.slice(0, 3).some((hit) => ['/ext/command', '/how/ext/command'].includes(hit.document.url)));
    });

    test(`${language}: empty and unrelated queries return no pages`, () => {
        for (const term of ['', '  ', '---', "'", 'zzunfindablezz']) {
            assert.equal(searchPages(databases[language], term).hits.length, 0, term);
        }
    });
}

test('short terms match complete tokens and multi-word queries require every term', () => {
    const database = createSearch([
        { url: '/nu', title: 'nu.ts templates', headings: '', text: 'A guide to nu.' },
        { url: '/numbers', title: 'Numbers', headings: '', text: 'Numbers and numbering.' },
        { url: '/split', title: 'Templates', headings: '', text: 'The nu renderer.' },
    ], 'en');
    assert.deepEqual(searchPages(database, 'nu').hits.map((hit) => hit.document.url).sort(), ['/nu', '/split']);
    assert.equal(searchPages(database, 'nu numbers').count, 0);
    assert.equal(searchPages(database, 'templates nu').count, 2);
});

test('search data retains code and complete long text without treating code as headings', () => {
    const page = searchDocument('/example', `# Example\n\n${'body '.repeat(3000)}\n\n## Real heading\n\n\`\`\`html\n# Code, not a heading\n<div data-api="defineNucktyConfig">Hello</div>\n\`\`\`\n`);
    assert.equal(page.headings, 'Real heading');
    assert.ok(page.text.length > 12000);
    assert.ok(page.text.includes('<div data-api="defineNucktyConfig">Hello</div>'));
});

test('excerpts highlight inflections and typos and show the actual command phrase', () => {
    const russian = databases.ru;
    const text = 'Шаблоны применяются к блокам.';
    assert.equal(text.slice(matchingRanges(russian, text, 'шаблонами')[0].start, matchingRanges(russian, text, 'шаблонами')[0].end), 'Шаблоны');
    assert.equal(text.slice(matchingRanges(russian, text, 'шаблны', 1)[0].start, matchingRanges(russian, text, 'шаблны', 1)[0].end), 'Шаблоны');
    const code = `${'intro '.repeat(70)}Build a page with npm run build and inspect the artifact.`;
    assert.ok(excerpt(databases.en, code, 'npm run build').text.includes('npm run build'));
    const html = '<div>Hello</div>';
    assert.equal(excerpt(databases.en, html, 'div').text, html);
});
