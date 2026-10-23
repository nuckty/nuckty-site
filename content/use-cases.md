# Use cases

Use nuckty for documentation, guides and content websites: authors write Markdown pages, while developers control interface blocks and the build.

## Documentation

Guides, references and architecture decisions: source-file links become page URLs through the sitemap. Headings get hierarchical anchors. This website builds nuckty documentation from its own repository.

[Start with the guide](/how/start), then explore the [sitemap](/how/sitemap) and [Markdown](/how/markdown).

## Content websites

Articles, instructions and communities: text stays separate from interface blocks. Gallery, grid and video are extensions; register your own constructs through `env.markdown`.

[Ready-made extensions](/ext) and [writing your own](/how/ext).

## Multiple languages and domains

A target is one website build. Multiple targets share blocks while using separate sitemaps and output directories. The engine passes `hreflang` data for related language versions to the document handler. Authors supply translations.

[Configure targets](/how/targets).

## Shared hosting

The build prepares HTML, assets, Brotli and Gzip, a manifest, and nginx and Apache configuration. The `deploy-ftp` extension publishes the artifact over FTP or FTPS. The server needs compatible modules and settings.

[Explore the output](/out) and [configure hosting](/out/hosting).

## When another tool is needed

For dynamic data, server authentication or persistent application state, nuckty builds the static part. A CMS, server API and visual editor are outside the core. Blocks can include client JavaScript; the demo contains a live example.

