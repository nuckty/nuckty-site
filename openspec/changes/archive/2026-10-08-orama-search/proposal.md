# Orama search in the responsive header

## Why
Substring search misses inflections and typos, omits code/product sources, and ships both language corpora in the main JavaScript. The centered modal adds a separate mobile search entry and interrupts the header layout.

## What Changes
Use pinned Orama JS with RU/EN stemming, complete source corpora, exact-token ranking and typo fallback. Desktop search replaces the header; the mobile hamburger exposes one search/site-map panel. Emit the engine as a separate hashed module and each corpus as a static artifact. Load in background idle time or on demand, report real compressed-transfer progress against uncompressed size, preserve input and allow retry.

## Impact
Website dependencies, build hook, content preparation, root/search/shell blocks, bilingual README and focused search/artifact/browser verification. No engine or demo changes and no publication.

