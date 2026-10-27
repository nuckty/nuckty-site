import type { BEMTree } from '@nuckty/core';

export interface HomeExample {
    tree: BEMTree;
    input: string;
    template: string;
    html: string;
    markdown: { source: string; html: string };
}
