## ADDED Requirements

### Requirement: Content-sized breadcrumb row
The desktop documentation grid SHALL size its breadcrumb row to its content independently of sidebar height, and SHALL place the article immediately below it.

#### Scenario: Short section with tall navigation
- **WHEN** a section overview is shorter than the sidebar
- **THEN** breadcrumbs and the article remain at the top of the reading column
- **AND** the sidebar does not create blank space above the article
