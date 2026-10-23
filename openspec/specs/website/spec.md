# website Specification

## Purpose
Explain nuckty, its use cases and workflow, and publish its canonical Russian and English documentation as a searchable website built with the engine itself.

## Requirements

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

### Requirement: Concrete product entry
The website SHALL identify nuckty as a static site generator and name its documentation/content use cases in the opening viewport. It SHALL present a compact example whose tree, template and HTML correspond to the actual engine output.

#### Scenario: Inspect the example
- **WHEN** a visitor switches the BEMJSON, template and HTML tabs
- **THEN** the corresponding actual source is displayed with an accessible selected state
- **AND** the static preview remains available without JavaScript

### Requirement: Reading order and mobile navigation
The documentation SHALL follow a coherent learning order. Its mobile section navigation SHALL be expandable without blocking the initial article view.

#### Scenario: Continue after getting started
- **WHEN** a reader follows the next-page link on the start guide
- **THEN** the data model guide is opened

### Requirement: Executable starter download
The website SHALL offer a starter ZIP containing prepared nuckty, root and serve package archives. The guide SHALL install those archives rather than depend on unpublished nuckty packages in the public registry.

#### Scenario: Build the extracted starter
- **WHEN** the archive is extracted, npm install and npm run build run with Node.js 24+
- **THEN** the standalone consumer builds its index HTML without sibling source repositories

### Requirement: Fluid typography and restrained visual style
The consumer SHALL use a primary text typeface and monospace code, a flat palette with one interface accent per theme, and semantic fluid font sizes with readable limits. The header mark SHALL remain prominent alongside the wordmark.

#### Scenario: Resize the viewport
- **WHEN** viewport width changes across phone, tablet and desktop layouts
- **THEN** font sizes change smoothly within their limits
- **AND** content and controls remain available without document-level horizontal overflow

### Requirement: Preview survives rebuilding with retained ownership
The English preview SHALL keep its PID and configuration outside the cleaned build workspace. Start SHALL refuse an already active preview, and stop SHALL verify process ownership before signaling it.

#### Scenario: Build while preview runs
- **WHEN** the English preview is running and the website rebuilds
- **THEN** the preview still serves the rebuilt English artifact
- **AND** stop:en stops the same owned process

### Requirement: Complete mobile keyboard navigation
Opening the mobile menu SHALL focus the search input. Escape SHALL close the menu and restore focus to the toggle. Content SHALL remain interactive without an outside-click dismissal that collapses the document flow. Open modal dialogs SHALL retain their own Escape handling.

#### Scenario: Open and close using keyboard
- **WHEN** the menu is activated by keyboard and Escape is pressed
- **THEN** the input and links are reachable and focus returns to the closed menu toggle

### Requirement: Distinct logo eyes in both themes
The consumer SHALL use dark green eyes against the pale head in the dark theme and preserve the supplied mark geometry.

#### Scenario: Switch to dark theme
- **WHEN** a visitor switches to the dark theme
- **THEN** the logo eyes remain clearly distinguishable from the head

### Requirement: Executable catalogue installation instructions
Own-package installation commands in the extension catalogue SHALL use prepared archives included in the downloadable starter. The verification SHALL cover command flags and reject bare registry package references or archive filenames missing from the starter receipt.

#### Scenario: Install an extension after extracting the starter
- **WHEN** a reader follows a catalogue npm install command from the extracted starter root
- **THEN** the named local package archive is available
- **AND** the command does not require an unpublished nuckty package from the public registry

### Requirement: Readable article code lines
Article and example-source code blocks SHALL soft-wrap long lines within the available width while preserving literal whitespace and the exact copy payload. Example-source panels SHALL provide the same copy control as article code blocks.

#### Scenario: Read a long installation command
- **WHEN** a code line exceeds the article width on phone or desktop
- **THEN** the full line remains readable within the code block
- **AND** copying returns the original text without inserted line breaks

### Requirement: Progressive navigation and controls
Before client initialization, the consumer SHALL expose ordinary mobile navigation links and a compact section-index entry instead of inactive navigation buttons. Script-dependent controls SHALL become available after their handlers are installed. Enhanced menu focus, Escape and modal behavior SHALL be preserved.

#### Scenario: Scripts do not execute
- **WHEN** page scripts are unavailable or blocked
- **THEN** readers can follow the main navigation and section-index links
- **AND** inactive search, theme and menu buttons are hidden

