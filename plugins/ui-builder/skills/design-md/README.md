# design-md

Analyzes a Stitch project screen and generates a comprehensive `DESIGN.md` documenting the design system.

Output includes an **Angular Material M3 theme mapping** section for direct use in Angular 21 projects.

## Install

```bash
bash plugins/ui-builder/install.sh
```

## Example Prompt

```
Analyze my E-Commerce project's Home screen and generate a DESIGN.md with Angular Material theme tokens.
```

## What It Produces

- `DESIGN.md` with visual theme, color palette, typography, component styles, layout principles
- Angular Material M3 theme configuration (copy into `theme.scss`)
- Design system block for reuse in subsequent Stitch generation prompts

## Skill Structure

```
design-md/
├── SKILL.md
├── README.md
└── examples/
    └── DESIGN.md
```
