import { block, type BEMTree, type DocumentData } from '@nuckty/core';
import { pageContext } from '../root/root.page.js';

export default function templates(): void {
    block('main')({
        tag: 'main',
        attrs: (_node, next) => ({ ...next(), id: 'main' }),
    });
    block<DocumentData>('main').mod('layout', 'landing')({
        content: (node) => {
            if (!node.props) {
                return null;
            }
            const { demoUrl } = pageContext(node.props);

            return { block: 'home', props: { lang: node.props.lang, demoUrl, example: node.props.page['homeExample'] } };
        },
    });
    block<DocumentData>('main').mod('layout', 'docs')({
        content: (node) => {
            if (!node.props) {
                return null;
            }
            const { t, url } = pageContext(node.props);
            const content: BEMTree = node.content ?? null;

            return [
                {
                    block: 'reading-nav',
                    content: [
                        { block: 'breadcrumbs', props: node.props },
                        { block: 'sidebar', elem: 'fallback', elemMods: { current: url === '/docs' }, props: { href: '/docs' }, content: t['All sections →'] },
                    ],
                },
                { block: 'sidebar', props: node.props },
                {
                    block: 'article-column',
                    content: [
                        { block: 'article', content },
                        { block: 'page-navigation', props: node.props },
                    ],
                },
            ];
        },
    });
}
