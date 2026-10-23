# Make catalogue installation instructions executable

## Why
Three catalogue entries still instruct readers to install unpublished nuckty packages from the registry. Their --save-dev flag escaped the earlier source search. All corresponding package archives are already included in the starter.

## What Changes
Use the prepared starter archives in every own-package install example and verify rendered catalogue commands against the actual starter receipt. Preserve development-dependency intent.

## Impact
Updates canonical bilingual installation prose and consumer verification; no engine or public API changes.
