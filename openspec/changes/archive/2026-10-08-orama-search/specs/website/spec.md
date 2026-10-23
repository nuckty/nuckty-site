## ADDED Requirements

### Requirement: Local Orama search
The website SHALL use Orama JS with language-specific Russian and English stemming for local full-text search. Queries SHALL remain in the browser. Titles and headings SHALL have greater relevance weight than body text, and small spelling errors SHALL be tolerated without replacing exact matches with weaker results.

The search engine and current-language corpus SHALL ship as separate static artifacts and load in the background after the initial page render, or immediately when search opens first. The main interface bundle SHALL not include Orama or corpus text. Loading SHALL preserve typed input and show download progress using the known uncompressed corpus size, followed by an indexing indicator. Failure SHALL show a localized message and allow retry on reopening.

#### Scenario: Search an inflected or misspelled term
- **WHEN** a reader searches a documented term using another supported word form or a small typo
- **THEN** the relevant page appears in the current language results
- **AND** the browser performs the query without a remote search service

### Requirement: Complete searchable website corpus
Search data SHALL include every documentation route, the landing page and use cases in each language. Documentation code examples SHALL remain searchable. Result excerpts SHALL show relevant text and render user/document text safely without executing markup. Search closing, shortcut and return-focus behavior SHALL be preserved.

#### Scenario: Search for an API or product use case
- **WHEN** a reader searches a term from a code example or product page
- **THEN** the corresponding page is reachable from search results
- **AND** the result contains a readable excerpt

### Requirement: Adaptive header search and site map
On desktop, the search icon SHALL replace the header contents with a full-width input and show results beneath it. On mobile, the header SHALL have no separate search icon; the hamburger SHALL open one scrollable panel containing a search field and the complete grouped site map. Entering a query SHALL replace the map with results; clearing it SHALL restore the map. Escape and close controls SHALL restore focus, and changing the layout breakpoint SHALL leave controls usable. Static navigation SHALL remain available before scripts initialize.

#### Scenario: Open the mobile navigation
- **WHEN** a reader activates the hamburger on a phone
- **THEN** search and all website routes are reachable from the same panel
- **AND** clearing the query restores the site map

#### Scenario: Search from the desktop header
- **WHEN** a reader activates the search icon or keyboard shortcut
- **THEN** the header becomes the search field
- **AND** closing search restores its normal contents and focus
