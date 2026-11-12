# Evidence-first deck planning

Create a JSON object with `version: 1`, `title`, `language` (`ko`, `en`, or `auto`), `style` (`brand`, `info`, `story`), `ratio` (`16:9`, `1:1`, `A4`, `reference`), `status` (`draft`, `approved`), `audience`, `facts`, and `slides`. Optional: `subtitle`, `author`, `company`, `date`, `infoVariant` (`teal`/`blue`), `pageNumbers`, `repeatTitle`, `coverSide` (`left`/`right`), `closing` (`split`/`stack`), `brandColor`, `font`, and `trainingLabel`.

Each fact has an `id`, a descriptive `source`, a `page`, a `status` (`verified` or `needs-review`), and optionally `text`, `value`, `unit`, and `basis`. A verified fact must identify its actual source and page/section. Use `needs-review` for unresolved facts; do not write a fictitious source. `facts` can be empty for a concept-only or fictional educational example that makes no factual product claims.

Each slide has a unique `id`, a `layout` from `layouts.json`, a `role` (`cover`, `intro`, `body`, `outro`, `none`), a `title`, and optional `kicker`, `subtitle`, `body`, `summary`, `notes`, `sourceIds`, `items`, `table`, or `image`.

`items` contain `title`, optional `text`, `value`, `unit`, `basis`, `speaker`, and `sourceIds`. For numeric charts, each item needs a finite `value`, a `unit`, a shared `basis`, and a source ID. Do not use made-up numbers to make a visual more attractive. `table` has `headers` and `rows`; each row has `cells` and optional `sourceIds`. `image` has a local `path` under `images/`, an `alt` description, and `slot: "s22-hero-21x9"` for S22.

For individual scene illustrations, an item may include `image: { "path": "images/scene.png", "alt": "Description", "slot": "scene-4x3" }` (or `scene-portrait`). This places permitted artwork beside its dialogue; no artwork is invented by the deterministic HTML renderer. Dense tables should be split into at most seven data rows per page.

Use the source ledger for claims; use visual reference files only for design. Preserve scenario assumptions and approval identifiers exactly when they are current and supplied. `status: draft` produces a visibly labeled review draft. It is not a claim of compliance approval. A user's request for direct generation does not require an additional approval step; a user's request for plan-first does.

Validate:

```text
node scripts/validate-plan.mjs path/to/slide_plan.json
```

The validator checks structure, layout cardinality, numeric comparability, and source links. It cannot establish whether a claim is true or whether two natural-language bases really match; compare the final deck to the source documents.
