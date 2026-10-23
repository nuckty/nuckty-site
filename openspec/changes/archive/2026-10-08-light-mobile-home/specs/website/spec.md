## ADDED Requirements

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

