import { block } from '@nuckty/core';

export default function templates(): void {
    block('code-window').elem('code')({
        tag: 'pre',
    });
}
