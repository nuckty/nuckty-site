# nuckty-site

Nuckty product website and canonical documentation. Russian and English targets share blocks and matching routes. Both use the supplied new SVG logo and a separate square favicon derived from its mark. The starter installs exact public npm versions of core/root/serve; extensions are added from npm.

The landing-page tabs show the actual BEMJSON, template file and HTML from the current build. Documentation starts with the setup guide and data model; mobile section navigation is expandable.

The website build uses Python 3 to package the starter. Installing and building the downloaded project does not require Python. Check it with `npm run test:starter`; add `-- --preview` to exercise serve/edit/rebuild/stop (or `NUCKTY_NPM_CACHE=/path/to/cache npm run test:starter -- --offline`).

## Build and check

Requires Node.js 24+, npm, Git and Git LFS. Nuckty dependencies are exact public npm releases. Run `npx nuckty content-external` once after `npm ci`: it checks out the `docs/` directory of `nuckty/nuckty` at the commit pinned in `config/external.json` into `external/nuckty/`. CI pins the latest commit with successful CI before building.

```bash
npm ci
npm run build
npm run lint
npm test
npm run validate
```

`build` prepares documentation locally and invokes `nuckty build`. Output is `site/ru/` and `site/en/`. Generated docs, sitemaps and search data are ignored; edit canonical `docs/` in `nuckty/nuckty` or product copy in `content/`. The page order comes from its `docs/pages.json`. `test` checks links, anchors, assets, IDs, manifest hashes/sizes, Brotli/Gzip round trips, logo and hreflang. Nu validation requires Java.

## Local preview

Requires nginx. Run in separate terminals:

```bash
npm run serve       # http://localhost:8091
npm run serve:en    # http://localhost:8093
```

Start `npm run serve` in `../nuckty/demo` for the demo on port 8092. Stop with `npm run stop` and `npm run stop:en`; each target keeps its own nginx PID and configuration in `.build/serve/<target>/`.

Builds use public cross-project and language origins by default. Use `npm run build:preview` for local demo/language links. Canonical metadata uses nuckty.ru/nuckty.com; no deployment is performed by these scripts.

## Sources

`blocks/root` owns the document, navigation and table of contents. `home` and `card` build the landing page and actual nu example. `search` provides local full-text search; `shell` owns theme, menu and copy controls. `blocks/brand` holds the exact logo, dark variant, favicon and its license. Shared project rules are in `AGENTS.md`.

Search uses Orama JS 3.1.18 with Russian and English stemming. Content preparation includes complete Markdown text, fenced code, the landing-page source and use cases, covering 52 routes per language. The engine ships as a separate hashed ES module; the current-language corpus ships as JSON in `search-index.txt`. Both load during browser idle time after rendering, or immediately if search opens first. Download progress uses the uncompressed UTF-8 corpus size and works with gzip/Brotli; indexing has its own indicator. Queries run locally, require every word, weight titles/headings above body text and retry small typos after exact-token search. Short terms such as `nu` remain exact. Excerpts highlight matching words through text nodes. On phones, the hamburger opens search and the complete site map; on desktop, the search icon turns the entire header into an input. Escape restores the opener, and breakpoint changes close the panel. `npm test` covers both languages, built-module behavior and progress metadata.

MIT. Logo license: `blocks/brand/LICENSE`.

## Source CI

The `CI` workflow installs package dependencies from the checked-in registry lockfile and checks out only canonical documentation at its latest successful CI commit. It verifies both languages and standalone npm-based starters before deploying approved main-branch artifacts. Public origins are nuckty.ru/nuckty.com and demo.nuckty.ru/demo.nuckty.com; `npm run build:preview` selects localhost links.

Contact: vitaly@harisov.name.

## Published package updates

`.github/workflows/update-packages.yml` resolves the selected public npm `beta` or `latest` channel for the fixed official package set in `config/config-packages.json`. It rejects incompatible core peers, verifies a clean install and consumer acceptance, commits exact versions and lock integrity, then explicitly dispatches deployment CI; unchanged sets do not create commits. Package publication dispatches this workflow after registry verification.

The selected deployment version map also renders official npm install commands from canonical documentation; prose and third-party examples retain the canonical source text. Starter archives use the same verified package map.
