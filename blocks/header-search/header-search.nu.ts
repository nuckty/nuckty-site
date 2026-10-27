import { block } from '@nuckty/core';
import { attributes } from '../bem/bem.js';

export default function templates(): void {
    block('header-search').elem('input')({
        tag: 'input',
        attrs: (node, next) => ({
            id: 'search-input',
            type: 'search',
            autocomplete: 'off',
            ...next(),
            ...attributes(node, ['id', 'type', 'placeholder', 'autocomplete']),
        }),
    });
    block('header-search').elem('bar')({
        tag: 'div',
    });
    block('header-search').elem('panel')({
        tag: 'div',
    });
    block('header-search').when((node) => !node.elem)({
        tag: 'div',
        attrs: (node, next) => ({
            id: 'site-search',
            role: 'search',
            hidden: true,
            ...next(),
            ...attributes(node, ['id', 'role', 'aria-label', 'data-index-bytes', 'data-engine-url', 'hidden']),
        }),
    });
}
