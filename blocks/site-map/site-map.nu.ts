import { block, attributes } from '@nuckty/core';

export default function templates(): void {
    block('site-map').elem('text')({
        tag: 'span',
    });
    block('site-map').elem('title')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) =>
            node.props?.active
                ? { ...next(), 'aria-current': 'page' }
                : { ...next(), href: String(node.props?.href ?? '') },
    });
    block('site-map').elem('heading')({
        tag: 'h2',
    });
    block('site-map').elem('link')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) =>
            node.props?.active
                ? { ...next(), 'aria-current': 'page' }
                : { ...next(), href: String(node.props?.href ?? '') },
    });
    block('site-map').elem('links')({
        tag: 'div',
    });
    block('site-map').elem('group')({
        tag: 'section',
    });
    block('site-map')({
        tag: 'nav',
        attrs: (node, next) => ({ ...next(), ...attributes(node, ['aria-label']) }),
    });
}
