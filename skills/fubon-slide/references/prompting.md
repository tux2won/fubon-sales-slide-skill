# English page-generation instructions

English is the production-instruction language. The slide-copy language is a separate setting; Korean remains the default. Preserve supplied Korean product names, figures, units, and mandatory statements verbatim. English instructions alone are not a guarantee of better images.

Write `slide_prompts.json` as `{ "version": 1, "style": "brand", "language": "ko", "pages": [...] }`. Each page has `page`, `slideId`, `layout`, `role`, `visibleText`, `sourceIds`, `assetPaths`, and `generationPrompt`.

The English `generationPrompt` should contain:

1. Output dimensions/ratio and page role.
2. The selected style and explicit overrides from `DESIGN.md`.
3. Header, body, and footer placement; chart/table/scene geometry.
4. Exact visible text, quoted as data; preserve Korean copy rather than translating it to English.
5. Actual source assets and exact conditions/footnotes.
6. A consistency anchor to the previous accepted page.
7. Specific failure checks: missing Korean syllables, altered numbers, cropped notes, changed character appearance, or unsupported claims.

Do not create prose that contradicts the selected workflow. For plan-first, the final execution instruction must stop after the plan. For direct generation, request actual output files. For Codex, the web prompter prefixes `With $fubon-slide skill,`; for ordinary ChatGPT usage the prompt embeds the style rules without pretending that a Codex skill was installed.
