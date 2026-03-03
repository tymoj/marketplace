---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when building web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
user-invocable: false
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Design Thinking

Before coding, understand the context and commit to a clear aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick a direction: brutally minimal, maximalist, retro-futuristic, organic/natural, luxury/refined, playful, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian. Use these for inspiration but design one that is true to the context.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this memorable? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

## Frontend Aesthetics Guidelines

- **Typography**: Choose fonts that are beautiful and distinctive. Avoid generic fonts (Arial, Inter, Roboto). Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use framework animation libraries (Framer Motion, GSAP, Vue transitions) when available. One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth — gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, grain overlays.

NEVER use generic AI aesthetics: overused font families (Inter, Roboto, system fonts), cliched color schemes (purple gradients on white), predictable layouts, cookie-cutter design without context-specific character.

## Implementation Quality

- Match complexity to the aesthetic vision — maximalist designs need elaborate animations; minimalist designs need precision in spacing and typography
- All code must be production-grade and functional
- Accessibility: semantic HTML, ARIA labels, keyboard navigation, color contrast
- Responsive: mobile-first, fluid layouts, no horizontal scroll on any viewport
- Performance: lazy load images, optimize animations for 60fps, minimize layout shifts
