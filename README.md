# marketplace

Claude Code plugin marketplace.

## Plugins

### [conductor](plugins/conductor/)

Universal SDLC orchestrator. Runs a 5-phase discovery → plan → implement → test → review pipeline for any tech stack. Bundles 18 specialist agents and 13 domain-knowledge skills.

```bash
claude plugin install conductor@tymoj/marketplace
```

```
/conductor:dev-plan Add a REST endpoint for user registration
```

### [ui-builder](plugins/ui-builder/)

Convert local design images (PNG, JPG, Figma exports, screenshots) into production Angular 21 standalone components with Angular Material. Reads images natively — no external design tool required. Supports forms, tables, dashboards, and autonomous page-by-page app building.

```bash
claude plugin install ui-builder@tymoj/marketplace
```

```
Use image-to-angular to convert designs/checkout.png into a CheckoutFormComponent
Run ui-loop to build the next page in my Angular app's roadmap
```

### [mermaid](plugins/mermaid/)

Mermaid diagram generation for Claude Code. Adds `mermaid-architect` agent and diagram validation hooks. Optional dependency for `conductor` — enables visual plan diagrams in Phase 2.

```bash
claude plugin install mermaid@tymoj/marketplace
```

## Using conductor + ui-builder together

After planning with conductor, the frontend teammate automatically uses ui-builder skills (`image-to-angular`, `angular-material`, `design-md`) to build Angular components from design images:

```
/conductor:dev-plan Build the checkout page based on designs/checkout.png
↓ (after plan approval)
/conductor:dev-build task-crd-0001
```

Both plugins must be installed. Add Angular CLI MCP + Playwright MCP to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "angular": { "command": "npx", "args": ["-y", "@angular/cli", "mcp"] },
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] }
  }
}
```

## Useful links

- [Claude Code Plugins](https://github.com/anthropics/claude-code/tree/main/plugins)
- [Awesome Claude Code Subagents](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/main)
- [Awesome Agent Skills](https://github.com/VoltAgent/awesome-agent-skills)
