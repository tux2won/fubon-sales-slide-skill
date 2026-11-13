# Website deployment

## GitHub Pages (selected publication route)

The owner approved GitHub Pages as the replacement public address on 2026-11-13. Pages is configured to publish `main` at `/` with GitHub's branch publishing. The root `index.html` forwards visitors to `web/`, which is the canonical website source. `.nojekyll` keeps the published files unmodified, including the asset rights notice. No duplicate UI export or custom Actions workflow is required.

Public entry address: https://tux2won.github.io/fubon-sales-slide-skill/

Direct workspace address: https://tux2won.github.io/fubon-sales-slide-skill/web/

The publication is only complete after the Pages build succeeds and the live file check passes:

```text
node scripts/verify-pages.mjs
```

For future UI edits, change `web/`, commit and push to `main`, wait for **Actions → pages-build-deployment** to succeed, then run the same verification. Branch publishing automatically deploys each push to `main`. It does not update the old Sites address. The Pages deployment is GitHub-managed; the optional test workflow example in this repository is separate and is not enabled.

## Static exports and previous Sites address

Canonical source: `web/` in this repository. The same files, including supplied fonts and logos, must be deployed without substituting older UI files.

```text
node scripts/export-web.mjs --out <static-directory>
node scripts/export-web.mjs --out <static-directory> --check-only
python scripts/package-web.py --out <artifact-directory>
```

The export command compares every source/output file by SHA-256. The packaging command creates a self-contained HTML with embedded fonts and logo, a source ZIP, and a SHA-256 manifest.

Previous Sites address (older UI): https://fubon-sales-slide-prompter.muddymangrove4.chatgpt.site/

UI version 1.2 source is prepared and tested. The owner initially selected waiting for a compatible Codex/Sites update, then approved GitHub Pages after the existing publication path remained unavailable. The previous Sites address is retained as a historical address and still serves the older UI.

Rechecked on 2026-11-13: the Site is active and public. The earlier `sites_git_client_upgrade_required` response no longer occurs. The service now returns source access with `auth_mode: codex_auth`, but the installed Sites 1.1.6 workflow supports only `work_proxy` and `http_extra_header` and rejects the returned access with “Use the returned source repository access with its auth_mode, remote_url, and branch.” The desktop updater reports `up_to_date`; no newer compatible plugin was installed in this session.

The existing production URL still serves the prior UI. The source export and GitHub release are not evidence of a production update. Resume with a supported client/plugin that accepts the service's returned authentication mode, reuse the existing project identity and public audience, export the canonical `web/` files, verify their hashes, then push/save/deploy through Sites. Do not alter authentication modes or create a replacement Site to work around this incompatibility.
