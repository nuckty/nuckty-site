import { defineNucktyConfig } from '@nuckty/core';

const preview = process.env['NUCKTY_PREVIEW'] === '1';

export default defineNucktyConfig({
    targets: {
        ru: {
            configDir: 'config/ru/', outDir: 'site/ru/',
            lang: 'ru', host: 'nuckty.ru', group: 'nuckty',
            data: { demoUrl: preview ? 'http://localhost:8092' : 'https://demo.nuckty.ru', alternateOrigin: preview ? 'http://localhost:8093' : 'https://nuckty.com' },
        },
        en: {
            configDir: 'config/en/', outDir: 'site/en/',
            lang: 'en', host: 'nuckty.com', group: 'nuckty',
            data: { demoUrl: preview ? 'http://localhost:8094' : 'https://demo.nuckty.com', alternateOrigin: preview ? 'http://localhost:8091' : 'https://nuckty.ru' },
        },
    },
    ext: [
        '@nuckty/ext-block-root',
        './ext/highlight.ts',
        '@nuckty/ext-markdown-typography-ru',
        '@nuckty/ext-command-serve',
        '@nuckty/ext-command-validate-vnu',
        '@nuckty/ext-command-content-external',
        './ext/home-example.ts',
        './ext/search.ts',
    ],
});
