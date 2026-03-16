# Skill: Design
Trigger: design, UI, landing page, component, layout, make it look good
## Context
No designer on team. All UI must be production-quality from code.
## Brand System
- Primary accent: Signal Amber (#F59E0B)
- Dark: #0A0A0A
- Light: #FFFFFF
- Font: Inter or system sans-serif
- Style: minimal, dark-mode-first, no decorative elements
## Steps
1. If Figma file exists → use Figma MCP to extract tokens
2. If no design → follow brand system above
3. Tailwind CSS only — no custom CSS unless necessary
4. Mobile-first, scale up
5. Every interactive element: hover, focus, active states
6. Test light and dark mode
7. Accessibility: alt text, labels, contrast 4.5:1+
## Patterns
- Cards: rounded-xl, border subtle, shadow-sm hover
- Buttons: rounded-lg, font-medium, transition-all 150ms
- Inputs: rounded-lg, border, focus:ring-2 ring-amber-500
- Layout: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
