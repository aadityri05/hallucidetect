# Design Brief: Hallucination Detection Analyzer

## Tone & Purpose
Scientific clarity, analytical trust. Instrument-like precision for evaluating AI output trustworthiness.

## Differentiation
Vibrant color-coded risk badges (green/amber/red), inline sentence-level risk annotation with per-sentence confidence scores, dual bar+pie chart layout, scientific/laboratory aesthetic.

## Color Palette
| Token | Light | Dark | Purpose |
|-------|-------|------|----------|
| Primary (Indigo) | 0.5 0.15 280 | 0.7 0.18 280 | Interactive elements, CTAs |
| Success (Green) | 0.65 0.19 95 | 0.68 0.2 95 | Low risk, high confidence |
| Warning (Amber) | 0.68 0.21 95 | 0.72 0.22 95 | Medium risk, uncertainty |
| Destructive (Red) | 0.55 0.2 30 | 0.65 0.18 30 | High risk, hallucination |
| Background | 0.99 0 0 | 0.12 0 0 | Page background |
| Card | 0.995 0 0 | 0.16 0 0 | Elevated content surfaces |
| Border | 0.88 0 0 | 0.25 0 0 | Dividers, outlines |
| Chart-1 (Green) | 0.65 0.19 95 | 0.68 0.2 95 | Data viz palette |
| Chart-2 (Red) | 0.68 0.21 30 | 0.65 0.18 30 | Data viz palette |
| Chart-3 (Indigo) | 0.5 0.15 280 | 0.7 0.18 280 | Data viz palette |
| Chart-4 (Blue) | 0.6 0.12 240 | 0.75 0.16 240 | Data viz palette |
| Chart-5 (Cyan) | 0.75 0.15 180 | 0.8 0.14 180 | Data viz palette |

## Typography
- **Display**: Satoshi (bold headlines, card titles)
- **Body**: Plus Jakarta Sans (content, labels, metadata)
- **Mono**: JetBrains Mono (confidence scores, citations)
- **Scale**: 12px sm, 14px base, 16px lg, 18px xl, 24px 2xl, 32px 3xl

## Elevation & Depth
Card-based architecture with subtle `shadow-sm` (0 2px 6px) for input/results sections. No heavy shadows. Single light source from top-left.

## Structural Zones
| Zone | Light Bg | Dark Bg | Border | Purpose |
|------|----------|---------|--------|----------|
| Header | 0.99 0 0 | 0.12 0 0 | 0.88/0.25 | Title, nav |
| Input Card | 0.995 0 0 | 0.16 0 0 | 0.88/0.25 | Text area, button |
| Results | 0.99 0 0 | 0.12 0 0 | (none) | Results container |
| Analysis Cards | 0.995 0 0 | 0.16 0 0 | 0.88/0.25 | Risk badge, charts, explainability |

## Spacing & Rhythm
- **Compact vertical**: 12px gap between sections, 8px inside cards
- **Horizontal breathing**: 2rem container padding
- **Grid**: 2-column layout on md+, stacked on sm

## Component Patterns
1. **Risk Badge**: `badge-success`, `badge-warning`, `badge-destructive` — pill-shaped, 4px radius, pixel-perfect typography
2. **Highlighted Text**: Inline `<mark>` with color overlay and confidence badge suffix
3. **Card**: `card-elevated` — border-top accent line optional
4. **Input Area**: Subtle 2px focused outline with `ring` color
5. **Button**: Indigo primary, white foreground, 4px radius, `transition-smooth`
6. **Charts**: Recharts or similar, inheriting 5-color palette from CSS tokens

## Motion
- `transition-smooth`: All interactive elements (0.3s cubic-bezier)
- `animate-pulse-soft`: Loading state indicator on analyze button
- No bounce, no fade-in on page load; clarity over delight

## Constraints
- No arbitrary colors; all tokens via CSS variables
- No generic tech blue; indigo primary is cool but intentional
- Sentence-level UI elements remain readable at 12px
- Charts use 5-color palette only; no gradients or blurred backgrounds

## Signature Detail
Inline sentence annotation with dual confidence badges (risk level + %) positioned above suspicious phrases. On hover: tooltip showing NLP reasoning for the flag. This creates a "transparent analysis" feel — users see exactly why content is flagged.
