## ADDED Requirements

### Requirement: Complete mobile keyboard navigation
Opening the mobile menu SHALL focus its first link. Escape SHALL close the menu and restore focus to the toggle. Outside clicks SHALL close it without stealing focus from the clicked control. Open modal dialogs SHALL retain their own Escape handling.

#### Scenario: Open and close using keyboard
- **WHEN** the menu is activated by keyboard and Escape is pressed
- **THEN** the links are reachable and focus returns to the closed menu toggle

