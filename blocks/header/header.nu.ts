import { block, attributes } from '@nuckty/core';

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
