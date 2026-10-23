## ADDED Requirements

### Requirement: Executable catalogue installation instructions
Own-package installation commands in the extension catalogue SHALL use prepared archives included in the downloadable starter. The verification SHALL cover command flags and reject bare registry package references or archive filenames missing from the starter receipt.

#### Scenario: Install an extension after extracting the starter
- **WHEN** a reader follows a catalogue npm install command from the extracted starter root
- **THEN** the named local package archive is available
- **AND** the command does not require an unpublished nuckty package from the public registry
