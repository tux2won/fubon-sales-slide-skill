# Validation record

## UI 1.2 update

The website now renders all four input sections at once, with a sticky desktop prompt panel and a single scrolling document. The header uses the supplied Fubon color logo, the exact title ‘영업교육팀 슬라이드 프롬프터’, and a `github` link to the existing repository. The supplied Youandi Modern TextRegular, TextBold, HeadRegular, HeadBold, and HeadExtraBold files are registered as webfonts; browser font checks passed for all five faces. Body, headings, controls, numbers, and generated-prompt display use these font families.

Browser checks confirmed four visible sections with no step-toggle controls, the correct header/link labels, a loaded original logo, working style/credit changes and English Codex-copy output, no console errors, and no horizontal overflow at 390px. `scripts/export-web.mjs` verifies byte equality between canonical `web/` files and a chosen static export. The offline HTML inlines the same supplied fonts and logo.

The GitHub UI source and prepared static export are updated. Re-publication to the original Sites URL is currently blocked by `sites_git_client_upgrade_required` from the connected Sites service; it must not be reported as deployed until that access path works or the user chooses another hosting route.

Validated on Windows with Node.js 24.22.1. The package requires Node.js 20+ for its own renderer; the optional third-party skills CLI may have a newer Node requirement.

- Automated tests: 17 behavior tests, including all S01–S22 render paths, three styles, source IDs and numeric bases, real output files, authored-artifact preservation, scene assets, English instructions, Korean user-copy preservation, Codex/ChatGPT routing, and Windows UTF-8 BOM input.
- Skill-creator frontmatter/scaffold validation passed.
- Independent consumer forward test: a four-page Korean square Story deck was created from the skill without an intended-answer fixture.
- Independent follow-up: 44 checks confirmed authored artifacts, exact prompt metadata, scene-4x3 and scene-portrait assets; the discovered UTF-8 BOM issue was fixed and given a regression test.
- Browser review: all six classroom slides fit their content/footer zones; table rendering, square Info/Story examples, page buttons, index and static mode worked. Initial viewport-centering issue was corrected before publication.
- Web clipboard check: Codex output begins `With $fubon-slide skill,`, fixed instructions are English, Korean input remains intact, and HTML output references the bundled renderer.

These checks cover the bundled HTML renderer and prompt composer. No claim is made that every possible user text length fits every layout, that a source claim is true, or that image/PPTX generation tools are available in every host. Those output routes require their actual host tools and visual review.

The optional GitHub Actions example is in `docs/ci-example.yml`. It is not enabled: the connected GitHub token did not include the `workflow` permission. Local tests and independent/browser checks were run before release. A maintainer with appropriate permissions may copy the example to `.github/workflows/validate.yml`.