#### Scenario: Scripts initialize
- **WHEN** navigation handlers are installed
- **THEN** the existing compact mobile menu and sidebar controls work as before

### Requirement: Reflow with enlarged text
The consumer SHALL allow its header groups and headings to reflow with an enlarged base font size. Menu placement and document anchor offsets SHALL follow the actual enhanced header height.

#### Scenario: Double the base font size
- **WHEN** the base font is doubled on a narrow viewport
- **THEN** header text and controls remain available without document overflow

### Requirement: Discoverable persistent theme control
The enhanced consumer SHALL expose a recognizable theme button with a touch target of at least 40 CSS pixels in each dimension on mobile and desktop. A visitor choice SHALL persist in localStorage on the same origin across navigation and reload. Mobile header controls SHALL remain reachable alongside the prominent wordmark.

#### Scenario: Return to a selected theme
- **WHEN** a visitor selects a theme and navigates to another page or reloads it
- **THEN** the selected theme and button state are restored
- **AND** the button remains visible at phone widths

### Requirement: Compact readable article entry
The consumer SHALL show an ancestor breadcrumb trail without duplicating the current article heading. Breadcrumbs and section controls SHALL use readable fluid interface type. The mobile parent link and section toggle SHALL share one compact navigation band above the heading when space permits and wrap with enlarged text. Desktop SHALL retain the full ancestor trail. Both layouts SHALL preserve complete labels and section navigation.

#### Scenario: Read a deeply nested article on a phone
- **WHEN** a nested page opens on a narrow viewport
- **THEN** the ancestor trail wraps without clipping or repeating the article title
- **AND** the section toggle remains usable without excessive space above the article

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

### Requirement: Themed search progress
Search progress SHALL use the current theme accent for its value and the interface line color for its track, including browsers whose native appearance ignores accent-color.

#### Scenario: Download the index
- **WHEN** the progress indicator shows a partial download
- **THEN** its filled segment uses the current interface accent

### Requirement: Unframed theme and animated burger
The consumer SHALL retain the theme touch target without a border. The burger SHALL morph its existing lines into a cross with a 0.3 second transition, remain rendered during the transition, and honor reduced-motion preferences.

#### Scenario: Open mobile navigation
- **WHEN** the mobile toggle opens navigation
- **THEN** its existing lines visibly converge and rotate into a cross

### Requirement: Stable footer links
Footer text and links SHALL share consistent baselines and spacing, including narrow wrapped layouts. Documentation page source links SHALL appear inside the footer rather than beneath the article.

#### Scenario: Read a documentation footer
- **WHEN** the reader reaches the footer on a phone or desktop
- **THEN** the page source link belongs to its navigation and shares its type and alignment

### Requirement: Direct search and fixed section map
Opening the hamburger SHALL focus the search input. Map sections SHALL remain expanded without disclosure controls or separate overview rows; each section heading SHALL link to its overview page. Empty-result text SHALL share the text baseline and horizontal gutter of the primary map links.

#### Scenario: Browse or search from the mobile menu
- **WHEN** the reader activates the hamburger
- **THEN** typing can begin immediately and section headings directly open their overview pages
- **AND** an empty result occupies the same entry position as the primary map links

### Requirement: Distinct current sitemap page
The map SHALL distinguish the exact current page solely with a white rounded background around its text and a readable foreground, including overview headings. It SHALL have no active underline, edge or weight change. Primary links SHALL mark only their exact route.

#### Scenario: Open an article or overview
- **WHEN** the map opens on an article or section overview
- **THEN** only the corresponding text label has the white rounded treatment

### Requirement: Compact branded footer
The footer SHALL place the nuckty logo and made-with caption on the left and vertically stacked GitHub, contextual page source and MIT entries aligned right on both phone and desktop. The guide link SHALL be absent.

#### Scenario: Reach the footer
- **WHEN** a page ends
- **THEN** the footer follows the requested left identity and right navigation hierarchy without overflow

### Requirement: Directional neighboring page links
Neighboring links SHALL show the page name and an outward chevron at the corresponding side without visible direction captions. Direction SHALL remain accessible and a missing neighbor SHALL not move the other to the wrong side.

#### Scenario: Continue reading
- **WHEN** a reader reaches the neighboring links
- **THEN** the preceding page is on the left and the following page on the right

### Requirement: Single mobile map entry
The enhanced website SHALL expose its map through the hamburger without a duplicate sections control in the reading area. Static fallback navigation SHALL remain available.

