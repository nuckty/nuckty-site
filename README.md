# nuckty-site

Nuckty product website and canonical documentation. Russian and English targets share blocks and matching routes. Both use the supplied new SVG logo and a separate square favicon derived from its mark. The starter installs exact public npm versions of core/root/serve; extensions are added from npm.

The landing-page tabs show the actual BEMJSON, template file and HTML from the current build. Documentation starts with the setup guide and data model; mobile section navigation is expandable.

The website build uses Python 3 to package the starter. Installing and building the downloaded project does not require Python. Check it with `npm run test:starter`; add `-- --preview` to exercise serve/edit/rebuild/stop (or `NUCKTY_NPM_CACHE=/path/to/cache npm run test:starter -- --offline`).

## Build and check

Requires Node.js 24+, npm and `../nuckty-docs`. Nuckty dependencies are exact public npm releases; sibling engine/extension sources are not required.

```bash
npm ci
npm run build
npm run lint
npm test
npm run validate
```

`build` prepares documentation locally and invokes `nuckty build`. Output is `site/ru/` and `site/en/`. Generated docs, sitemaps and search data are ignored; edit canonical `../nuckty-docs` or product copy in `content/`. `test` checks links, anchors, assets, IDs, manifest hashes/sizes, Brotli/Gzip round trips, logo and hreflang. Nu validation requires Java.

## Local preview

Requires nginx. Run in separate terminals:

```bash
npm run serve       # http://localhost:8091
npm run serve:en    # http://localhost:8093
```

Start `npm run serve` in `../nuckty-demo` for the demo on port 8092. Stop with `npm run stop` and `npm run stop:en`. English preview uses a separate nginx PID and configuration.

Builds use public cross-project and language origins by default. Use `npm run build:preview` for local demo/language links. Canonical metadata uses nuckty.ru/nuckty.com; no deployment is performed by these scripts.

## Sources

`blocks/root` owns the document, navigation and table of contents. `home` and `card` build the landing page and actual nu example. `search` provides local full-text search; `shell` owns theme, menu and copy controls. `blocks/brand` holds the exact logo, dark variant, favicon and its license. Shared project rules are in `AGENTS.md`.

Search uses Orama JS 3.1.18 with Russian and English stemming. Content preparation includes complete Markdown text, fenced code, the landing-page source and use cases, covering 52 routes per language. The engine ships as a separate hashed ES module; the current-language corpus ships as JSON in `search-index.txt`. Both load during browser idle time after rendering, or immediately if search opens first. Download progress uses the uncompressed UTF-8 corpus size and works with gzip/Brotli; indexing has its own indicator. Queries run locally, require every word, weight titles/headings above body text and retry small typos after exact-token search. Short terms such as `nu` remain exact. Excerpts highlight matching words through text nodes. On phones, the hamburger opens search and the complete site map; on desktop, the search icon turns the entire header into an input. Escape restores the opener, and breakpoint changes close the panel. `npm test` covers both languages, built-module behavior and progress metadata.

MIT. Logo license: `blocks/brand/LICENSE`.

## Source CI

The `CI` workflow installs package dependencies from the checked-in registry lockfile and checks out only canonical documentation at its latest successful CI commit. It verifies both languages and standalone npm-based starters before deploying approved main-branch artifacts. Public origins are nuckty.ru/nuckty.com and demo.nuckty.ru/demo.nuckty.com; `npm run build:preview` selects localhost links.

Contact: vitaly@harisov.name.
