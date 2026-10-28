## MODIFIED Requirements

### Requirement: Canonical documentation
The website SHALL prepare docs from `docs/` of `nuckty/nuckty` pinned in `config/external.json` and checked out by `nuckty content-external`, without editing canonical source. CI SHALL pin the latest commit with successful CI on main before preparation. Documentation pages and their order SHALL come from the source's `pages.json`. It SHALL provide route-aware navigation, page headings and local documentation search.

#### Scenario: Find a guide
- **WHEN** a visitor searches for a documentation title or text
- **THEN** matching local pages are linked from the search results
- **AND** a reader can navigate the article headings and neighboring pages

#### Scenario: New documentation page
- **WHEN** the pinned documentation adds a page to `pages.json`
- **THEN** the website lists it at that position without a website change
