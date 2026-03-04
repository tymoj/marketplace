# stitch-loop

Autonomous baton-passing loop for iterative Angular app building.

Each cycle generates a Stitch screen, converts it to an Angular route component, registers it in Angular Router, verifies it with Playwright MCP, and queues the next screen.

## Install

```bash
bash plugins/stitch-skills/install.sh
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
Run stitch-loop to build the next page in my Angular app's roadmap.
```

## Skill Structure

```
stitch-loop/
├── SKILL.md
├── README.md
├── examples/
│   ├── next-prompt.md
│   └── SITE.md
└── resources/
    ├── baton-schema.md
    └── site-template.md
```
