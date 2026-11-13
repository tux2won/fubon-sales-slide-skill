# Website deployment

Canonical source: `web/` in this repository. The same files, including supplied fonts and logos, must be deployed without substituting older UI files.

```text
node scripts/export-web.mjs --out <static-directory>
node scripts/export-web.mjs --out <static-directory> --check-only
python scripts/package-web.py --out <artifact-directory>
```

The export command compares every source/output file by SHA-256. The packaging command creates a self-contained HTML with embedded fonts and logo, a source ZIP, and a SHA-256 manifest.

Existing hosted site: https://fubon-sales-slide-prompter.muddymangrove4.chatgpt.site/

UI version 1.2 source is prepared and tested. Updating the existing hosted Site is currently blocked by the Sites connector response `sites_git_client_upgrade_required`: “Sites Git is not yet enabled for this client. Use a hosted Work session, or try again with the latest Codex and Sites plugin after rollout.” The source export is therefore not evidence that the old production URL has been updated. Reuse its existing project identity when the connection is restored; do not create a replacement Site as an access workaround. A different public hosting destination should follow the user's selected option.
