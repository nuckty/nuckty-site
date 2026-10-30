import { block, attributes, type DocumentData } from '@nuckty/core';
import { pageContext } from '../root/root.page.js';

export default function templates(): void {
    block<DocumentData>('sidebar')({
        tag: 'aside',
        attrs: (node, next) => ({ ...next(), ...(node.props ? { 'aria-label': pageContext(node.props).t['Sections'] } : {}) }),
        content: (node) => {
            if (!node.props) {
                return null;
            }
            const { t, url, pages, sections } = pageContext(node.props);

            return {
                block: 'sidebar',
                elem: 'sections',
                props: { 'aria-label': t['Documentation sections'] },
                content: sections.map(([prefix, label]) => ({
                    block: 'sidebar',
                    elem: 'group',
                    content: [
                        { block: 'sidebar', elem: 'label', content: t[label] },
                        ...pages
                            .filter((page) => page.url === prefix || page.url.startsWith(`${prefix}/`))
                            .map((page) => ({
                                block: 'sidebar',
                                elem: 'link',
                                elemMods: { current: page.url === url, nested: page.url.split('/').length > 3 },
                                props: { href: page.url },
                                content: page.name,
                            })),
                    ],
                })),
            };
        },
    });
    block('sidebar').elem('sections')({
        tag: 'nav',
        attrs: (node, next) => ({ ...next(), id: 'doc-sections', ...attributes(node, ['aria-label']) }),
    });
    block('sidebar').elem('group')({ tag: 'div' });
    block('sidebar').elem('label')({ tag: 'p' });
    for (const elem of ['link', 'fallback']) {
        block('sidebar').elem(elem)({
            tag: 'a',
            attrs: (node, next) => ({ ...next(), ...attributes(node, ['href']) }),
        });
        block('sidebar').elem(elem).mod('current')({
            tag: 'span',
            attrs: { 'aria-current': 'page' },
        });
    }
}
