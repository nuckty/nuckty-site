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

    const brandName = document.querySelector('.header .brand__name');
    const language = document.querySelector('.language-link');

    if (brandName && matchMedia('(max-width: 1024px)').matches) {
        brandName.style.removeProperty('font-size');
        brandName.style.removeProperty('transform');
    }

    if (brandName && language && language.getClientRects().length && !matchMedia('(max-width: 1024px)').matches) {
        let languageText = language.querySelector('.language-link__text');

        if (!languageText) {
            languageText = document.createElement('span');
            languageText.className = 'language-link__text';
            languageText.textContent = language.textContent;
            language.replaceChildren(languageText);
        }

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

        function glyphBounds(element) {
            const style = getComputedStyle(element);
            context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily.split(',')[0]}`;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText(element.textContent.trim(), 8, 64);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let top = canvas.height;
            let bottom = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    if (pixels[(y * canvas.width + x) * 4 + 3] > 112) {
                        top = Math.min(top, y);
                        bottom = Math.max(bottom, y + 1);
                    }
                }
            }
            const marker = document.createElement('span');
            marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline';
            element.append(marker);
            const baseline = marker.getBoundingClientRect().bottom;
            marker.remove();

            return { top: baseline + top - 64, bottom: baseline + bottom - 64 };
        }

        brandName.style.transform = 'none';
        const target = glyphBounds(languageText);
        brandName.style.fontSize = getComputedStyle(languageText).fontSize;

        for (let i = 0; i < 2; i++) {
            const bounds = glyphBounds(brandName);
            const size = parseFloat(getComputedStyle(brandName).fontSize);
            const scale = (target.bottom - target.top) / (bounds.bottom - bounds.top);
            brandName.style.fontSize = `${size * scale / rootSize}rem`;
        }

        const bounds = glyphBounds(brandName);
        brandName.style.transform = `translateY(${target.top - bounds.top}px)`;
    }

    const footerBrand = document.querySelector('.footer__brand');
    const footerMade = document.querySelector('.footer__made');

    if (footerBrand && footerMade) {
        footerBrand.style.setProperty('--footer-brand-scale', '1');
        const scale = footerMade.getBoundingClientRect().width / footerBrand.getBoundingClientRect().width;
        footerBrand.style.setProperty('--footer-brand-scale', String(scale));
    }

    for (const pre of document.querySelectorAll('.article > pre, .article > .code-block > pre')) {
        const frame = pre.closest('.code-block') ?? pre;
        frame.style.setProperty('--code-offset', `${frame.parentElement.getBoundingClientRect().left}px`);
        frame.style.setProperty('--code-width', `${document.documentElement.clientWidth}px`);
    }

    for (const navigation of document.querySelectorAll('.page-navigation')) {
        navigation.style.setProperty('--navigation-offset', `${navigation.getBoundingClientRect().left}px`);
        navigation.style.setProperty('--navigation-width', `${document.documentElement.clientWidth}px`);
        const width = document.documentElement.clientWidth;
        const height = navigation.getBoundingClientRect().height;
        const middle = height / 2;
        const path = `M32 0H${width - 32}Q${width - 24} 0 ${width - 20} 8L${width - 4} ${middle - 8}Q${width} ${middle} ${width - 4} ${middle + 8}L${width - 20} ${height - 8}Q${width - 24} ${height} ${width - 32} ${height}H32Q24 ${height} 20 ${height - 8}L4 ${middle + 8}Q0 ${middle} 4 ${middle - 8}L20 8Q24 0 32 0Z`;
        const mask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${path}"/></svg>`;
        navigation.style.setProperty('--navigation-mask', `url("data:image/svg+xml,${encodeURIComponent(mask)}")`);
    }
});
headerSize.observe(header);

for (const pre of document.querySelectorAll('.article pre, .code-window__code, .example__source pre')) {
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
    const frame = document.createElement('div');
    frame.className = 'code-block';
    pre.before(frame);
    frame.append(pre, button);
    pre.classList.add('has-copy');
}

const tocLinks = [...document.querySelectorAll('.toc a')];
const observer = new IntersectionObserver((entries) => {
    const visible = entries.find((entry) => entry.isIntersecting);

    if (!visible) {
        return;
    }

    for (const link of tocLinks) {
        if (decodeURIComponent(link.hash.slice(1)) === visible.target.id) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    }
}, { rootMargin: '-100px 0px -60% 0px' });

for (const heading of document.querySelectorAll('.article h2, .article h3')) {
    observer.observe(heading);
}

