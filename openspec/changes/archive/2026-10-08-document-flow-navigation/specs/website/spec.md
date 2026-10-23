## ADDED Requirements

### Requirement: Document-flow navigation
The header SHALL not remain fixed or sticky. Open menu and search results SHALL participate in normal document flow with no independent vertical scroll or body locking. Content SHALL remain interactive. The desktop search icon SHALL be the rightmost visible header control.

#### Scenario: Scroll an open menu
- **WHEN** a reader opens navigation and scrolls
- **THEN** header, map and content use the same document scroll

## MODIFIED Requirements

### Requirement: Complete mobile keyboard navigation
Opening the mobile menu SHALL focus the search input. Escape SHALL close the menu and restore focus to the toggle. Content SHALL remain interactive without an outside-click dismissal that collapses the document flow. Open modal dialogs SHALL retain their own Escape handling.

#### Scenario: Open and close using keyboard
- **WHEN** the menu is activated by keyboard and Escape is pressed
- **THEN** the input and links are reachable and focus returns to the closed menu toggle

