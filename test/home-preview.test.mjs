import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { render, Templates } from 'nuckty';

const bundle = await build({
    stdin: {
        contents: "export { markdownTree, previewDocument } from './blocks/home/markdown-preview.ts'; export { renderToHtml } from 'nuckty/src/bem/render-to-html.ts';",
        resolveDir: new URL('..', import.meta.url).pathname,
    },
    bundle: true, write: false, platform: 'browser', format: 'esm', minify: true,
});
const browser = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].contents).toString('base64'));

test('home preview uses the same HTML output in the browser and build', () => {
    for (const source of ['# My first website\n\nA paragraph.', '# Мой сайт\nАбзац без пустой строки.\n\nВторой абзац.', '## Heading\r\n\r\nFirst line\r\nsecond line', '', '# <script>alert(1)</script>\n\nText & <img src=x onerror=alert(1)>']) {
        const tree = browser.markdownTree(source);
        assert.equal(browser.renderToHtml(tree), render(tree, { templates: new Templates() }));
    }
});

test('preview escapes markup and accepts only a fixed document language', () => {
    const html = browser.renderToHtml(browser.markdownTree('# <script>alert(1)</script>\n\nText & <img src=x>'));
    assert.ok(!html.includes('<script>') && !html.includes('<img'));
    assert.match(html, /&lt;script&gt;/);
    assert.match(html, /&amp;/);
    assert.match(browser.previewDocument(html, 'ru'), /<html lang="ru">/);
    assert.match(browser.previewDocument(html, '\"><script>'), /<html lang="en">/);
});
