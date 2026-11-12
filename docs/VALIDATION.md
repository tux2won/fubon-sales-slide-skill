# Validation record

Validated on Windows with Node.js 24.22.1. The package requires Node.js 20+ for its own renderer; the optional third-party skills CLI may have a newer Node requirement.

- Automated tests: 17 behavior tests, including all S01–S22 render paths, three styles, source IDs and numeric bases, real output files, authored-artifact preservation, scene assets, English instructions, Korean user-copy preservation, Codex/ChatGPT routing, and Windows UTF-8 BOM input.
- Skill-creator frontmatter/scaffold validation passed.
- Independent consumer forward test: a four-page Korean square Story deck was created from the skill without an intended-answer fixture.
- Independent follow-up: 44 checks confirmed authored artifacts, exact prompt metadata, scene-4x3 and scene-portrait assets; the discovered UTF-8 BOM issue was fixed and given a regression test.
- Browser review: all six classroom slides fit their content/footer zones; table rendering, square Info/Story examples, page buttons, index and static mode worked. Initial viewport-centering issue was corrected before publication.
- Web clipboard check: Codex output begins `With $fubon-slide skill,`, fixed instructions are English, Korean input remains intact, and HTML output references the bundled renderer.

These checks cover the bundled HTML renderer and prompt composer. No claim is made that every possible user text length fits every layout, that a source claim is true, or that image/PPTX generation tools are available in every host. Those output routes require their actual host tools and visual review.

The optional GitHub Actions example is in `docs/ci-example.yml`. It is not enabled: the connected GitHub token did not include the `workflow` permission. Local tests and independent/browser checks were run before release. A maintainer with appropriate permissions may copy the example to `.github/workflows/validate.yml`.
