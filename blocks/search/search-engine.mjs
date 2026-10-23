import { count, create, insertMultiple, search } from '@orama/orama';
import { boundedLevenshtein } from '@orama/orama/internals';
import { index as oramaIndex, tokenizer as oramaTokenizer } from '@orama/orama/components';
import { stemmer as russianStemmer } from '@orama/stemmers/russian';

export function createSearch(pages, language) {
    const tokenizer = oramaTokenizer.createTokenizer({
        language: language === 'ru' ? 'russian' : 'english',
        stemming: true,
        ...(language === 'ru' ? { stemmer: russianStemmer } : {}),
    });
    const tokenize = tokenizer.tokenize;
    tokenizer.tokenize = (text, ...args) => tokenize(text.replace(/[-_]/g, ' '), ...args);
    const index = oramaIndex.createIndex();
    const searchIndex = index.search;
    // Match normalized tokens exactly first; enable fuzzy/prefix matching only on retry.
    index.search = (data, term, tokenizer, language, properties, exact, tolerance, ...args) => searchIndex(data, term, tokenizer, language, properties, tolerance === 0, tolerance, ...args);
    const database = create({
        schema: { url: 'string', title: 'string', headings: 'string', text: 'string' },
        sort: { enabled: false },
        components: { tokenizer, index },
    });
    insertMultiple(database, pages);

    return database;
}

export function searchPages(database, input) {
    const term = input.trim();
    const words = term.match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) ?? [];
    const tokens = database.tokenizer.tokenize(term);

    if (!words.length || !tokens.length) {
        return { count: 0, hits: [], tolerance: 0 };
    }

    const options = { properties: ['title', 'headings', 'text'], boost: { title: 8, headings: 3 }, limit: count(database) };
    const run = (tolerance) => {
        let matches;

        for (const word of words) {
            const short = database.tokenizer.tokenize(word).some((token) => token.length < 4);
            const result = search(database, { ...options, term: word, tolerance: short ? 0 : tolerance });
            const found = new Map(result.hits.map((hit) => [hit.id, hit]));

            if (!matches) {
                matches = found;
                continue;
            }

            for (const [id, hit] of matches) {
                const next = found.get(id);

                if (next) {
                    hit.score += next.score;
                } else {
                    matches.delete(id);
                }
            }
        }

        const hits = [...matches.values()].sort((a, b) => b.score - a.score);

        return { count: hits.length, hits: hits.slice(0, 12), tolerance };
    };
    const result = run(0);

    if (result.count || tokens.every((token) => token.length < 4)) {
        return result;
    }

    return run(1);
}

export function matchingRanges(database, text, query, tolerance = 0) {
    const tokens = database.tokenizer.tokenize(query);
    const ranges = [];

    for (const match of text.matchAll(/[\p{L}\p{N}_'-]+/gu)) {
        const words = database.tokenizer.tokenize(match[0]);

        if (words.some((word) => tokens.some((token) => word === token || (token.length >= 4 && tolerance > 0 && boundedLevenshtein(token, word, tolerance).isBounded)))) {
            ranges.push({ start: match.index, end: match.index + match[0].length });
        }
    }

    return ranges;
}

export function excerpt(database, text, query, tolerance = 0) {
    const ranges = matchingRanges(database, text, query, tolerance);
    const phrase = text.toLowerCase().indexOf(query.trim().toLowerCase());
    const anchor = ranges.find((range) => range.start === phrase) ?? ranges[0];
    let start = Math.max(0, (anchor?.start ?? 0) - 45);

    if (start > 0) {
        const boundary = text.indexOf(' ', start);

        if (boundary < (anchor?.start ?? 0)) {
            start = boundary + 1;
        }
    }

    let end = Math.min(text.length, Math.max(start + 180, anchor?.end ?? 0));

    if (end < text.length) {
        const boundary = text.lastIndexOf(' ', end);

        if (boundary > (anchor?.end ?? start)) {
            end = boundary;
        }
    }

    const prefix = start > 0 ? '…' : '';

    return {
        text: `${prefix}${text.slice(start, end)}${end < text.length ? '…' : ''}`,
        ranges: ranges.filter((range) => range.start >= start && range.end <= end).map((range) => ({ start: range.start - start + prefix.length, end: range.end - start + prefix.length })),
    };
}
