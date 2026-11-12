# Locked HTML output

Use the bundled renderer for all registered layouts. It uses a fixed-size stage scaled to fit the browser, preserving the intended slide ratio. There are no CDN, framework, or package-install dependencies. It is adapted from the layout-lock approach of Future Slide, with company-specific style treatment and a new renderer/navigation runtime.

```text
node scripts/build-deck.mjs path/to/slide_plan.json --out path/to/deck
node scripts/validate-deck.mjs path/to/deck/index.html
```

The builder copies referenced local images from the plan directory, writes `index.html`, `DESIGN.md`, `slide_plan.json`, and `slide_prompts.json`, and rejects invalid plans. It never uploads these files. Open `index.html` locally or serve the output directory. Arrow keys/PageUp/PageDown, navigation buttons, and horizontal swipes move pages. Esc opens a keyboard-accessible index. B toggles static mode. Browser printing uses one page per slide.

Authored `DESIGN.md` and page prompt text are preserved when present in the input or output directory. Automatically generated, unedited artifacts can be refreshed. If the builder preserves authored material, review it against the current plan; executable visual overrides belong in the plan's supported settings. The generated prompt metadata includes rendered kicker, training/draft labels, footers, and global settings.

Use `--refresh-derived` only when intentionally replacing authored design/prompt artifacts with new generated defaults. The example-building command uses this flag for its fictional fixtures; ordinary builds do not.

Run the structural validator and inspect actual rendering. Check Korean text, image crop, header/body/footer separation, table density, disclosure legibility, print page count, and index navigation. Layout validity does not prove that text fits. Reduce content or choose a more appropriate registered layout before shrinking fonts. If a genuinely new layout is needed, add it deliberately to the registry, renderer, and validation tests rather than attaching an arbitrary ID.
