# pbi-dax-card-studio

`pbi-dax-card-studio` is a React app that generates **Power BI DAX measures** that return **HTML/CSS**.
You can paste the generated measure into Power BI and render it using an **HTML rendering visual**.

This repo contains:

- A **template catalog** (cards + mini visuals).
- A **template editor** (controls + live preview + DAX output).
- A **template system** to add new cards quickly.

---

## End-user guide (Power BI)

### 1) Choose a template

1. Open the Studio.
2. Pick a template.
3. Adjust colors, radius, shadows, etc.
4. Copy the **DAX TO COPY** output.

### 2) Create the DAX measure in Power BI

1. In Power BI Desktop, go to:
   - **Modeling**
   - **New measure**
2. Paste the generated DAX.
3. Replace the placeholder measures/fields.

Typical placeholders you must replace:

- `[YourMeasure]`, `[ActualPct]`, `[TargetPct]`, `[PctMeasure]`
- `[Ventas]`, `[Ventas Mes Anterior]` (for KPI Delta)
- Any table/column references used by the template (sparklines)

### 3) Render the HTML in Power BI

Power BI visuals do not render raw HTML by default. You need an **HTML renderer visual**.

Common options:

- **HTML Content** (AppSource custom visual)
- **HTML Viewer** / similar HTML rendering visuals (varies by marketplace/tenant)

Add the visual to your report, then:

1. Drag the DAX measure into the visual field (usually “Values”).
2. Confirm the visual is configured to interpret the measure as HTML.

### 4) Fonts & external resources

Some templates import Google Fonts (Material Symbols). In locked-down environments, external font loading can be blocked.

If icons do not appear:

- Your tenant may block external resources.
- Replace icon usage with plain text/emoji, or host fonts internally (advanced).

### 5) Troubleshooting

- **You see raw HTML tags**:
  - You are using a visual that does not render HTML.
  - Switch to an HTML rendering custom visual.

- **Blank visual**:
  - The measure returns BLANK() in the current filter context.
  - Ensure all referenced measures return values.

- **Broken layout**:
  - Some visuals sanitize styles.
  - Try simplifying CSS or removing unsupported properties.

---

## Developer guide (technical)

### Requirements

- Node.js
- npm

### Run locally

```bash
npm install
npm run dev
```

Then open the Vite URL (usually `http://localhost:5173`).

### Build

```bash
npm run build
```

Output folder: `dist/`

### Project structure

- `src/pages/CatalogPage.tsx`
  - Template catalog (cards + thumbnails)
- `src/pages/EditorPage.tsx`
  - Editor layout (sidebar controls scroll only)
- `src/templates/registry.ts`
  - Template registry (list of available templates)
- `src/templates/*.ts`
  - Template implementations
- `src/templates/types.ts`
  - `TemplateDefinition` + control schema types
- `src/components/ControlPanel.tsx`
  - Renders dynamic controls from template schema
- `src/components/PreviewFrame.tsx`
  - In-DOM HTML preview (no iframe reload/flicker)
- `src/components/TemplateThumbnail.tsx`
  - Catalog thumbnails (iframe-based mini preview)
- `src/lib/storage.ts`
  - LocalStorage helpers for presets
- `src/lib/theme.ts`
  - Light/Dark theme state
- `src/config.ts`
  - Footer author info (links)

### How templates work

Each template is a `TemplateDefinition<TProps>`:

- `id`, `name`, `description`, `tags`
- `defaultProps`: default configuration
- `controls`: dynamic editor schema
- `renderPreviewHtml(props)`: returns HTML string for preview
- `exportDax(props)`: returns the final DAX measure

### Add a new template

1. Create a new file in `src/templates/` (e.g. `myNewCard.ts`).
2. Export a `TemplateDefinition`.
3. Register it in `src/templates/registry.ts`.

### Icon suggestions

The `Icon Name` field supports suggestions via:

- `src/templates/icons.ts`

It provides per-template icon lists + a Google Icons search link.

### Theming

- The theme toggle is a floating button (`ThemeToggle`).
- Theme variables are CSS custom properties in `src/index.css`.
- Theme is stored in `localStorage`.

### Publishing

You can deploy `dist/` on:

- GitHub Pages
- Netlify
- Vercel

---

## Notes

- Generated DAX is meant as a starting point. You should rename measures and replace placeholders.
- Always validate performance: heavy HTML + complex DAX can be expensive on large models.
