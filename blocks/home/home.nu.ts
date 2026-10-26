import { highlightCode } from '../../ext/highlight.js';
import { previewDocument } from './markdown-preview.js';
import { block, type BEMTree, type BemNode } from 'nuckty';
import type { HomeExample } from './home.typings.js';

const el = (tag: string, cls: string, content: BEMTree, attrs: BemNode['attrs'] = {}): BemNode => ({ tag, cls, content, attrs, bem: false });
const link = (href: string, text: BEMTree, cls = ''): BemNode => el('a', cls, text, { href });
const arrow = (): BemNode => el('svg', 'home-arrow', el('path', '', null, { d: 'M5 19 19 5M5 5h14v14' }), { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'aria-hidden': 'true' });
const lines = (first: string, second: string): BEMTree => [el('span', '', first), el('span', '', second)];

export default function templates(): void {
    block<{ lang?: string; demoUrl?: string; example?: HomeExample }>('home').replace((node) => {
        const ru = node.props?.lang === 'ru';
        const example = node.props?.example;

        if (!example) {
            throw new Error('Home requires the example prepared by the HTML hook');
        }
        const demoUrl = node.props?.demoUrl ?? 'http://localhost:8092';
        const pipeline = [
            ['Markdown', ru ? 'Пишите контент' : 'Write the content', '/how/markdown'],
            ['BEMJSON', ru ? 'Описывайте блоки' : 'Describe the blocks', '/how/bemjson'],
            ['nu', ru ? 'Задавайте разметку' : 'Define the markup', '/how/templates'],
            ['HTML', ru ? 'Отдавайте файлы' : 'Serve the files', '/out/html'],
        ];
        const capabilities = ru ? [
            ['Контент', 'Страницы Markdown', 'Страницы HTML'],
            ['Структура', 'sitemap.yml', 'Адреса страниц'],
            ['Интерфейс', 'BEMJSON + шаблоны nu', 'Разметка блоков'],
            ['Языки', 'Переводы + таргеты', 'Отдельные сайты + hreflang'],
            ['Ассеты', 'CSS и JavaScript блоков', 'Бандлы с хешами'],
            ['Сжатие', 'Конвейер сборки', 'Копии Brotli и Gzip'],
            ['Хостинг', 'Конфигурация таргета', 'Файлы nginx и Apache'],
        ] : [
            ['Content', 'Markdown pages', 'HTML pages'],
            ['Structure', 'sitemap.yml', 'Page URLs'],
            ['Interface', 'BEMJSON + nu templates', 'Block markup'],
            ['Languages', 'Translations + targets', 'Separate sites + hreflang'],
            ['Assets', 'Block CSS and JavaScript', 'Hashed bundles'],
            ['Compression', 'Build pipeline', 'Brotli and Gzip copies'],
            ['Hosting', 'Target configuration', 'nginx and Apache files'],
        ];

        return el('div', 'home', [
            el('section', 'home-hero', [
                el('h1', 'home-hero__title', [
                    el('span', 'home-hero__in', ru ? 'Текст на входе.' : 'Text in.'),
                    el('span', 'home-hero__out', ru ? 'Сайты на выходе.' : 'Sites out.'),
                ]),
                el('div', 'home-hero__lower', [
                    el('div', 'home-hero__description', [
                        el('p', 'home-hero__intro', ru ? 'Генератор статических сайтов для документации, руководств и контентных проектов.' : 'A static site generator for documentation, guides and content websites.'),
                        el('p', 'home-hero__detail', ru ? 'Markdown, BEMJSON и шаблоны блоков на TypeScript.' : 'Markdown, BEMJSON and TypeScript block templates.'),
                    ]),
                    link('#try', [ru ? 'Посмотреть в работе' : 'See it work', arrow()], 'home-hero__link'),
                    el('div', 'home-hero__bottom', [
                        el('span', '', ru ? 'Ваш текст. Ваша разметка. Ваши файлы.' : 'Your words. Your markup. Your files.'),
                        link('https://github.com/nuckty/nuckty/blob/main/LICENSE', ru ? 'Открытый код, лицензия MIT' : 'Open source, MIT licensed'),
                    ]),
                ]),
            ]),
            el('section', 'home-route home-chapter', [
                el('div', 'home-chapter__heading', [
                    el('h2', '', lines(ru ? 'У каждого слова' : 'Every word', ru ? 'свой маршрут.' : 'has a route.')),
                    el('p', '', ru ? 'Markdown становится деревом BEMJSON. Шаблоны nu превращают дерево в HTML. Один движок для контента и интерфейса.' : 'Markdown becomes a BEMJSON tree. nu templates turn the tree into HTML. One engine for content and layout.'),
                ]),
                el('nav', 'home-route__steps', pipeline.map(([name, description, href]) => link(href ?? '/', [el('span', 'home-route__name', name ?? ''), el('span', 'home-route__detail', description ?? '')], 'home-route__step')), { 'aria-label': ru ? 'От исходника к странице' : 'From source to page' }),
                el('div', 'home-source-grid', [
                    el('figure', 'home-source', [el('figcaption', '', ru ? 'Блок · BEMJSON' : 'The block · BEMJSON'), el('pre', 'code-window__code', el('code', '', { raw: highlightCode(example.input, 'json') }))], { id: 'home-bemjson-panel' }),
                    el('figure', 'home-source', [el('figcaption', '', ru ? 'Разметка · шаблон nu' : 'The markup · nu template'), el('pre', 'code-window__code', el('code', '', { raw: highlightCode(example.template, 'ts') }))], { id: 'home-nu-panel' }),
                ]),
            ]),
            el('section', 'home-proof home-chapter', [
                el('div', 'home-chapter__heading', [
                    el('h2', '', lines(ru ? 'Написано.' : 'Written.', ru ? 'Отображено.' : 'Rendered.')),
                    el('div', 'home-chapter__copy', [
                        el('p', '', ru ? 'Измените заголовок или абзац. Посмотрите на страницу, а затем — на её HTML.' : 'Change the heading or paragraph. Read the page, then inspect its HTML.'),
                        el('p', 'home-note', ru ? 'Этот предпросмотр поддерживает заголовки и абзацы. Полная сборка nuckty выполняется в Node.js.' : 'This preview supports headings and paragraphs. The complete nuckty build runs in Node.js.'),
                    ]),
                ]),
                el('div', 'home-markdown', [
                    el('div', 'home-markdown__formats', [el('span', '', '.md'), el('span', '', '.html')], { 'aria-hidden': 'true' }),
                    el('div', 'home-markdown__input', [
                        el('div', 'home-markdown__toolbar', [el('label', '', ru ? 'Ваш Markdown' : 'Your Markdown', { for: 'home-markdown-input' }), el('button', 'home-markdown__reset', ru ? 'Сбросить' : 'Reset', { type: 'button' })]),
                        el('textarea', '', example.markdown.source, { id: 'home-markdown-input', spellcheck: 'false', rows: '7', 'aria-describedby': 'home-markdown-hint' }),
                        el('p', 'home-note', ru ? 'Попробуйте заголовок с # в начале, а затем — абзац.' : 'Try a heading starting with #, then a paragraph.', { id: 'home-markdown-hint' }),
                    ]),
                    el('div', 'home-markdown__result', [
                        el('div', 'home-markdown__toolbar', [el('span', '', ru ? 'Что увидит читатель' : 'What the reader sees'), el('div', 'home-markdown__tabs', [
                            el('button', '', ru ? 'Страница' : 'Page', { type: 'button', role: 'tab', id: 'home-page-tab', 'aria-selected': 'true', 'aria-controls': 'home-page-panel', tabindex: '0' }),
                            el('button', '', 'HTML', { type: 'button', role: 'tab', id: 'home-html-tab', 'aria-selected': 'false', 'aria-controls': 'home-html-panel', tabindex: '-1' }),
                        ], { role: 'tablist', 'aria-label': ru ? 'Формат предпросмотра' : 'Preview format' })]),
                        el('div', '', el('iframe', '', null, { title: ru ? 'Предпросмотр страницы' : 'Page preview', sandbox: '', srcdoc: previewDocument(example.markdown.html, ru ? 'ru' : 'en') }), { id: 'home-page-panel', role: 'tabpanel', 'aria-labelledby': 'home-page-tab' }),
                        el('div', '', el('pre', 'code-window__code', el('code', '', example.markdown.html, { id: 'home-markdown-html' })), { id: 'home-html-panel', role: 'tabpanel', 'aria-labelledby': 'home-html-tab', hidden: true }),
                    ]),
                ], { id: 'try' }),
                link(demoUrl, [ru ? 'Открыть полное демо nuckty' : 'Explore the full nuckty demo', arrow()], 'home-text-link home-proof__more'),
            ]),
            el('section', 'home-output home-chapter', [
                el('div', 'home-output__copy', [
                    el('h2', '', lines(ru ? 'Одна сборка.' : 'Build once.', ru ? 'Файлы остаются у вас.' : 'Keep the files.')),
                    el('p', '', ru ? 'Страницы, ассеты, сжатые копии и манифест. Сборка готовит конфигурацию nginx и Apache для совместимого сервера.' : 'Pages, assets, compressed copies and a manifest. The build prepares nginx and Apache configuration for a compatible server.'),
                    el('p', 'home-note', ru ? 'Чтобы отдавать страницы, серверу не нужен nuckty.' : 'The server does not need nuckty to serve the pages.'),
                    link('/out/hosting', [ru ? 'Подробнее о хостинге' : 'Read about hosting', arrow()], 'home-text-link'),
                    el('figure', 'home-source home-source_map', [el('figcaption', '', ru ? 'Карта маршрутов · sitemap.yml' : 'The route map · sitemap.yml'), el('pre', '', el('code', '', { raw: highlightCode(ru ? 'sitemap:\n  - Главная [/, index.md]\n  - О сайте [/about, about.md]' : 'sitemap:\n  - Home [/, index.md]\n  - About [/about, about.md]', 'yaml') }))]),
                ]),
                el('div', 'home-files', [
                    el('h3', '', ru ? 'Что содержит сборка' : 'What your build contains'),
                    el('dl', 'home-files__list', [
                        ['html/', ru ? 'Страницы' : 'Pages'], ['css/ · js/', ru ? 'Стили и скрипты' : 'Styles & scripts'], ['svg/ · png/', ru ? 'Изображения' : 'Images'], ['brotli/ · gzip/', ru ? 'Сжатые копии' : 'Compressed copies'], ['manifest.json', ru ? 'Размеры и хэши' : 'Sizes & hashes'], ['.htaccess', 'Apache'], ['.build/nginx.conf', 'nginx'],
                    ].flatMap(([file, description]) => [el('dt', '', el('code', '', file ?? '')), el('dd', '', description ?? '')])),
                    el('p', 'home-files__note', ru ? 'Статический артефакт. Готов к публикации.' : 'A static artifact. Ready to publish.'),
                    el('pre', 'home-files__tree', el('code', '', 'site/\n├── html/\n├── css/\n├── svg/\n├── brotli/\n├── gzip/\n├── .htaccess\n└── manifest.json')),
                ]),
            ]),
            el('section', 'home-capabilities home-chapter', [
                el('div', 'home-chapter__heading', [
                    el('h2', '', lines(ru ? 'Вы пишете.' : 'You write.', ru ? 'nuckty собирает.' : 'nuckty builds.')),
                    el('p', '', ru ? 'Храните контент, шаблоны и логику сборки в своём проекте. Добавляйте возможности через расширения.' : 'Keep content, templates and build logic in your project. Add capabilities through extensions.'),
                ]),
                el('div', 'home-table', el('table', '', [
                    el('caption', 'visually-hidden', ru ? 'Что вы задаёте и что создаёт сборка nuckty' : 'What you provide and what the nuckty build produces'),
                    el('thead', '', el('tr', '', [ru ? 'В вашем проекте' : 'In your project', ru ? 'Вы задаёте' : 'You provide', ru ? 'nuckty создаёт' : 'nuckty produces'].map((text) => el('th', '', text, { scope: 'col' })))),
                    el('tbody', '', capabilities.map(([label, input, output]) => el('tr', '', [el('th', '', label ?? '', { scope: 'row' }), el('td', '', input ?? ''), el('td', '', output ?? '')]))),
                ])),
                el('div', 'home-boundary', [
                    el('h3', '', ru ? 'Статическая часть.' : 'The static part.'),
                    el('p', '', ru ? 'Для динамических данных, серверной авторизации или постоянного состояния приложения nuckty собирает статическую часть. CMS, серверный API и визуальный редактор находятся за пределами ядра. Блоки могут содержать клиентский JavaScript.' : 'For dynamic data, server authentication or persistent application state, nuckty builds the static part. A CMS, server API and visual editor are outside the core. Blocks can include client JavaScript.'),
                    link(ru ? '/use-cases#для-каких-проектов-когда-понадобится-другой-инструмент' : '/use-cases#use-cases-when-another-tool-is-needed', ru ? 'Где подходит nuckty' : 'Where nuckty fits', 'home-text-link'),
                ]),
            ]),
            el('section', 'home-fit home-chapter', [
                el('h2', '', lines(ru ? 'Дом' : 'A home for', ru ? 'для ваших слов.' : 'your words.')),
                el('p', 'home-fit__description', ru ? 'nuckty подходит проектам, где контент хранится в файлах, а страницы можно собрать заранее. Документация, руководства и статьи используют один и тот же движок.' : 'nuckty fits projects where content lives in files and pages can be built ahead of time. Documentation, guides and articles use the same engine.'),
                link('/use-cases', ru ? 'Где подходит nuckty' : 'Where nuckty fits', 'home-text-link'),
            ]),
            el('section', 'home-start home-chapter', [
                el('h2', '', lines(ru ? 'Следующая страница' : 'The next page', ru ? 'за вами.' : 'is yours.')),
                el('div', 'home-start__actions', [
                    link('/how/start', [ru ? 'Открыть руководство' : 'Open the guide', arrow()], 'home-start__primary'),
                    link('/nuckty-starter.zip', ru ? 'Скачать стартовый проект' : 'Download starter', 'home-start__download'),
                ]),
            ]),
        ]);
    });
}
