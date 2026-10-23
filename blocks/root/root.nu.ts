import { block, type BEMTree, type BemNode, type DocumentData } from 'nuckty';

const element = (tag: string, cls: string, content: BEMTree, attrs: BemNode['attrs'] = {}): BemNode => ({ tag, cls, content, attrs, bem: false });
const link = (href: string, text: BEMTree, cls = '', active = false): BemNode => element(active ? 'span' : 'a', cls, text, { ...(active ? { 'aria-current': 'page' } : { href }) });
const mapLink = (href: string, text: string, cls = '', active = false): BemNode => link(href, element('span', 'site-map__text', text), cls, active);
const icon = (cls: string, content: BEMTree): BemNode => element('svg', cls, content, { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false' });

export default function templates(): void {
    block<DocumentData>('root').when((node) => Boolean(node.props)).wrap((node) => {
        const data = node.props;

        if (!data) {
            throw new Error('Website root requires document data');
        }

        const ru = data.lang === 'ru';
        const demo = data.target?.data?.['kind'] === 'demo';
        const landing = data.page.layout === 'landing';
        const url = data.page.url;
        const title = `${data.page.name}${url === '/' ? '' : ' · nuckty'}`;
        const origin = demo ? 'https://demo.nuckty.ru' : `https://${data.target?.host ?? 'nuckty.ru'}`;
        const description = ru ? 'Генератор статических сайтов: Markdown, шаблоны BEMJSON, расширения и готовый артефакт для nginx и Apache.' : 'A static site generator with Markdown, BEMJSON templates, extensions and build artifacts for nginx and Apache.';
        const brand = data.assets.images['brand/brand.svg'];
        const brandDark = data.assets.images['brand/brand-dark.svg'];
        const favicon = data.assets.images['brand/favicon.svg'];
        const logo = element(url === '/' ? 'span' : 'a', 'brand', [
            ...(brand ? [element('img', 'brand__mark brand__mark_light', null, { src: `/${brand}`, alt: '', width: '62', height: '44' })] : []),
            ...(brandDark ? [element('img', 'brand__mark brand__mark_dark', null, { src: `/${brandDark}`, alt: '', width: '62', height: '44' })] : []),
            element('span', 'brand__name', demo ? 'nuckty demo' : 'nuckty'),
        ], { ...(url === '/' ? {} : { href: '/', 'aria-label': demo ? (ru ? 'nuckty demo — главная' : 'nuckty demo home') : (ru ? 'nuckty — главная' : 'nuckty home') }) });
        const siteUrl = String(data.target?.data?.['siteUrl'] ?? 'http://localhost:8091');
        const demoUrl = String(data.target?.data?.['demoUrl'] ?? 'http://localhost:8092');
        const navigation: BEMTree = demo ? [
            link('/', 'Возможности', '', url === '/'),
            link('/markdown', 'Markdown', '', url === '/markdown'),
            link('/media', 'Галерея и сетка', '', url === '/media'),
            link('/playground', 'Редактор', '', url === '/playground'),
            link('/output', 'Файлы', '', url === '/output'),
            link(siteUrl, 'О nuckty ↗'),
        ] : [
            link('/use-cases', ru ? 'Применение' : 'Use cases', '', url === '/use-cases'),
            link('/how/start', ru ? 'Руководство' : 'Get started', '', url === '/how/start'),
            link('/docs', ru ? 'Документация' : 'Docs', '', url !== '/' && url !== '/use-cases' && url !== '/how/start'),
            link(demoUrl, ru ? 'Демо ↗' : 'Demo ↗'),
        ];
        const alternateUrl = `${data.target?.data?.['alternateOrigin'] ?? (ru ? 'https://nuckty.com' : 'https://nuckty.ru')}${url}`;
        const pages = Object.values(data.sitemap.pages).filter((page) => page.url !== '/' && page.url !== '/use-cases');
        const groups = demo ? [['', 'Примеры']] : [
            ['/docs', ru ? 'Обзор' : 'Overview'],
            ['/how', ru ? 'Как пользоваться' : 'How to use it'],
            ['/out', ru ? 'Результат сборки' : 'Build output'],
            ['/ext', ru ? 'Расширения' : 'Extensions'],
            ['/why', ru ? 'Почему так' : 'Why this way'],
        ];
        const search = !demo ? element('div', 'header-search', [
            element('div', 'header-search__bar', [
                element('label', 'visually-hidden', ru ? 'Поиск по сайту' : 'Search this site', { for: 'search-input' }),
                element('input', 'header-search__input', null, { id: 'search-input', type: 'search', placeholder: ru ? 'Поиск по сайту…' : 'Search this site…', autocomplete: 'off' }),
                element('button', 'icon-button search-close', icon('control-icon', element('path', '', null, { d: 'm6 6 12 12M6 18 18 6' })), { type: 'button', 'aria-label': ru ? 'Закрыть поиск' : 'Close search' }),
            ]),
            element('div', 'header-search__panel', [
                element('div', 'search-loading', [
                    element('span', 'search-loading__label', ru ? 'Загрузка поиска…' : 'Loading search…'),
                    element('progress', 'search-loading__progress', '', { max: '100', 'aria-label': ru ? 'Загрузка поискового индекса' : 'Loading the search index' }),
                ], { hidden: true, role: 'status' }),
                element('p', 'search-hint', ru ? 'Название, термин или команда.' : 'Search a title, concept or command.', { role: 'status' }),
                element('div', 'search-results', null, { 'aria-live': 'polite' }),
                element('nav', 'site-map', [
                    element('section', 'site-map__group', [
                        element('h2', 'site-map__heading', mapLink('/', ru ? 'О nuckty' : 'About nuckty', 'site-map__title', url === '/')),
                        element('div', 'site-map__links', [
                            mapLink('/use-cases', ru ? 'Применение' : 'Use cases', 'site-map__link', url === '/use-cases'),
                            mapLink('/docs', ru ? 'Документация' : 'Documentation', 'site-map__link', url === '/docs'),
                            mapLink(demoUrl, ru ? 'Демо' : 'Demo', 'site-map__link'),
                        ]),
                    ]),
                    ...groups.filter(([prefix]) => prefix !== '/docs').map(([prefix, label]) => element('section', 'site-map__group', [
                        element('h2', 'site-map__heading', mapLink(prefix ?? '', prefix === '/how' ? (ru ? 'Руководство' : 'Guide') : (label ?? ''), 'site-map__title', prefix === url)),
                        element('div', 'site-map__links', pages.filter((page) => page.url !== prefix && page.url.startsWith(`${prefix}/`)).map((page) => mapLink(page.url, page.name, `site-map__link${page.url.split('/').length > 3 ? ' site-map__link_nested' : ''}`, page.url === url))),
                    ])),
                ], { 'aria-label': ru ? 'Карта сайта' : 'Site map' }),
            ]),
        ], { id: 'site-search', role: 'search', 'aria-label': ru ? 'Поиск и навигация' : 'Search and navigation', 'data-index-bytes': String(data.page['searchIndexBytes'] ?? ''), 'data-engine-url': String(data.page['searchEngineUrl'] ?? ''), hidden: true }) : null;
        const header = element('header', 'header', [
            logo,
            element('nav', 'header__nav', navigation, { id: 'main-nav', 'aria-label': ru ? 'Основная навигация' : 'Main navigation' }),
            element('div', 'header__tools', [
                ...(!demo ? [link(alternateUrl, ru ? 'EN' : 'RU', 'language-link')] : []),
                element('button', 'icon-button theme-toggle', [
                    icon('control-icon theme-toggle__moon', element('path', '', null, { d: 'M20.6 13.5A8.5 8.5 0 0 1 10.5 3.4a8.5 8.5 0 1 0 10.1 10.1Z' })),
                    icon('control-icon theme-toggle__sun', [element('path', '', null, { d: 'M16 12a4 4 0 1 1 -8 0a4 4 0 0 1 8 0Z' }), element('path', '', null, { d: 'M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' })]),
                ], { type: 'button', 'aria-label': ru ? 'Тёмная тема' : 'Dark theme', hidden: true }),
                ...(!demo ? [element('button', 'icon-button search-trigger', [
                    icon('control-icon search-trigger__icon', [element('path', '', null, { d: 'M17 10.5a6.5 6.5 0 1 1 -13 0a6.5 6.5 0 0 1 13 0Z' }), element('path', '', null, { d: 'm16 16 5 5' })]),
                    element('span', 'search-trigger__label', ru ? 'Поиск' : 'Search'),
                ], { type: 'button', 'aria-label': ru ? 'Поиск' : 'Search', 'aria-controls': 'site-search', 'aria-expanded': 'false', hidden: true })] : []),
                element('button', 'icon-button menu-toggle', element('span', 'menu-toggle__line', '', { 'aria-hidden': 'true' }), { type: 'button', 'aria-label': ru ? 'Меню' : 'Menu', 'aria-controls': demo ? 'main-nav' : 'site-search', 'aria-expanded': 'false', hidden: true }),
            ]),
            search,
        ]);
        const sidebar = element('aside', 'sidebar', [
            element('nav', 'sidebar__sections', groups.map(([prefix, label]) => element('div', 'sidebar__group', [
                element('p', 'sidebar__label', label ?? ''),
                ...pages.filter((page) => page.url === prefix || page.url.startsWith(`${prefix}/`)).map((page) => link(page.url, page.name, `sidebar__link${page.url.split('/').length > 3 ? ' sidebar__link_nested' : ''}`, page.url === url)),
            ])), { id: 'doc-sections', 'aria-label': ru ? 'Разделы документации' : 'Documentation sections' }),
        ], { 'aria-label': ru ? 'Разделы' : 'Sections' });
        const headings = (data.page.headings ?? []).filter((heading) => heading.level === 2 || heading.level === 3);
        const toc = element('aside', 'toc', [
            element('p', 'sidebar__label', ru ? 'На этой странице' : 'On this page'),
            element('nav', 'toc__nav', headings.map((heading) => link(`#${heading.anchor}`, heading.text, heading.level === 3 ? 'toc__link toc__link_nested' : 'toc__link')), { 'aria-label': ru ? 'Заголовки страницы' : 'Page headings' }),
        ]);
        const index = pages.findIndex((page) => page.url === url);
        const neighbors = [pages[index - 1], pages[index + 1]];
        const main: BemNode = landing ? element('main', 'main main_landing', demo ? data.content : { block: 'home', props: { lang: data.lang, demoUrl, example: data.page['homeExample'] } }, { id: 'main' }) : element('main', 'main docs-layout', [
            element('div', 'reading-nav', [
                element('nav', 'breadcrumbs', element('ol', 'breadcrumbs__list', [link('/', demo ? 'Демо' : 'nuckty'), ...data.page.breadcrumbs.filter((route) => route !== url && Boolean(data.sitemap.pages[route])).map((route) => link(route, data.sitemap.pages[route]!.name))].map((item, i) => element('li', 'breadcrumbs__item', [
                    ...(i ? [element('span', 'breadcrumbs__separator', '/', { 'aria-hidden': 'true' })] : []), item,
                ]))), { 'aria-label': ru ? 'Путь к странице' : 'Breadcrumb' }),
            link(demo ? '/' : '/docs', demo ? 'Все примеры →' : (ru ? 'Все разделы →' : 'All sections →'), 'sidebar__fallback', url === (demo ? '/' : '/docs')),
            ]),
            sidebar,
            element('div', 'article-column', [
                element('article', 'article', data.content),
                element('nav', 'page-navigation', neighbors.map((page, i) => page ? element('a', 'page-navigation__link',
                    element('span', 'page-navigation__name', [
                        element('span', 'page-navigation__text', page.name),
                    ]),
                { href: page.url, rel: i === 0 ? 'prev' : 'next', 'data-direction': i === 0 ? 'previous' : 'next', 'aria-label': `${i === 0 ? (ru ? 'Предыдущая страница' : 'Previous page') : (ru ? 'Следующая страница' : 'Next page')}: ${page.name}` }) : null), { 'aria-label': ru ? 'Соседние страницы' : 'Neighboring pages' }),
            ]),
            toc,
        ], { id: 'main' });
        const footer = element('footer', 'footer', [
            element('div', 'footer__identity', [
                element(url === '/' ? 'span' : 'a', 'footer__brand', [
                    ...(brand ? [element('img', 'footer__mark brand__mark_light', null, { src: `/${brand}`, alt: '', width: '40', height: '28' })] : []),
                    ...(brandDark ? [element('img', 'footer__mark brand__mark_dark', null, { src: `/${brandDark}`, alt: '', width: '40', height: '28' })] : []),
                    element('strong', '', 'nuckty'),
                ], { ...(url === '/' ? {} : { href: demo ? siteUrl : '/', 'aria-label': ru ? 'nuckty — главная' : 'nuckty home' }) }),
                element('p', 'footer__caption', [element('span', 'footer__made', ru ? 'Сделано на nuckty.' : 'Made with nuckty.'), element('br', '', null), ru ? 'Конечно' : 'Of course']),
            ]),
            element('nav', 'footer__links', [
                link('https://github.com/nuckty/nuckty', 'GitHub'),
                ...(!demo ? [element('a', 'source-link', ru ? 'Исходник страницы' : 'Page source', { href: data.page.file.startsWith('docs/') ? `https://github.com/nuckty/nuckty-docs/blob/main/${data.page.file.slice(5)}` : `https://github.com/nuckty/nuckty-site/blob/main/${landing ? 'blocks/home/home.nu.ts' : `content/${data.page.file}`}`, 'aria-label': ru ? 'Исходник страницы на GitHub' : 'Page source on GitHub' })] : []),
                element('a', 'footer__license', 'MIT', { href: 'https://github.com/nuckty/nuckty/blob/main/LICENSE' }),
            ], { 'aria-label': ru ? 'Дополнительные ссылки' : 'More links' }),
        ]);
        const head: BEMTree = [
            element('meta', '', null, { charset: 'utf-8' }),
            element('title', '', title),
            element('meta', '', null, { name: 'viewport', content: 'width=device-width,initial-scale=1' }),
            element('meta', '', null, { name: 'description', content: description }),
            element('meta', '', null, { name: 'color-scheme', content: 'light dark' }),
            element('meta', '', null, { name: 'theme-color', content: '#f6f5ef' }),
            element('link', '', null, { rel: 'canonical', href: `${origin}${url}` }),
            element('meta', '', null, { property: 'og:title', content: title }),
            element('meta', '', null, { property: 'og:description', content: description }),
            element('meta', '', null, { property: 'og:type', content: 'website' }),
            element('meta', '', null, { property: 'og:url', content: `${origin}${url}` }),
            ...(favicon ? [element('link', '', null, { rel: 'icon', type: 'image/svg+xml', href: `/${favicon}` })] : []),
            ...Object.values(data.assets.css).filter((asset) => asset.hash !== 'empty').map((asset) => element('link', '', null, { rel: 'stylesheet', href: asset.url })),
            ...[...data.alternates].map(([lang, alternate]) => element('link', '', null, { rel: 'alternate', hreflang: lang, href: alternate.url })),
        ];

        return {
            tag: 'html', attrs: { lang: data.lang ?? 'ru', 'data-site': demo ? 'demo' : 'website' },
            content: [element('head', '', head), element('body', '', [
                link('#main', ru ? 'К содержимому' : 'Skip to content', 'skip-link'),
                header, main, footer,
                ...Object.values(data.assets.js).filter((asset) => asset.hash !== 'empty').map((asset) => element('script', '', '', { src: asset.url, defer: true })),
            ])],
        };
    });
}
