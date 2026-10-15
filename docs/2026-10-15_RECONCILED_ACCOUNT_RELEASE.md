# Reconciled account release — 15 October 2026, Brisbane

## Source reconciliation

Canonical main: b53e84628fb2050c3385dbd970854fbf33d2778e. Cloudflare production branch: agent/cloudflare-workers-deploy at 6203c61514233328395a5f01d299fa8e98d0291b. Common ancestor: 6391d54c59bae7eddf22847361a23293f261221c.

The live branch diverged from main and did not include account routes or V003. All nine net changes on the live branch are already present in main or superseded there: deployment config, dependency versions, product-specific health, provider regression tests and safeguards. The CSS-only difference is a rule-order adjustment; main retains the same rule and the newer approved home styles. The audit differences retain all live-provider guards and add account/offline gates on main.

Use a merge commit with both histories as parents. After exact-head CI passes and it is merged into main, fast-forward the configured production branch to the reviewed commit. Do not force-reset, remove historical commits or silently change the Cloudflare production branch setting.

## Account and trip changes

The existing signed-in account UI and routes are included. Trips now derive ownership from verified account identity when signed in and are portable across devices. Signed-out device lookups/deletes exclude account-owned rows after migration. Invalid authentication never falls back to device access. Existing device storage is retained while the additive schema is absent. JSON request size is bounded even without Content-Length. Tokens reject extra segments and expiration at the current second.

## Database gate

GET /api/readiness queries only Neon identity and schema/permission metadata. It reports fixed labels for the two reviewed Grey Nomads targets, exact-branch verification, account-schema presence and runtime permission checks. It returns no URL, password, role name or customer records. It never performs migrations.

Only apply the existing V003_accounts.sql to the target/branch observed from the deployed app. Test the migration on an isolated Neon branch first. Preserve existing journeys and billing records. Full authenticated workflow acceptance remains separate from these read-only facts. Billing activation and external fuel/weather authority are unchanged.
