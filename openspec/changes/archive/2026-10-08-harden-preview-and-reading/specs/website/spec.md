## ADDED Requirements

### Requirement: Preview survives rebuilding with retained ownership
The English preview SHALL keep its PID and configuration outside the cleaned build workspace. Start SHALL refuse an already active preview, and stop SHALL verify process ownership before signaling it.

#### Scenario: Build while preview runs
- **WHEN** the English preview is running and the website rebuilds
- **THEN** the preview still serves the rebuilt English artifact
- **AND** stop:en stops the same owned process

