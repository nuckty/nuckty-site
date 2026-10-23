import { highlightCode } from '../../ext/highlight.js';
import { block, type BEMTree, type BemNode } from 'nuckty';
import type { HomeExample } from './home.typings.js';

const el = (tag: string, cls: string, content: BEMTree, attrs: BemNode['attrs'] = {}): BemNode => ({ tag, cls, content, attrs, bem: false });
const link = (href: string, text: string, cls = ''): BemNode => el('a', cls, text, { href });

export default function templates(): void {
    block<{ lang?: string; demoUrl?: string; example?: HomeExample }>('home').replace((node) => {
        const ru = node.props?.lang === 'ru';
        const example = node.props?.example;

        if (!example) {
            throw new Error('Home requires the example prepared by the HTML hook');
        }

        const features = ru ? [
            ['BEMJSON + nu', 'Один движок для текста и страницы', 'Markdown становится деревом BEMJSON. Шаблоны nu обрабатывают и контент, и блоки документа.', '/how/templates'],
            ['sitemap.yml', 'Адреса задаёт карта сайта', 'Структура страниц хранится в одном файле. Ссылки на исходники Markdown превращаются в адреса сайта.', '/how/sitemap'],
            ['ext[]', 'Возможности добавляют расширения', 'Галереи, видео, команды и стадии сборки подключаются через один контракт register(env).', '/ext'],
            ['targets', 'Общие блоки — несколько сайтов', 'Отдельные языки, домены и карты сайта. Именно так собраны русская и английская версии этого сайта.', '/how/targets'],
        ] : [
            ['BEMJSON + nu', 'One engine for content and layout', 'Markdown becomes a BEMJSON tree. nu templates process both content and document blocks.', '/how/templates'],
            ['sitemap.yml', 'Your sitemap defines the URLs', 'One file describes the page structure. Links to Markdown sources become website URLs.', '/how/sitemap'],
            ['ext[]', 'Extensions add the capabilities', 'Galleries, video, commands and build stages use the same register(env) contract.', '/ext'],
            ['targets', 'Shared blocks, separate websites', 'Each target has its own language, domain and sitemap. This website builds Russian and English that way.', '/how/targets'],
        ];
        const views = [['bemjson', 'BEMJSON', example.input], ['nu', ru ? 'Шаблон nu' : 'nu template', example.template], ['html', 'HTML', example.html]];
        const demoUrl = node.props?.demoUrl ?? 'http://localhost:8092';

        return el('div', 'home', [
            el('section', 'hero', [
                el('div', 'hero__text', [
                    el('p', 'eyebrow', ru ? 'ГЕНЕРАТОР СТАТИЧЕСКИХ САЙТОВ' : 'STATIC SITE GENERATOR'),
                    el('h1', 'hero__title', ru ? ['Собирайте сайты', el('br', '', null), 'из ', el('em', '', 'текста и блоков.')] : ['Build websites', el('br', '', null), 'from ', el('em', '', 'text and blocks.')]),
                    el('p', 'hero__intro', ru ? 'nuckty — для документации, руководств и контентных сайтов. Текст пишете в Markdown, интерфейс описываете блоками с шаблонами на TypeScript.' : 'nuckty is for documentation, guides and content websites. Write content in Markdown and build the interface with TypeScript block templates.'),
                    el('div', 'hero__actions', [link('/how/start', ru ? 'С чего начать →' : 'Get started →', 'button button_primary'), link(demoUrl, ru ? 'Попробовать демо ↗' : 'Try the demo ↗', 'button button_secondary')]),
                    el('div', 'hero__facts', [el('span', '', 'Node.js 24+'), el('span', '', 'MIT'), link('/use-cases', ru ? 'Для каких проектов ↗' : 'Is it a fit? ↗')]),
                ]),
                el('section', 'home-example', [
                    el('div', 'home-example__heading', [el('strong', '', ru ? 'Один блок → HTML' : 'One block → HTML'), el('span', '', ru ? 'Результат nuckty' : 'nuckty output')]),
                    el('div', 'home-example__sources', [
                        el('div', 'home-example__tabs', views.map(([id, label], index) => el('button', 'home-example__tab', label ?? '', { type: 'button', role: 'tab', id: `home-${id}-tab`, 'aria-selected': String(index === 0), 'aria-controls': `home-${id}-panel`, tabindex: index === 0 ? '0' : '-1' })), { role: 'tablist', 'aria-label': ru ? 'Этапы сборки блока' : 'Block build steps', hidden: true }),
                        ...views.map(([id, , source], index) => el('div', 'home-example__panel', el('pre', 'code-window__code', el('code', '', { raw: highlightCode(source ?? '', id === 'html' ? 'html' : id === 'bemjson' ? 'json' : 'ts') })), { role: 'tabpanel', id: `home-${id}-panel`, 'aria-labelledby': `home-${id}-tab`, hidden: index !== 0, tabindex: '0' })),
                    ], { 'data-source-tabs': 'home' }),
                    el('div', 'home-example__preview', [el('span', 'home-example__label', ru ? 'НА СТРАНИЦЕ' : 'ON THE PAGE'), example.tree]),
                    el('p', 'home-example__explanation', ru ? 'BEMJSON описывает блок. Шаблон nu задаёт его разметку.' : 'BEMJSON describes the block. A nu template defines its markup.'),
                ], { 'aria-label': ru ? 'Пример сборки блока' : 'A block build example' }),
            ]),
            el('nav', 'pipeline-strip', [
                el('span', 'pipeline-strip__label', ru ? 'От исходника к странице' : 'From source to page'),
                ...[['/how/markdown', 'Markdown'], ['/how/bemjson', 'BEMJSON'], ['/how/templates', 'nu'], ['/out/html', 'HTML']].flatMap(([href, text], index) => [link(href ?? '/', text ?? '', 'pipeline-strip__step'), ...(index < 3 ? [el('span', 'pipeline-strip__arrow', '→', { 'aria-hidden': 'true' })] : [])]),
                link('/how/pipeline', ru ? 'Весь конвейер ↗' : 'The full pipeline ↗', 'pipeline-strip__more'),
            ], { 'aria-label': ru ? 'Как строится страница' : 'How a page is built' }),
            el('section', 'features section', [
                el('div', 'section__heading', [el('h2', '', ru ? 'Как устроен nuckty' : 'How nuckty works'), el('p', '', ru ? 'Контент, шаблоны и сборка — в вашем проекте.' : 'Content, templates and build logic stay in your project.')]),
                el('div', 'features__grid', features.map(([label, title, text, href]) => el('a', 'feature', [el('span', 'feature__label', label ?? ''), el('div', 'feature__copy', [el('h3', '', title ?? ''), el('p', '', text ?? '')]), el('span', 'feature__arrow', '↗', { 'aria-hidden': 'true' })], { href: href ?? '/' }))),
            ]),
            el('section', 'output-section section', [
                el('div', 'output-section__copy', [el('p', 'eyebrow', ru ? 'РЕЗУЛЬТАТ СБОРКИ' : 'BUILD OUTPUT'), el('h2', '', ru ? 'Собрали — публикуйте файлы.' : 'Build once. Serve the files.'), el('p', '', ru ? 'Готовые страницы и ассеты, их сжатые копии и манифест. Сборка также готовит конфигурацию nginx и Apache. Для отдачи страниц серверу не нужен nuckty.' : 'Pages and assets, their compressed copies and a manifest. The build also prepares nginx and Apache configuration. The server does not need nuckty to serve the pages.'), link('/out/hosting', ru ? 'Как устроена отдача →' : 'How the files are served →', 'text-link')]),
                el('div', 'file-tree', [el('div', 'file-tree__header', [el('code', '', 'site/'), el('span', '', ru ? 'статический артефакт' : 'static artifact')]), ...[
                    ['html/', ru ? 'страницы' : 'pages'], ['css/ · js/', ru ? 'бандлы с хэшами' : 'hashed bundles'], ['svg/ · png/ · …', ru ? 'изображения' : 'images'], ['brotli/ · gzip/', ru ? 'сжатые копии' : 'compressed copies'], ['manifest.json', ru ? 'размеры и хэши' : 'sizes and hashes'], ['.htaccess', 'Apache'],
                ].map(([name, text]) => el('div', 'file-tree__row', [el('code', '', name ?? ''), el('span', '', text ?? '')])), el('div', 'file-tree__note', [el('code', '', '.build/nginx.conf'), ' — nginx'])]),
            ]),
            el('section', 'start-section', [
                el('div', '', [el('h2', '', ru ? 'От первой страницы до сайта' : 'From a first page to a website'), el('p', '', ru ? 'Зависимости → конфигурация → карта сайта → Markdown → сборка.' : 'Dependencies → configuration → sitemap → Markdown → build.')]),
                link('/how/start', ru ? 'Открыть руководство →' : 'Open the guide →', 'button button_primary'),
            ]),
        ]);
    });
}
