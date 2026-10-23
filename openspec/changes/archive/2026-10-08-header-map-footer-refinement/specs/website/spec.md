## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Complete mobile keyboard navigation
Opening the mobile menu SHALL focus the search input. Escape SHALL close the menu and restore focus to the toggle. Outside clicks SHALL close it without stealing focus from the clicked control. Open modal dialogs SHALL retain their own Escape handling.

#### Scenario: Open and close using keyboard
- **WHEN** the menu is activated by keyboard and Escape is pressed
- **THEN** the input and links are reachable and focus returns to the closed menu toggle

