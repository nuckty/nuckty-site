import { block } from '@nuckty/core';
import { attributes } from '../bem/bem.js';

export default function templates(): void {
    block('search-loading').elem('label')({
        tag: 'span',
    });
    block('search-loading').elem('progress')({
        tag: 'progress',
        attrs: (node, next) => ({ max: '100', ...next(), ...attributes(node, ['max', 'aria-label']) }),
    });
    block('search-loading')({
        tag: 'div',
        attrs: (node, next) => ({ hidden: true, role: 'status', ...next(), ...attributes(node, ['hidden', 'role']) }),
    });
}
