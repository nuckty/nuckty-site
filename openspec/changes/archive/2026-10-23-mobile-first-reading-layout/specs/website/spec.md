## ADDED Requirements

### Requirement: Mobile-first responsive reading
The website SHALL use a single reading column on narrow screens and progressively add navigation columns only when sufficient width is available. Code SHALL scroll inside its own frame without overlapping desktop navigation. The header SHALL expose one language control and retain a readable wordmark at every breakpoint.

#### Scenario: Resize a guide
- **WHEN** the reader views a guide on a mobile, tablet or desktop viewport
- **THEN** text, code and navigation remain within their assigned columns without horizontal page scrolling
- **AND** mobile code retains its edge-to-edge background and independent copy button
