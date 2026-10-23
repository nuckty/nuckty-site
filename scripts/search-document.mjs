export function searchDocument(url, source) {
    const code = [];
    const prose = source.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, example) => {
        code.push(example);

        return '';
    });
    const title = prose.match(/^# (.+)$/m)?.[1] ?? url;
    const headings = [...prose.matchAll(/^#{2,6}\s+(.+)$/gm)].map((match) => match[1]).join(' ');
    const plain = prose.replace(/^# .+$/m, '').replace(/<[^>]*>/g, '').replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*`>|]/g, '');
    const text = `${plain} ${code.join(' ')}`.replace(/\s+/g, ' ').trim();

    return { url, title, headings, text };
}