#### Scenario: Read an article on a phone
- **WHEN** scripts initialize
- **THEN** the breadcrumb has no duplicate map-opening button

### Requirement: Header language control
The language link SHALL be visible directly before the theme control in the normal header at phone and desktop widths.

#### Scenario: Switch languages from the header
- **WHEN** a reader views the normal Russian header
- **THEN** EN appears immediately to the left of the theme control

### Requirement: Prominent neighboring chevrons
Neighboring chevrons SHALL be large white background graphics behind the page names rather than separate foreground elements. Text SHALL remain readable in both themes.

#### Scenario: Continue reading
- **WHEN** neighboring page links are visible
- **THEN** their directional chevrons sit behind the text as a restrained background at phone and desktop widths

### Requirement: Unified section map and readable language control
The website map SHALL use a single section hierarchy without a quick-link strip or English/Russian entry. Product pages SHALL belong to its root group and the guide to its guide section. The header language text SHALL be at least 1rem. Active white labels SHALL use larger padding while remaining text-only.

#### Scenario: Open the map
- **WHEN** the hamburger opens the map
- **THEN** all website routes are available in one hierarchy and language switching remains in the normal header

### Requirement: Document-flow navigation
The header SHALL not remain fixed or sticky. Open menu and search results SHALL participate in normal document flow with no independent vertical scroll or body locking. Content SHALL remain interactive. The desktop search icon SHALL be the rightmost visible header control.

#### Scenario: Scroll an open menu
- **WHEN** a reader opens navigation and scrolls
- **THEN** header, map and content use the same document scroll

### Requirement: Text-anchored broad neighboring arrows
Background chevrons SHALL preserve their original 30 by 84 px path geometry and angle while tripling stroke thickness from 6 to 18 px. They SHALL begin at the page-name block and remain behind text without occupying layout space. Their SVG viewport SHALL contain the full stroke without clipping.

#### Scenario: Read neighboring links
- **WHEN** names are visible
- **THEN** arrows retain their original angle with a triple-thickness stroke

### Requirement: Unruled ending navigation
The neighboring links and footer SHALL have no top horizontal separator.

#### Scenario: Reach the page ending
- **WHEN** neighboring links and footer are visible
- **THEN** neither has a horizontal rule above it

### Requirement: Bottom-aligned footer navigation
The right footer navigation SHALL align its bottom edge with the left identity block.

#### Scenario: Reach the footer
- **WHEN** both footer columns are visible
- **THEN** their bottom edges align

### Requirement: Larger fluid reading text
Main reading text SHALL grow continuously from 17px at 320px viewport width to 20px at 1280px, bounded at those sizes.

#### Scenario: Resize the reading page
- **WHEN** the viewport changes from mobile to desktop
- **THEN** main text grows without horizontal page overflow

### Requirement: Static syntax highlighting
Static fenced code and source examples SHALL receive semantic token markup at build time using TanStack Highlight, without a browser highlighter. Source text SHALL remain unchanged. Unknown languages SHALL remain plain text. Two themes SHALL use shared markup and CSS without line numbers.

#### Scenario: Read or copy a snippet
- **WHEN** a static snippet is displayed or copied
- **THEN** token colors follow the selected theme and its text remains unchanged

### Requirement: Contrasting neighboring-page background
The neighboring-page area SHALL use a white background and paper-colored arrows in the light theme, with corresponding dark-theme colors.

#### Scenario: Reach neighboring pages
- **WHEN** the light theme is selected
- **THEN** the area is white and arrows match the main page background

### Requirement: Light mobile homepage
The mobile homepage SHALL separate sections through spacing and typography rather than repeated borders. Source tabs SHALL retain a visible selected state and readable code. Desktop presentation SHALL remain unchanged.

#### Scenario: Read the mobile homepage
- **WHEN** the viewport is at most 1024px
- **THEN** feature links, examples and output sections have no decorative enclosing borders

### Requirement: No redundant current-page links
Current-page navigation SHALL render as noninteractive text. Homepage brand marks in header and footer SHALL have no link or hover treatment. Search SHALL omit the current page from results.

#### Scenario: Visit the homepage
- **WHEN** homepage brand marks are displayed
- **THEN** neither links to its current page or changes on hover

### Requirement: Brand accessibility
The website SHALL omit aria-label on non-interactive generic brand spans while keeping labels on brand links.

#### Scenario: Requested behavior
- **WHEN** the home page is built
- **THEN** header and footer brands are non-interactive and pass Nu HTML validation
