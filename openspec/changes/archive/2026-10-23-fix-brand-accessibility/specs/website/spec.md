## ADDED Requirements

### Requirement: Brand accessibility
The website SHALL omit aria-label on non-interactive generic brand spans while keeping labels on brand links.

#### Scenario: Requested behavior
- **WHEN** the home page is built
- **THEN** header and footer brands are non-interactive and pass Nu HTML validation
