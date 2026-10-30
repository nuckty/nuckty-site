import { block, attributes, type DocumentData } from '@nuckty/core';
import { pageContext } from '../root/root.page.js';

export default function templates(): void {
    block<DocumentData>('header-search')({
        tag: 'div',
        attrs: (node, next) => ({
            ...next(),
            id: 'site-search',
            role: 'search',
            hidden: true,
            ...(node.props ? {
                'aria-label': pageContext(node.props).t['Search and navigation'],
                'data-index-bytes': String(node.props.page['searchIndexBytes'] ?? ''),
                'data-engine-url': String(node.props.page['searchEngineUrl'] ?? ''),
            } : {}),
        }),
        content: (node) => {
            if (!node.props) {
                return null;
            }
            const { t } = pageContext(node.props);

            return [
                {
                    block: 'header-search',
                    elem: 'bar',
                    content: [
                        { block: 'header-search', elem: 'label', mix: [{ block: 'visually-hidden' }], content: t['Search this site'] },
                        { block: 'header-search', elem: 'input', props: { placeholder: t['Search this site…'] } },
                        {
                            block: 'icon-button',
                            mix: [{ block: 'search-close' }],
                            props: { 'aria-label': t['Close search'] },
                            content: { block: 'control-icon', content: { block: 'control-icon', elem: 'path', props: { d: 'm6 6 12 12M6 18 18 6' } } },
                        },
                    ],
                },
                {
                    block: 'header-search',
                    elem: 'panel',
                    content: [
                        {
                            block: 'search-loading',
                            content: [
                                { block: 'search-loading', elem: 'label', content: t['Loading search…'] },
                                { block: 'search-loading', elem: 'progress', props: { 'aria-label': t['Loading the search index'] }, content: '' },
                            ],
                        },
                        { block: 'search-hint', content: t['Search a title, concept or command.'] },
                        { block: 'search-results' },
                        { block: 'site-map', props: node.props },
                    ],
                },
            ];
        },
    });
    block('header-search').elem('label')({
        tag: 'label',
        attrs: (_node, next) => ({ ...next(), for: 'search-input' }),
    });
    block('header-search').elem('input')({
        tag: 'input',
        attrs: (node, next) => ({ ...next(), id: 'search-input', type: 'search', autocomplete: 'off', ...attributes(node, ['placeholder']) }),
    });
    block('header-search').elem('bar')({ tag: 'div' });
    block('header-search').elem('panel')({ tag: 'div' });
}
