import { block } from '@nuckty/core';
import { attributes } from '../bem/bem.js';

export default function templates(): void {
    block('search-hint')({
        tag: 'p',
        attrs: (node, next) => ({ role: 'status', ...next(), ...attributes(node, ['role']) }),
    });
}
