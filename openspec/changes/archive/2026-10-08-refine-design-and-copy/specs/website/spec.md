## ADDED Requirements

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

