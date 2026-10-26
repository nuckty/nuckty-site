import type { BEMTree } from 'nuckty';

export interface HomeExample {
    tree: BEMTree;
    input: string;
    template: string;
    html: string;
    markdown: { source: string; html: string };
}

