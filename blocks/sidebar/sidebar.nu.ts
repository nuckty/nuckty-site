import { block } from '@nuckty/core';
import { attributes } from '../bem/bem.js';

export default function templates(): void {
    block('sidebar').elem('label')({
        tag: 'p',
    });
    block('sidebar').elem('link')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) =>
            node.props?.active
                ? { ...next(), 'aria-current': 'page' }
                : { ...next(), href: String(node.props?.href ?? '') },
    });
    block('sidebar').elem('group')({
        tag: 'div',
    });
    block('sidebar').elem('sections')({
        tag: 'nav',
        attrs: (node, next) => ({ id: 'doc-sections', ...next(), ...attributes(node, ['id', 'aria-label']) }),
    });
    block('sidebar').when((node) => !node.elem)({
        tag: 'aside',
        attrs: (node, next) => ({ ...next(), ...attributes(node, ['aria-label']) }),
    });
    block('sidebar').elem('fallback')({
        tag: (node) => (node.props?.active ? 'span' : 'a'),
        attrs: (node, next) =>
            node.props?.active
                ? { ...next(), 'aria-current': 'page' }
                : { ...next(), href: String(node.props?.href ?? '') },
    });
}
