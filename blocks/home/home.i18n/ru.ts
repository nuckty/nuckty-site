import type en from './en.js';

const messages = {
    'Write the content': 'Пишите контент',
    'Describe the blocks': 'Описывайте блоки',
    'Define the markup': 'Задавайте разметку',
    'Serve the files': 'Отдавайте файлы',
    capabilities: [
        ['Контент', 'Страницы Markdown', 'Страницы HTML'],
        ['Структура', 'sitemap.yml', 'Адреса страниц'],
        ['Интерфейс', 'BEMJSON + шаблоны nu.ts', 'Разметка блоков'],
        ['Языки', 'Переводы + таргеты', 'Отдельные сайты + hreflang'],
        ['Ассеты', 'CSS и JavaScript блоков', 'Бандлы с хешами'],
        ['Сжатие', 'Конвейер сборки', 'Копии Brotli и Gzip'],
        ['Хостинг', 'Конфигурация таргета', 'Файлы nginx и Apache'],
    ],
    'Text in.': 'Текст на входе.',
    'Sites out.': 'Сайты на выходе.',
    'A static site generator for documentation, guides and content websites.':
        'Генератор статических сайтов для документации, руководств и контентных проектов.',
    'Markdown, BEMJSON and TypeScript block templates.': 'Markdown, BEMJSON и шаблоны блоков на TypeScript.',
    'See it work': 'Посмотреть в работе',
    'Your words. Your markup. Your files.': 'Ваш текст. Ваша разметка. Ваши файлы.',
    'Open source, MIT licensed': 'Открытый код, лицензия MIT',
    'Every word': 'У каждого слова',
    'has a route.': 'свой маршрут.',
    'Markdown becomes a BEMJSON tree. nu.ts templates turn the tree into HTML. One engine for content and layout.':
        'Markdown становится деревом BEMJSON. Шаблоны nu.ts превращают дерево в HTML. Один движок для контента и интерфейса.',
    'From source to page': 'От исходника к странице',
    'The block · BEMJSON': 'Блок · BEMJSON',
    'The markup · nu.ts template': 'Разметка · шаблон nu.ts',
    'Written.': 'Написано.',
    'Rendered.': 'Отображено.',
    'Change the heading or paragraph. Read the page, then inspect its HTML.':
        'Измените заголовок или абзац. Посмотрите на страницу, а затем — на её HTML.',
    'This preview supports headings and paragraphs. The complete nuckty build runs in Node.js.':
        'Этот предпросмотр поддерживает заголовки и абзацы. Полная сборка nuckty выполняется в Node.js.',
    'Your Markdown': 'Ваш Markdown',
    Reset: 'Сбросить',
    'Try a heading starting with #, then a paragraph.': 'Попробуйте заголовок с # в начале, а затем — абзац.',
    'What the reader sees': 'Что увидит читатель',
    Page: 'Страница',
    'Preview format': 'Формат предпросмотра',
    'Page preview': 'Предпросмотр страницы',
    'Explore the full nuckty demo': 'Открыть полное демо nuckty',
    'Build once.': 'Одна сборка.',
    'Keep the files.': 'Файлы остаются у вас.',
    'Pages, assets, compressed copies and a manifest. The build prepares nginx and Apache configuration for a compatible server.':
        'Страницы, ассеты, сжатые копии и манифест. Сборка готовит конфигурацию nginx и Apache для совместимого сервера.',
    'The server does not need nuckty to serve the pages.': 'Чтобы отдавать страницы, серверу не нужен nuckty.',
    'Read about hosting': 'Подробнее о хостинге',
    'The route map · sitemap.yml': 'Карта маршрутов · sitemap.yml',
    'sitemap:\n  - Home [/, index.md]\n  - About [/about, about.md]':
        'sitemap:\n  - Главная [/, index.md]\n  - О сайте [/about, about.md]',
    'What your build contains': 'Что содержит сборка',
    Pages: 'Страницы',
    'Styles & scripts': 'Стили и скрипты',
    Images: 'Изображения',
    'Compressed copies': 'Сжатые копии',
    'Sizes & hashes': 'Размеры и хэши',
    'A static artifact. Ready to publish.': 'Статический артефакт. Готов к публикации.',
    'You write.': 'Вы пишете.',
    'nuckty builds.': 'nuckty собирает.',
    'Keep content, templates and build logic in your project. Add capabilities through extensions.':
        'Храните контент, шаблоны и логику сборки в своём проекте. Добавляйте возможности через расширения.',
    'What you provide and what the nuckty build produces': 'Что вы задаёте и что создаёт сборка nuckty',
    'In your project': 'В вашем проекте',
    'You provide': 'Вы задаёте',
    'nuckty produces': 'nuckty создаёт',
    'The static part.': 'Статическая часть.',
    'For dynamic data, server authentication or persistent application state, nuckty builds the static part. A CMS, server API and visual editor are outside the core. Blocks can include client JavaScript.':
        'Для динамических данных, серверной авторизации или постоянного состояния приложения nuckty собирает статическую часть. CMS, серверный API и визуальный редактор находятся за пределами ядра. Блоки могут содержать клиентский JavaScript.',
    'When you need another tool': 'Когда нужен другой инструмент',
    '/use-cases#use-cases-when-another-tool-is-needed':
        '/use-cases#для-каких-проектов-когда-понадобится-другой-инструмент',
    'A home for your words.': 'Дом для ваших слов.',
    'nuckty fits projects where content lives in files and pages can be built ahead of time. Documentation, guides and articles use the same engine.':
        'nuckty подходит проектам, где контент хранится в файлах, а страницы можно собрать заранее. Документация, руководства и статьи используют один и тот же движок.',
    'Where nuckty fits': 'Где подходит nuckty',
    'The next page is yours.': 'Следующая страница за вами.',
    'Open the guide': 'Открыть руководство',
    'Download starter': 'Скачать стартовый проект',
} satisfies typeof en;

export default messages;
