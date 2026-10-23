## ADDED Requirements

### Requirement: Bilingual product website
The website SHALL build with nuckty into Russian and English targets with matching routes and language metadata. It SHALL explain the product, use cases, workflow and extension model.

#### Scenario: Build both languages
- **WHEN** the prepared sibling packages and docs are available and npm run build runs
- **THEN** both language artifacts contain a landing page and the complete documentation routes
- **AND** navigation links and hreflang metadata point to corresponding routes

### Requirement: Canonical documentation
The website SHALL prepare docs from the sibling nuckty-docs without editing canonical source. It SHALL provide route-aware navigation, page headings and local documentation search.

#### Scenario: Find a guide
- **WHEN** a visitor searches for a documentation title or text
- **THEN** matching local pages are linked from the search results
- **AND** a reader can navigate the article headings and neighboring pages

### Requirement: Verified static artifacts
The website SHALL emit HTML, CSS, JavaScript and compressed counterparts through nuckty. The supported local checks SHALL verify links, asset existence and compression round trips.

#### Scenario: Check output
- **WHEN** npm test runs after a build
- **THEN** both target artifacts pass the consumer checks

