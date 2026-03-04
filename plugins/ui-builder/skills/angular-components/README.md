# angular:components

Converts Stitch designs into Angular 21 standalone components with:
- Angular CLI MCP for best practices and documentation
- Playwright MCP for visual verification against the Stitch reference design
- Angular Material 21 components and M3 theming
- Signal-based reactivity (`input()`, `output()`, `signal()`, `computed()`)

## Install

```bash
bash plugins/ui-builder/install.sh
```

## Required MCPs

```json
{
  "mcpServers": {
    "angular": { "command": "npx", "args": ["-y", "@angular/cli", "mcp"] },
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] }
  }
}
```

## Example Prompt

```
Convert my E-Commerce app's Product Card screen to an Angular 21 standalone component.
```

## Skill Structure

```
angular-components/
├── SKILL.md
├── README.md
├── package.json
├── examples/
│   └── activity-card.component.ts
├── resources/
│   ├── architecture-checklist.md
│   ├── component-template.ts
│   ├── stitch-api-reference.md
│   └── style-guide.json
└── scripts/
    ├── fetch-stitch.sh
    └── validate.js
```
