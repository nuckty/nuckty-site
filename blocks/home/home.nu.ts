import { messages } from './home.i18n/index.js';
import { highlightCode } from '../../ext/highlight.js';
import { previewDocument } from './markdown-preview.js';
import type { HomeExample } from './home.typings.js';
import { block, type BEMTree, type BemNode, b, attributes } from '@nuckty/core';

const arrow = (): BemNode => b('home', 'arrow', b('home', 'arrow-path'));
const lines = (first: string, second: string): BEMTree => [b('home', 'text', first), ' ', b('home', 'text', second)];
function homeContent(
    node: Omit<BemNode, 'props'> & {
        props?: {
            lang?: string;
            demoUrl?: string;
            example?: HomeExample;
        };
    },
): BEMTree {
    const locale = node.props?.lang;
    const t = messages(locale);
    const example = node.props?.example;
    if (!example) {
        throw new Error('Home requires the example prepared by the HTML hook');
    }
    const demoUrl = node.props?.demoUrl ?? 'http://localhost:8092';
    const pipeline = [
        ['Markdown', t['Write the content'], '/how/markdown'],
        ['BEMJSON', t['Describe the blocks'], '/how/bemjson'],
        ['nu.ts', t['Define the markup'], '/how/templates'],
        ['HTML', t['Serve the files'], '/out/html'],
    ];
    const capabilities = t['capabilities'];
    return [
        b('home', 'hero', [
            b('home', 'hero-title', [
                b('home', 'hero-in', b('home', 'hero-line', t['Text in.'])),
                ' ',
                b('home', 'hero-out', b('home', 'hero-line', t['Sites out.'])),
            ]),
            b('home', 'hero-lower', [
                b('home', 'hero-description', [
                    b(
                        'home',
                        'hero-intro',
                        t['A static site generator for documentation, guides and content websites.'],
                    ),
                    b('home', 'hero-detail', t['Markdown, BEMJSON and TypeScript block templates.']),
                ]),
                b('home', 'hero-link', [t['See it work'], arrow()], { active: false }),
                b('home', 'hero-bottom', [
                    b('home', 'text', t['Your words. Your markup. Your files.']),
                    b('home', 'link', t['Open source, MIT licensed'], {
                        active: false,
                    }),
                ]),
            ]),
        ]),
        b(
            'home',
            'route',
            [
                b('home', 'chapter-heading', [
                    b('home', 'heading', lines(t['Every word'], t['has a route.'])),
                    b(
                        'home',
                        'paragraph',
                        t[
                            'Markdown becomes a BEMJSON tree. nu.ts templates turn the tree into HTML. One engine for content and layout.'
                        ],
                    ),
                ]),
                b(
                    'home',
                    'route-steps',
                    pipeline.map(([name, description, href]) =>
                        b(
                            'home',
                            'route-step',
                            [b('home', 'route-name', name ?? ''), b('home', 'route-detail', description ?? '')],
                            { href: href ?? '/', active: false },
                        ),
                    ),
                    { 'aria-label': t['From source to page'] },
                ),
                b('home', 'source-grid', [
                    b(
                        'home',
                        'source',
                        [
                            b('home', 'caption', t['The block · BEMJSON']),
                            b('code-window', 'code', b('home', 'code', { raw: highlightCode(example.input, 'json') })),
                        ],
                        { id: 'home-bemjson-panel' },
                    ),
                    b(
                        'home',
                        'source',
                        [
                            b('home', 'caption', t['The markup · nu.ts template']),
                            b('code-window', 'code', b('home', 'code', { raw: highlightCode(example.template, 'ts') })),
                        ],
                        { id: 'home-nu-panel' },
                    ),
                ]),
            ],
            {},
            { mix: [{ block: 'home', elem: 'chapter' }] },
        ),
        b(
            'home',
            'proof',
            [
                b('home', 'chapter-heading', [
                    b('home', 'heading', lines(t['Written.'], t['Rendered.'])),
                    b('home', 'chapter-copy', [
                        b(
                            'home',
                            'paragraph',
                            t['Change the heading or paragraph. Read the page, then inspect its HTML.'],
                        ),
                        b(
                            'home',
                            'note',
                            t[
                                'This preview supports headings and paragraphs. The complete nuckty build runs in Node.js.'
                            ],
                        ),
                    ]),
                ]),
                b('home', 'markdown', [
                    b('home', 'markdown-input', [
                        b('home', 'markdown-format', '.md'),
                        b('home', 'markdown-toolbar', [
                            b('home', 'input-label', t['Your Markdown']),
                            b('home', 'markdown-reset', t['Reset']),
                        ]),
                        b('home', 'editor', example.markdown.source),
                        b('home', 'note', t['Try a heading starting with #, then a paragraph.'], {
                            id: 'home-markdown-hint',
                        }),
                    ]),
                    b('home', 'markdown-result', [
                        b('home', 'markdown-format', '.html'),
                        b('home', 'markdown-toolbar', [
                            b('home', 'text', t['What the reader sees']),
                            b(
                                'home',
                                'markdown-tabs',
                                [
                                    b('home', 'tab', t['Page'], {
                                        id: 'home-page-tab',
                                        'aria-selected': 'true',
                                        'aria-controls': 'home-page-panel',
                                        tabindex: '0',
                                    }),
                                    b('home', 'tab', 'HTML', {
                                        id: 'home-html-tab',
                                        'aria-selected': 'false',
                                        'aria-controls': 'home-html-panel',
                                        tabindex: '-1',
                                    }),
                                ],
                                { 'aria-label': t['Preview format'] },
                            ),
                        ]),
                        b(
                            'home',
                            'panel',
                            b('home', 'preview', null, {
                                title: t['Page preview'],

                                srcdoc: previewDocument(example.markdown.html, locale ?? 'en'),
                            }),
                            { id: 'home-page-panel', 'aria-labelledby': 'home-page-tab' },
                        ),
                        b(
                            'home',
                            'panel',
                            b(
                                'code',
                                undefined,
                                b('home', 'code', example.markdown.html, { id: 'home-markdown-html' }),
                                {},
                                { mods: { wrap: 'soft' }, mix: [{ block: 'code-window', elem: 'code' }] },
                            ),
                            {
                                id: 'home-html-panel',

                                'aria-labelledby': 'home-html-tab',
                                hidden: true,
                            },
                        ),
                    ]),
                ]),
                b(
                    'home',
                    'text-link',
                    [t['Explore the full nuckty demo'], arrow()],
                    { href: demoUrl, active: false },
                    { mix: [{ block: 'home', elem: 'proof-more' }] },
                ),
            ],
            {},
            { mix: [{ block: 'home', elem: 'chapter' }] },
        ),
        b(
            'home',
            'output',
            [
                b('home', 'output-copy', [
                    b('home', 'heading', lines(t['Build once.'], t['Keep the files.'])),
                    b(
                        'home',
                        'paragraph',
                        t[
                            'Pages, assets, compressed copies and a manifest. The build prepares nginx and Apache configuration for a compatible server.'
                        ],
                    ),
                    b('home', 'note', t['The server does not need nuckty to serve the pages.']),
                    b('home', 'text-link', [t['Read about hosting'], arrow()], {
                        href: '/out/hosting',
                        active: false,
                    }),
                    b(
                        'home',
                        'source',
                        [
                            b('home', 'caption', t['The route map · sitemap.yml']),
                            b(
                                'home',
                                'snippet',
                                b('home', 'code', {
                                    raw: highlightCode(
                                        t['sitemap:\n  - Home [/, index.md]\n  - About [/about, about.md]'],
                                        'yaml',
                                    ),
                                }),
                            ),
                        ],
                        {},
                        { elemMods: { map: true } },
                    ),
                ]),
                b('home', 'files', [
                    b('home', 'subheading', t['What your build contains']),
                    b(
                        'home',
                        'files-list',
                        [
                            ['html/', t['Pages']],
                            ['css/ · js/', t['Styles & scripts']],
                            ['svg/ · png/', t['Images']],
                            ['brotli/ · gzip/', t['Compressed copies']],
                            ['manifest.json', t['Sizes & hashes']],
                            ['.htaccess', 'Apache'],
                            ['.build/nginx.conf', 'nginx'],
                        ].flatMap(([file, description]) => [
                            b('home', 'file-name', b('home', 'code', file ?? '')),
                            b('home', 'file-description', description ?? ''),
                        ]),
                    ),
                    b('home', 'files-note', t['A static artifact. Ready to publish.']),
                    b(
                        'home',
                        'files-tree',
                        b(
                            'home',
                            'code',
                            'site/\n├── html/\n├── css/\n├── svg/\n├── brotli/\n├── gzip/\n├── .htaccess\n└── manifest.json',
                        ),
                    ),
                ]),
            ],
            {},
            { mix: [{ block: 'home', elem: 'chapter' }] },
        ),
        b(
            'home',
            'capabilities',
            [
                b('home', 'chapter-heading', [
                    b('home', 'heading', lines(t['You write.'], t['nuckty builds.'])),
                    b(
                        'home',
                        'paragraph',
                        t[
                            'Keep content, templates and build logic in your project. Add capabilities through extensions.'
                        ],
                    ),
                ]),
                b(
                    'home',
                    'table',
                    b('home', 'comparison', [
                        b(
                            'home',
                            'comparison-caption',
                            t['What you provide and what the nuckty build produces'],
                            {},
                            { mix: [{ block: 'visually-hidden' }] },
                        ),
                        b(
                            'home',
                            'comparison-head',
                            b(
                                'home',
                                'comparison-row',
                                [t['In your project'], t['You provide'], t['nuckty produces']].map((text) =>
                                    b('home', 'comparison-heading', text, { scope: 'col' }),
                                ),
                            ),
                        ),
                        b(
                            'home',
                            'comparison-body',
                            capabilities.map(([label, input, output]) =>
                                b('home', 'comparison-row', [
                                    b('home', 'comparison-heading', label ?? '', { scope: 'row' }),
                                    b('home', 'comparison-cell', [
                                        b('home', 'table-label', t['You provide']),
                                        input ?? '',
                                    ]),
                                    b('home', 'comparison-cell', [
                                        b('home', 'table-label', t['nuckty produces']),
                                        output ?? '',
                                    ]),
                                ]),
                            ),
                        ),
                    ]),
                ),
                b('home', 'boundary', [
                    b('home', 'subheading', t['The static part.']),
                    b(
                        'home',
                        'paragraph',
                        t[
                            'For dynamic data, server authentication or persistent application state, nuckty builds the static part. A CMS, server API and visual editor are outside the core. Blocks can include client JavaScript.'
                        ],
                    ),
                    b('home', 'text-link', t['When you need another tool'], {
                        href: t['/use-cases#use-cases-when-another-tool-is-needed'],
                        active: false,
                    }),
                ]),
            ],
            {},
            { mix: [{ block: 'home', elem: 'chapter' }] },
        ),
        b(
            'home',
            'fit',
            [
                b('home', 'heading', t['A home for your words.']),
                b(
                    'home',
                    'fit-description',
                    t[
                        'nuckty fits projects where content lives in files and pages can be built ahead of time. Documentation, guides and articles use the same engine.'
                    ],
                ),
                b('home', 'text-link', t['Where nuckty fits'], { href: '/use-cases', active: false }),
            ],
            {},
            { mix: [{ block: 'home', elem: 'chapter' }] },
        ),
        b(
            'home',
            'start',
            [
                b('home', 'heading', t['The next page is yours.']),
                b('home', 'start-actions', [
                    b('home', 'start-primary', [t['Open the guide'], arrow()], {
                        active: false,
                    }),
                    b('home', 'start-download', t['Download starter'], {
                        active: false,
                    }),
                ]),
            ],
            {},
            { mix: [{ block: 'home', elem: 'chapter' }] },
        ),
    ];
}

