import type { DocumentData } from '@nuckty/core';
import { messages } from './root.i18n/index.js';

export type MessageKey = keyof ReturnType<typeof messages>;

/** Values the page blocks derive from the document data. */
export function pageContext(data: DocumentData) {
    const url = data.page.url;

    return {
        t: messages(data.lang),
        url,
        home: url === '/',
        landing: data.page.layout === 'landing',
        origin: `https://${data.target?.host ?? ''}`,
        demoUrl: String(data.target?.data?.['demoUrl'] ?? ''),
        alternateUrl: `${String(data.target?.data?.['alternateOrigin'] ?? '')}${url}`,
        brand: data.assets.images['brand/brand.svg'],
        brandDark: data.assets.images['brand/brand-dark.svg'],
        favicon: data.assets.images['brand/favicon.svg'],
        /** Documentation pages in sitemap order: every page except the home page and use cases. */
        pages: Object.values(data.sitemap.pages).filter((page) => page.url !== '/' && page.url !== '/use-cases'),
        /** Documentation sections: URL prefix and label. */
        sections: [
            ['/docs', 'Overview'],
            ['/how', 'How to use it'],
            ['/out', 'Build output'],
            ['/ext', 'Extensions'],
            ['/why', 'Why this way'],
        ] as Array<[string, MessageKey]>,
    };
}
