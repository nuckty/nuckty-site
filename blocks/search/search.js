const header = document.querySelector('.header');
const panel = document.querySelector('#site-search');
const input = document.querySelector('#search-input');
const results = document.querySelector('.search-results');
const siteMap = document.querySelector('.site-map');
const hint = document.querySelector('.search-hint');
const hintText = hint.textContent;
const loading = document.querySelector('.search-loading');
const loadingLabel = document.querySelector('.search-loading__label');
const progress = document.querySelector('.search-loading__progress');
const closeButton = document.querySelector('.search-close');
const searchButton = document.querySelector('.search-trigger');
const menuButton = document.querySelector('.menu-toggle');
const mobile = matchMedia('(max-width: 1024px)');
const ru = document.documentElement.lang === 'ru';
let opener;
let engine;
let database;
let pendingIndex;

async function loadCorpus() {
    const response = await fetch('/search-index.txt', { priority: 'low' });

    if (!response.ok) {
        throw new Error('Search index could not be loaded');
    }

    if (!response.body) {
        return response.json();
    }

    const total = Number(panel.dataset.indexBytes);
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
        const { value, done } = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        loaded += value.byteLength;

        if (total > 0) {
            const percentage = Math.min(100, Math.floor(loaded / total * 100));
            progress.value = percentage;
            loadingLabel.textContent = `${ru ? 'Загрузка поиска' : 'Loading search'} · ${percentage}%`;
        }
    }

    const bytes = new Uint8Array(loaded);
    let offset = 0;

    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
    }

    return JSON.parse(new TextDecoder().decode(bytes));
}

function prepareSearch() {
    if (database || pendingIndex) {
        return pendingIndex;
    }

    loading.hidden = false;
    hint.hidden = true;
    hint.dataset.state = 'loading';
    progress.removeAttribute('value');
    loadingLabel.textContent = ru ? 'Загрузка поиска…' : 'Loading search…';
    pendingIndex = (async () => {
        engine = await import(panel.dataset.engineUrl);
        const pages = await loadCorpus();
        progress.removeAttribute('value');
        loadingLabel.textContent = ru ? 'Подготовка поиска…' : 'Preparing search…';
        await new Promise((resolve) => { setTimeout(resolve, 0); });
        database = engine.createSearch(pages, ru ? 'ru' : 'en');
        loading.hidden = true;
        hint.hidden = false;
        hint.dataset.state = 'ready';
        hint.textContent = hintText;
        search();
    })().catch(() => {
        pendingIndex = undefined;
        loading.hidden = true;
        hint.hidden = false;
        hint.dataset.state = 'error';
        hint.textContent = ru ? 'Не удалось загрузить поиск. Закройте его и попробуйте ещё раз.' : 'Search could not be loaded. Close it and try again.';
    });

    return pendingIndex;
}

function appendHighlighted(element, text, ranges) {
    let cursor = 0;

    for (const range of ranges) {
        element.append(document.createTextNode(text.slice(cursor, range.start)));
        const mark = document.createElement('mark');
        mark.textContent = text.slice(range.start, range.end);
        element.append(mark);
        cursor = range.end;
    }

    element.append(document.createTextNode(text.slice(cursor)));
}

function search() {
    const query = input.value.trim();
    results.replaceChildren();
    siteMap.hidden = Boolean(query);

    if (hint.dataset.state === 'ready') {
        hint.hidden = Boolean(query);
    }

    if (!query || !database) {
        return;
    }

    const matches = engine.searchPages(database, query);
    const hits = matches.hits.filter((hit) => hit.document.url !== location.pathname);

    if (!hits.length) {
        const message = document.createElement('p');
        message.textContent = ru ? 'Ничего не найдено. Попробуйте другой термин.' : 'No results. Try another term.';
        results.append(message);
    }

    for (const hit of hits) {
        const page = hit.document;
        const link = document.createElement('a');
        link.href = page.url;
        const title = document.createElement('strong');
        appendHighlighted(title, page.title, engine.matchingRanges(database, page.title, query, matches.tolerance));
        const snippet = document.createElement('span');
        const context = engine.excerpt(database, page.text, query, matches.tolerance);
        appendHighlighted(snippet, context.text, context.ranges);
        link.append(title, snippet);
        results.append(link);
    }
}

function setOpen(open) {
    panel.hidden = !open;
    header.toggleAttribute('data-search-open', open);
    document.body.toggleAttribute('data-search-open', open);
    searchButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-expanded', String(open));


}

function openSearch(clearQuery = false) {
    if (panel.hidden) {
        opener = document.activeElement;
    }

    if (clearQuery) {
        input.value = '';
        document.querySelector('.header-search__panel').scrollTop = 0;
    }

    setOpen(true);
    closeButton.setAttribute('aria-label', mobile.matches ? (ru ? 'Закрыть меню' : 'Close menu') : (ru ? 'Закрыть поиск' : 'Close search'));
    search();

    input.focus();

    void prepareSearch();
}

function closeSearch(restoreFocus = true) {
    setOpen(false);

    if (restoreFocus) {
        const control = opener?.tabIndex >= 0 && opener.getClientRects().length ? opener : (mobile.matches ? menuButton : searchButton);
        control.focus();
    }
}

searchButton.addEventListener('click', () => { openSearch(); });
closeButton.addEventListener('click', () => { closeSearch(); });

for (const button of [menuButton]) {
    button.addEventListener('click', () => {
        if (panel.hidden) {
            openSearch(true);
        } else {
            closeSearch();
        }
    });
    button.removeAttribute('hidden');
}

input.addEventListener('input', search);
input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && results.querySelector('a')) {
        event.preventDefault();
        results.querySelector('a').focus();
    }
});
results.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return;
    }

    const links = [...results.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);

    if (index < 0) {
        return;
    }

    event.preventDefault();

    if (event.key === 'ArrowUp' && index === 0) {
        input.focus();
    } else {
        links[index + (event.key === 'ArrowDown' ? 1 : -1)]?.focus();
    }
});
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
    } else if (event.key === 'Escape' && !event.defaultPrevented && !panel.hidden && !document.querySelector('dialog[open]')) {
        event.preventDefault();
        closeSearch();
    }
});
mobile.addEventListener('change', () => {
    if (!panel.hidden) {
        closeSearch();
    }
});
searchButton.removeAttribute('hidden');
document.querySelector('.sidebar__fallback')?.setAttribute('hidden', '');
header.setAttribute('data-navigation-ready', '');

if ('requestIdleCallback' in window) {
    requestIdleCallback(() => { void prepareSearch(); }, { timeout: 1500 });
} else {
    setTimeout(() => { void prepareSearch(); }, 0);
}
