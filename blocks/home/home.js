for (const example of document.querySelectorAll('[data-source-tabs]')) {
    const tabs = [...example.querySelectorAll('[role="tab"]')];

    function select(tab) {
        for (const item of tabs) {
            item.setAttribute('aria-selected', String(item === tab));
            item.tabIndex = item === tab ? 0 : -1;
        }

        for (const panel of example.querySelectorAll('[role="tabpanel"]')) {
            panel.hidden = panel.id !== tab.getAttribute('aria-controls');
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
    example.querySelector('[role="tablist"]').hidden = false;
}
