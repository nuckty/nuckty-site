import type { BemNode } from '@nuckty/core';

/** Parse the limited homepage preview: headings and plain paragraphs. */
export function markdownTree(source: string): BemNode[] {
    const tree: BemNode[] = [];
    let paragraph: string[] = [];

    function flush(): void {
        if (paragraph.length) {
            tree.push({ tag: 'p', bem: false, content: paragraph.join(' ') });
            paragraph = [];
        }
    }

    for (const line of source.replaceAll('\r\n', '\n').split('\n')) {
        const heading = /^(#{1,6})[\t ]+(.+)$/.exec(line);

        if (heading) {
            flush();
            tree.push({ tag: 'h' + heading[1].length, bem: false, content: heading[2] });
        } else if (line.trim() === '') {
            flush();
        } else {
            paragraph.push(line.trim());
        }
    }
    flush();

    return tree;
}

export function previewDocument(html: string, lang: string): string {
    return '<!doctype html><html lang="' + (lang === 'ru' ? 'ru' : 'en') + '"><meta charset="utf-8"><style>body{margin:24px;color:#1f3038;background:#fff;font:18px/1.65 system-ui,sans-serif;overflow-wrap:anywhere}h1,h2,h3,h4,h5,h6{font-size:28px;line-height:1.2;letter-spacing:-.04em}h1:first-child,h2:first-child,h3:first-child{margin-top:0}</style><body>' + html;
}
