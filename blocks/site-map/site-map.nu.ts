import { block, attributes, type BemNode, type DocumentData } from '@nuckty/core';
import { pageContext } from '../root/root.page.js';

function link(elem: 'title' | 'link', href: string, name: string, url: string, nested = false): BemNode {
    return {
        block: 'site-map',
        elem,
        elemMods: { current: href === url, ...(elem === 'link' ? { nested } : {}) },
        props: { href },
        content: { block: 'site-map', elem: 'text', content: name },
    };
}

export default function templates(): void {
    block<DocumentData>('site-map')({
        tag: 'nav',
        attrs: (node, next) => ({ ...next(), ...(node.props ? { 'aria-label': pageContext(node.props).t['Site map'] } : {}) }),
        content: (node) => {
            if (!node.props) {
                return null;
            }
            const { t, url, demoUrl, pages, sections } = pageContext(node.props);
            const group = (title: BemNode, links: BemNode[]): BemNode => ({
                block: 'site-map',
                elem: 'group',
                content: [{ block: 'site-map', elem: 'heading', content: title }, { block: 'site-map', elem: 'links', content: links }],
            });

            return [
                group(link('title', '/', t['About nuckty'], url), [
                    link('link', '/use-cases', t['Use cases'], url),
                    link('link', '/docs', t['Documentation'], url),
                    link('link', demoUrl, t['Demo'], ''),
                ]),
                ...sections
                    .filter(([prefix]) => prefix !== '/docs')
                    .map(([prefix, label]) => group(
                        link('title', prefix, prefix === '/how' ? t['Guide'] : t[label], url),
                        pages
                            .filter((page) => page.url !== prefix && page.url.startsWith(`${prefix}/`))
                            .map((page) => link('link', page.url, page.name, url, page.url.split('/').length > 3)),
                    )),
            ];
        },
    });
    block('site-map').elem('group')({ tag: 'section' });
    block('site-map').elem('heading')({ tag: 'h2' });
    block('site-map').elem('links')({ tag: 'div' });
    block('site-map').elem('text')({ tag: 'span' });
    for (const elem of ['title', 'link']) {
        block('site-map').elem(elem)({
            tag: 'a',
            attrs: (node, next) => ({ ...next(), ...attributes(node, ['href']) }),
        });
        block('site-map').elem(elem).mod('current')({
            tag: 'span',
            attrs: { 'aria-current': 'page' },
        });
    }
}