export default function templates(): void {
    block('home').elem('arrow-path')({
        tag: 'path',
        attrs: (node, next) => ({ d: 'M5 19 19 5M5 5h14v14', ...next(), ...attributes(node, ['d']) }),
    });
    block('home').elem('arrow')({
        tag: 'svg',
        attrs: (node, next) => ({
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '1.5',
            'aria-hidden': 'true',
            ...next(),
            ...attributes(node, ['viewBox', 'fill', 'stroke', 'stroke-width', 'aria-hidden']),
        }),
    });
    block('home').elem('text')({
        tag: 'span',
    });
    block('home').elem('hero-line')({
        tag: 'span',
    });
    block('home').elem('hero-in')({
        tag: 'span',
    });
    block('home').elem('hero-out')({
        tag: 'span',
    });
    block('home').elem('hero-title')({
        tag: 'h1',
    });
    block('home').elem('hero-intro')({
        tag: 'p',
    });
    block('home').elem('hero-detail')({
        tag: 'p',
    });
    block('home').elem('hero-description')({
        tag: 'div',
    });
    block('home').elem('hero-link')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) => ({ ...next(), href: '#try' }),
    });
    block('home').elem('link')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) => ({ ...next(), href: 'https://github.com/nuckty/nuckty/blob/main/LICENSE' }),
    });
    block('home').elem('hero-bottom')({
        tag: 'div',
    });
    block('home').elem('hero-lower')({
        tag: 'div',
    });
    block('home').elem('hero')({
        tag: 'section',
    });
    block('home').elem('heading')({
        tag: 'h2',
    });
    block('home').elem('paragraph')({
        tag: 'p',
    });
    block('home').elem('chapter-heading')({
        tag: 'div',
    });
    block('home').elem('route-name')({
        tag: 'span',
    });
    block('home').elem('route-detail')({
        tag: 'span',
    });
    block('home').elem('route-step')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) =>
            node.props?.active
                ? { ...next(), 'aria-current': 'page' }
                : { ...next(), href: String(node.props?.href ?? '') },
    });
    block('home').elem('route-steps')({
        tag: 'nav',
        attrs: (node, next) => ({ ...next(), ...attributes(node, ['aria-label']) }),
    });
    block('home').elem('caption')({
        tag: 'figcaption',
    });
    block('home').elem('code')({
        tag: 'code',
        attrs: (node, next) => ({ ...next(), ...attributes(node, ['id']) }),
    });
    block('home').elem('source')({
        tag: 'figure',
        attrs: (node, next) => ({ ...next(), ...attributes(node, ['id']) }),
    });
    block('home').elem('source-grid')({
        tag: 'div',
    });
    block('home').elem('route')({
        tag: 'section',
    });
    block('home').elem('note')({
        tag: 'p',
        attrs: (node, next) => ({ ...next(), ...attributes(node, ['id']) }),
    });
    block('home').elem('chapter-copy')({
        tag: 'div',
    });
    block('home').elem('markdown-format')({
        tag: 'p',
        attrs: (node, next) => ({ 'aria-hidden': 'true', ...next(), ...attributes(node, ['aria-hidden']) }),
    });
    block('home').elem('input-label')({
        tag: 'label',
        attrs: (node, next) => ({ for: 'home-markdown-input', ...next(), ...attributes(node, ['for']) }),
    });
    block('home').elem('markdown-reset')({
        tag: 'button',
        attrs: (node, next) => ({ type: 'button', ...next(), ...attributes(node, ['type']) }),
    });
    block('home').elem('markdown-toolbar')({
        tag: 'div',
    });
    block('home').elem('editor')({
        tag: 'textarea',
        attrs: (node, next) => ({
            id: 'home-markdown-input',
            spellcheck: 'false',
            rows: '7',
            'aria-describedby': 'home-markdown-hint',
            ...next(),
            ...attributes(node, ['id', 'spellcheck', 'rows', 'aria-describedby']),
        }),
    });
    block('home').elem('markdown-input')({
        tag: 'div',
    });
    block('home').elem('tab')({
        tag: 'button',
        attrs: (node, next) => ({
            type: 'button',
            role: 'tab',
            ...next(),
            ...attributes(node, ['type', 'role', 'id', 'aria-selected', 'aria-controls', 'tabindex']),
        }),
    });
    block('home').elem('markdown-tabs')({
        tag: 'div',
        attrs: (node, next) => ({ role: 'tablist', ...next(), ...attributes(node, ['role', 'aria-label']) }),
    });
    block('home').elem('preview')({
        tag: 'iframe',
        attrs: (node, next) => ({ sandbox: '', ...next(), ...attributes(node, ['title', 'sandbox', 'srcdoc']) }),
    });
    block('home').elem('panel')({
        tag: 'div',
        attrs: (node, next) => ({
            role: 'tabpanel',
            ...next(),
            ...attributes(node, ['id', 'role', 'aria-labelledby', 'hidden']),
        }),
    });
    block('home').elem('markdown-result')({
        tag: 'div',
    });
    block('home').elem('markdown')({
        tag: 'div',
        attrs: (node, next) => ({ id: 'try', ...next(), ...attributes(node, ['id']) }),
    });
    block('home').elem('text-link')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) =>
            node.props?.active
                ? { ...next(), 'aria-current': 'page' }
                : { ...next(), href: String(node.props?.href ?? '') },
    });
    block('home').elem('proof')({
        tag: 'section',
    });
    block('home').elem('snippet')({
        tag: 'pre',
    });
    block('home').elem('output-copy')({
        tag: 'div',
    });
    block('home').elem('subheading')({
        tag: 'h3',
    });
    block('home').elem('file-name')({
        tag: 'dt',
    });
    block('home').elem('file-description')({
        tag: 'dd',
    });
    block('home').elem('files-list')({
        tag: 'dl',
    });
    block('home').elem('files-note')({
        tag: 'p',
    });
    block('home').elem('files-tree')({
        tag: 'pre',
    });
    block('home').elem('files')({
        tag: 'div',
    });
    block('home').elem('output')({
        tag: 'section',
    });
    block('home').elem('comparison-caption')({
        tag: 'caption',
    });
    block('home').elem('comparison-heading')({
        tag: 'th',
        attrs: (node, next) => ({ ...next(), ...attributes(node, ['scope']) }),
    });
    block('home').elem('comparison-row')({
        tag: 'tr',
    });
    block('home').elem('comparison-head')({
        tag: 'thead',
    });
    block('home').elem('table-label')({
        tag: 'span',
        attrs: (node, next) => ({ 'aria-hidden': 'true', ...next(), ...attributes(node, ['aria-hidden']) }),
    });
    block('home').elem('comparison-cell')({
        tag: 'td',
    });
    block('home').elem('comparison-body')({
        tag: 'tbody',
    });
    block('home').elem('comparison')({
        tag: 'table',
        attrs: (node, next) => ({ role: 'table', ...next(), ...attributes(node, ['role']) }),
    });
    block('home').elem('table')({
        tag: 'div',
    });
    block('home').elem('boundary')({
        tag: 'div',
    });
    block('home').elem('capabilities')({
        tag: 'section',
    });
    block('home').elem('fit-description')({
        tag: 'p',
    });
    block('home').elem('fit')({
        tag: 'section',
    });
    block('home').elem('start-primary')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) => ({ ...next(), href: '/how/start' }),
    });
    block('home').elem('start-download')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) => ({ ...next(), href: '/nuckty-starter.zip' }),
    });
    block('home').elem('start-actions')({
        tag: 'div',
    });
    block('home').elem('start')({
        tag: 'section',
    });
    block('home')({
        tag: 'div',
    });
    block<{ lang?: string; demoUrl?: string; example?: import('./home.typings.js').HomeExample }>('home').when((node) =>
        Boolean(node.props),
    )({ content: homeContent });
}
