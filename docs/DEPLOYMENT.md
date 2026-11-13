# Website deployment

Canonical source: `web/` in this repository. The same files, including supplied fonts and logos, must be deployed without substituting older UI files.

```text
node scripts/export-web.mjs --out <static-directory>
node scripts/export-web.mjs --out <static-directory> --check-only
python scripts/package-web.py --out <artifact-directory>
```

The export command compares every source/output file by SHA-256. The packaging command creates a self-contained HTML with embedded fonts and logo, a source ZIP, and a SHA-256 manifest.

Existing hosted site: https://fubon-sales-slide-prompter.muddymangrove4.chatgpt.site/

UI version 1.2 source is prepared and tested. The owner selected updating the existing Sites URL after a compatible Codex/Sites update; publishing to a replacement host is not selected.

Rechecked on 2026-11-13: the Site is active and public. The earlier `sites_git_client_upgrade_required` response no longer occurs. The service now returns source access with `auth_mode: codex_auth`, but the installed Sites 1.1.6 workflow supports only `work_proxy` and `http_extra_header` and rejects the returned access with “Use the returned source repository access with its auth_mode, remote_url, and branch.” The desktop updater reports `up_to_date`; no newer compatible plugin was installed in this session.

The existing production URL still serves the prior UI. The source export and GitHub release are not evidence of a production update. Resume with a supported client/plugin that accepts the service's returned authentication mode, reuse the existing project identity and public audience, export the canonical `web/` files, verify their hashes, then push/save/deploy through Sites. Do not alter authentication modes or create a replacement Site to work around this incompatibility.
