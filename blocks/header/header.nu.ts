import { block } from '@nuckty/core';
import { attributes } from '../bem/bem.js';

export default function templates(): void {
    block('header').elem('nav')({
        tag: 'nav',
        attrs: (node, next) => ({ id: 'main-nav', ...next(), ...attributes(node, ['id', 'aria-label']) }),
    });
    block('header').elem('tools')({
        tag: 'div',
    });
    block('header')({
        tag: 'header',
    });
}
