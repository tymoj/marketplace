# angular-material

Angular Material 21 (M3) integration guide for Stitch-generated Angular apps.

Covers:
- M3 theming from Stitch `DESIGN.md` color palette
- Component usage patterns (data tables, forms, navigation, dialogs)
- Customization via CSS variables and theme mixins
- Playwright MCP visual verification of Material components

## Install

```bash
bash plugins/ui-builder/install.sh
```

## Example Prompt

```
Set up Angular Material for my Angular app using the design tokens from DESIGN.md.
```

## Skill Structure

```
angular-material/
├── SKILL.md
├── README.md
├── examples/
│   ├── auth-layout.ts
│   ├── data-table.ts
│   └── form-pattern.ts
├── resources/
│   ├── component-catalog.md
│   ├── customization-guide.md
│   └── setup-guide.md
└── scripts/
    └── verify-setup.sh
```
