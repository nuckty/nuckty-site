# Prepare documentation through content-external

## Why
The website cloned documentation with its own CI steps, read it from a sibling directory and kept its own route order, so it did not show the supported way to consume external documentation.

## What Changes
- `config/external.json` pins `docs/` of `nuckty/nuckty` to a commit; CI updates the pin to the latest commit with successful CI and runs `nuckty content-external`.
- Documentation pages and their order come from `docs/pages.json`.
- Templates use `b()` and `attributes()` from `@nuckty/core` instead of a local copy.

## Impact
Website CI, package update workflow, content preparation and templates.
