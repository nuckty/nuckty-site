import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..');
const manifestPackage = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const targets = manifestPackage.name === '@nuckty/site' ? ['ru', 'en'] : [''];
const entities = { amp: '&', quot: '"', '#39': "'", lt: '<', gt: '>' };
const decode = (value) => value.replace(/&(amp|quot|#39|lt|gt);/g, (_, key) => entities[key]);

function attributes(tag) {
    return Object.fromEntries([...tag.matchAll(/([\w:-]+)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map((match) => [match[1], decode(match[2] ?? match[3] ?? match[4])]));
}

for (const target of targets) {
    const site = path.join(root, 'site', target);

    test(`${target || 'demo'}: pages, links, assets, manifest and compression`, async () => {
        const manifest = JSON.parse(await readFile(path.join(site, 'manifest.json'), 'utf8'));
        const pageNames = (await readdir(path.join(site, 'html'))).filter((file) => file.endsWith('.html'));
        assert.ok(pageNames.length >= (target ? 50 : 5));
        const pages = new Map();
        const assetRoutes = new Set(['/robots.txt', '/build-files.txt']);

        for (const [filename, entry] of Object.entries(manifest)) {
            const bytes = await readFile(path.join(site, filename));
            assert.equal(bytes.length, entry.size, filename);
            assert.equal(createHash('md5').update(bytes).digest('hex').slice(0, 16), entry.hash, filename);

            if (/\.(zip|pdf|txt)$/.test(filename)) {
                assetRoutes.add(`/${filename}`);
            }

            if (/^(css|js|svg|png|jpg|webp|avif)\//.test(filename)) {
                assetRoutes.add(`/${path.basename(filename)}`);
                const raster = filename.match(/^(?:png|jpg|webp|avif)\/([a-f0-9]+)\./);

                if (raster) {
                    assetRoutes.add(`/_i${raster[1]}`);
                }
            }
        }

        for (const filename of pageNames) {
            const html = await readFile(path.join(site, 'html', filename), 'utf8');
            const route = filename === 'index.html' ? '/' : `/${filename.slice(0, -5).replaceAll('_', '/')}`;
            const tags = [...html.matchAll(/<[a-z][^>]*>/g)].map((match) => ({ tag: match[0], attrs: attributes(match[0]) }));
            const ids = tags.map((item) => item.attrs.id).filter(Boolean);
            assert.equal(new Set(ids).size, ids.length, `${route}: duplicate ids`);
            assert.match(html, new RegExp(`<html[^>]*lang=${target === 'en' ? 'en' : 'ru'}(?:[ >])`));
            assert.match(html, /rel=icon/);
            assert.match(html, /<main\b/);
            assert.match(html, /<title>/);
            pages.set(route, { html, tags, ids: new Set(ids) });
            const bytes = await readFile(path.join(site, 'html', filename));
            assert.deepEqual(brotliDecompressSync(await readFile(path.join(site, 'brotli', `${filename}.br`))), bytes);
            assert.deepEqual(gunzipSync(await readFile(path.join(site, 'gzip', `${filename}.gz`))), bytes);
        }

        const problems = [];

        for (const [route, page] of pages) {
            for (const { attrs } of page.tags) {
                for (const key of ['href', 'src']) {
                    const value = attrs[key];

                    if (!value || /^(?:[a-z]+:|\/\/)/i.test(value)) {
                        continue;
                    }

                    const url = new URL(value, `https://local.example${route}`);
                    const linked = pages.get(url.pathname);

                    if (!linked && !assetRoutes.has(url.pathname)) {
                        problems.push(`${route}: missing ${value}`);
                    } else if (linked && url.hash && !linked.ids.has(decodeURIComponent(url.hash.slice(1)))) {
                        problems.push(`${route}: missing anchor ${value}`);
                    }
                }
            }
        }

        assert.deepEqual(problems, []);
        const homePage = pages.get('/');

        for (const control of ['theme-toggle', 'menu-toggle', 'search-trigger']) {
            const button = homePage.tags.find(({ attrs }) => attrs.class?.split(' ').includes(control));

            if (button) {
                assert.match(button.tag, /\shidden(?:\s|>)/, `${control}: initial control must wait for its handler`);
            }
        }
        assert.ok(homePage.tags.some(({ attrs, tag }) => attrs.id === 'main-nav' && !/\shidden(?:\s|>)/.test(tag)), 'static navigation must exist before enhancement');
        assert.ok(Object.keys(manifest).some((file) => file.startsWith('css/')));
        assert.ok(Object.keys(manifest).some((file) => file.startsWith('js/')));
        const logo = await readFile(path.join(root, 'blocks/brand/brand.svg'), 'utf8');
        const logoHash = createHash('md5').update(logo).digest('hex').slice(0, 16);
        assert.match(pages.get('/').html, new RegExp(`src=/${logoHash}\\.svg`));

        if (target) {
            const other = target === 'ru' ? 'en' : 'ru';
            assert.match(pages.get('/how/start').html, new RegExp(`hreflang=${other}`));
            assert.ok(pages.get('/how/start').tags.some(({ attrs }) => attrs.class === 'page-navigation__link' && attrs.href === '/how/bemjson'), 'start guide must continue to the data model');
            const home = pages.get('/').html;
            const panelCode = (id) => decode(home.slice(home.indexOf(`id=${id}`)).match(/<code>([\s\S]*?)<\/code>/)[1].replace(/<\/?span[^>]*>/g, ''));
            assert.equal(panelCode('home-nu-panel'), await readFile(path.join(root, 'blocks/card/card.nu.ts'), 'utf8'), 'template source must be the actual block file');
            assert.equal(JSON.parse(panelCode('home-bemjson-panel')).block, 'card');
            assert.match(home, /sandbox=""/);
            assert.match(home, /home-markdown-html/);
            assert.doesNotMatch(home, /ГЕНЕРАТОР СТАТИЧЕСКИХ САЙТОВ|STATIC SITE GENERATOR/);
            const search = JSON.parse(await readFile(path.join(root, 'content/search-data.json'), 'utf8'));
            const startText = search[target].find((entry) => entry.url === '/how/start').text;
            assert.ok(!startText.includes('<a') && !startText.includes('href='), 'search snippets must omit HTML markup');
            assert.match(startText, /nuckty-starter/);
            const starter = JSON.parse(await readFile(path.join(root, 'content/downloads/receipt.json'), 'utf8'));
            const releases = new Set(Object.entries(starter[target].packages).map(([name, version]) => `${name}@${version}`));

            for (const [route, page] of pages) {
                if (!route.startsWith('/ext/')) {
                    continue;
                }

                for (const match of page.html.matchAll(/<pre\b[^>]*><code\b[^>]*>([\s\S]*?)<\/code>/g)) {
                    for (const line of decode(match[1].replace(/<\/?span[^>]*>/g, '')).split('\n')) {
                        if (!/^npm\s+install\s+/.test(line.trim())) {
                            continue;
                        }

                        for (const argument of line.trim().split(/\s+/).slice(2)) {
                            assert.ok(!/^nuckty(?:-ext-[\w-]+)?(?:@.*)?$/.test(argument), `${route}: legacy package name ${argument}`);
                            assert.ok(!argument.startsWith('./packages/'), `${route}: local archive installation ${argument}`);

                            if (argument.startsWith('@nuckty/')) {
                                assert.ok(releases.has(argument), `${route}: missing exact public release ${argument}`);
                            }
                        }
                    }
                }
            }
        } else {
            const gallery = pages.get('/media').html;
            assert.match(pages.get('/').html, /id=playground-input/);
            assert.equal(pages.get('/').tags.filter(({ attrs }) => attrs.class === 'gallery__image').length, 3, 'home must include the actual gallery');
            assert.equal((gallery.match(/class=gallery__image/g) ?? []).length, 3);
            assert.equal(pages.get('/media').tags.filter(({ attrs }) => attrs.class === 'gallery__image' && attrs.loading === 'lazy').length, 2);
            assert.ok(pages.get('/playground').tags.some(({ tag, attrs }) => tag.startsWith('<iframe') && attrs.sandbox === ''), 'preview must use an empty sandbox');
            assert.match(pages.get('/markdown').html, /data-view=source/);
            assert.match(pages.get('/markdown').html, /Текст\u00a0— это контент/);
            const snapshot = JSON.parse(await readFile(path.join(site, 'build-files.txt'), 'utf8'));

            for (const [file, entry] of Object.entries(snapshot)) {
                assert.deepEqual(entry, manifest[file], `snapshot ${file}`);
            }
        }
    });
}
