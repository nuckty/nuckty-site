# Global
@../nuckty/codestyle/AGENTS.md

# Website
- Canonical documentation is prepared from ../nuckty/docs; edit its source rather than generated content/docs.
- Build and verification use npm scripts. Website text is paired in Russian and English.
- Preserve user changes; do not commit, publish or deploy without instruction.
- Compose BEMJSON in structural nu.ts modes; declare tags and HTML attributes separately in the same file. Use block/elem/mods/mix, never class-string helpers or cls for BEM entities.
- Keep paired RU/EN keysets outside template logic. Format CSS with npm run lint:fix.
