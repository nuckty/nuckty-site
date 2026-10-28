import { block, attributes } from '@nuckty/core';

export default function templates(): void {
    block('search-hint')({
        tag: 'p',
        attrs: (node, next) => ({ role: 'status', ...next(), ...attributes(node, ['role']) }),
    });
}
