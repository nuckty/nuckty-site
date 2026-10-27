import { markdownTree, previewDocument } from './markdown-preview.ts';

import { renderToHtml } from '@nuckty/core/browser';

const workbench = document.querySelector('.home__markdown');

if (workbench) {
    const input = workbench.querySelector('textarea');
    const frame = workbench.querySelector('iframe');
    const output = workbench.querySelector('#home-markdown-html');
    const tabs = [...workbench.querySelectorAll('[role="tab"]')];

    function update() {
        const html = renderToHtml(markdownTree(input.value));
        output.textContent = html;
        frame.srcdoc = previewDocument(html, document.documentElement.lang);
    }

    function select(tab) {
        for (const item of tabs) {
            item.setAttribute('aria-selected', String(item === tab));
            item.tabIndex = item === tab ? 0 : -1;
            document.getElementById(item.getAttribute('aria-controls')).hidden = item !== tab;
        }
    }

    for (const tab of tabs) {
        tab.addEventListener('click', () => { select(tab); });
        tab.addEventListener('keydown', (event) => {
            const index = tabs.indexOf(tab);
            const next = event.key === 'ArrowRight' ? tabs[(index + 1) % tabs.length] : event.key === 'ArrowLeft' ? tabs[(index + tabs.length - 1) % tabs.length] : event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : null;

            if (next) {
                event.preventDefault();
                select(next);
                next.focus();
            }
        });
    }
    input.addEventListener('input', update);
    workbench.querySelector('.home__markdown-reset').addEventListener('click', () => {
        input.value = input.defaultValue;
        update();
    });
}
