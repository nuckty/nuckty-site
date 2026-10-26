const ru = document.documentElement.lang === 'ru';
const themeButton = document.querySelector('.theme-toggle');

const languageLinks = [...document.querySelectorAll('.language-link, .header__language')];
const currentUrl = new URL(location.href);
const incomingTheme = currentUrl.searchParams.get('theme');

if (incomingTheme === 'dark' || incomingTheme === 'light') {
    document.documentElement.dataset.theme = incomingTheme;
    currentUrl.searchParams.delete('theme');
    history.replaceState(history.state, '', currentUrl);
}

try {
    const theme = incomingTheme === 'dark' || incomingTheme === 'light' ? incomingTheme : localStorage.getItem('nuckty-theme');

    if (theme === 'dark' || theme === 'light') {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('nuckty-theme', theme);
    }
} catch {
    // The controls also work when storage is unavailable.
}

function updateThemeControl() {
    const dark = document.documentElement.dataset.theme === 'dark';

    for (const link of languageLinks) {
        const url = new URL(link.href);
        url.searchParams.set('theme', dark ? 'dark' : 'light');
        link.href = url.href;
    }

    themeButton?.setAttribute('aria-pressed', String(dark));
    themeButton?.setAttribute('title', dark ? (ru ? 'Включить светлую тему' : 'Use light theme') : (ru ? 'Включить тёмную тему' : 'Use dark theme'));
}

updateThemeControl();
themeButton?.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    updateThemeControl();

    try {
        localStorage.setItem('nuckty-theme', theme);
    } catch {
        // Persistence is optional.
    }
});
themeButton?.removeAttribute('hidden');

const header = document.querySelector('.header');
const headerSize = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--header-offset', `${header.getBoundingClientRect().height}px`);

    const footerBrand = document.querySelector('.footer__brand');
    const footerMade = document.querySelector('.footer__made');

    if (footerBrand && footerMade) {
        footerBrand.style.setProperty('--footer-brand-scale', '1');
        const scale = footerMade.getBoundingClientRect().width / footerBrand.getBoundingClientRect().width;
        footerBrand.style.setProperty('--footer-brand-scale', String(scale));
    }

    for (const pre of document.querySelectorAll('.article > pre, .article > .code-block > pre')) {
        const frame = pre.closest('.code-block') ?? pre;
        const edgeToEdge = matchMedia('(max-width: 47.999rem)').matches;
        frame.style.setProperty('--code-offset', `${edgeToEdge ? frame.parentElement.getBoundingClientRect().left : 0}px`);
        frame.style.setProperty('--code-width', edgeToEdge ? `${document.documentElement.clientWidth}px` : '100%');
    }

    for (const navigation of document.querySelectorAll('.page-navigation')) {
        const edgeToEdge = matchMedia('(max-width: 47.999rem)').matches;
        navigation.style.setProperty('--navigation-offset', `${edgeToEdge ? navigation.getBoundingClientRect().left : 0}px`);
        const width = edgeToEdge ? document.documentElement.clientWidth : navigation.getBoundingClientRect().width;
        navigation.style.setProperty('--navigation-width', `${width}px`);
        const height = navigation.getBoundingClientRect().height;
        const middle = height / 2;
        const path = `M32 0H${width - 32}Q${width - 24} 0 ${width - 20} 8L${width - 4} ${middle - 8}Q${width} ${middle} ${width - 4} ${middle + 8}L${width - 20} ${height - 8}Q${width - 24} ${height} ${width - 32} ${height}H32Q24 ${height} 20 ${height - 8}L4 ${middle + 8}Q0 ${middle} 4 ${middle - 8}L20 8Q24 0 32 0Z`;
        const mask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${path}"/></svg>`;
        navigation.style.setProperty('--navigation-mask', `url("data:image/svg+xml,${encodeURIComponent(mask)}")`);
    }
});
headerSize.observe(header);

for (const pre of document.querySelectorAll('pre')) {
    const code = pre.querySelector('code');

    if (!code) {
        continue;
    }

    const button = pre.querySelector('.article__code-copy') ?? document.createElement('button');
    button.className = 'code-copy';
    button.type = 'button';
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.5');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const copyPath = 'M9 9h11v11H9zM15 9V4H4v11h5';
    path.setAttribute('d', copyPath);
    icon.append(path);
    button.replaceChildren(icon);
    button.setAttribute('aria-label', ru ? 'Скопировать пример кода' : 'Copy code example');
    button.title = button.getAttribute('aria-label');
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(code.textContent);
            path.setAttribute('d', 'm5 12 4 4L19 6');
            button.title = ru ? 'Скопировано' : 'Copied';
        } catch {
            button.title = ru ? 'Выделите текст' : 'Select the text';
        }

        setTimeout(() => {
            path.setAttribute('d', copyPath);
            button.title = button.getAttribute('aria-label');
        }, 1600);
    });
    const figure = pre.parentElement?.tagName === 'FIGURE' ? pre.parentElement : null;
    const frame = figure ?? document.createElement('div');
    frame.classList.add('code-block');

    if (!figure) {
        pre.before(frame);
        frame.append(pre);
    }

    frame.append(button);
    pre.classList.add('has-copy');
}
