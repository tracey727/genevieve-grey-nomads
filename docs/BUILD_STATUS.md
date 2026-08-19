# Build status — 19 August 2026

## Completed
- Standalone Grey Nomads repository: `tracey727/genevieve-grey-nomads`.
- Official GENEVIEVE tree/infinity/roots logo integrated into the Home brand header.
- Home, Plan Trip, Around Me, Safety and My Trip routes linked.
- Budget-safe journey engine and protected emergency reserve.
- Browser-only current-location search behaviour.
- Neon project created: `bitter-art-35680057`.
- Neon main branch: `br-flat-mouse-auo0cs78`.
- V001 schema applied and audited.
- 5,000-row database scale test completed and cleaned up.
- Indexed bounded newest-trip query tested during the audit dataset.
- 100,000 budget calculations completed without an exception in the engine stress test.
- Deterministic budget-engine tests and source audit included in GitHub CI.
- Vercel project created: `genevieve-grey-nomads`.
- `DATABASE_URL` configured in Vercel as a sensitive environment variable for the new Grey Nomads project.
- Production redeploy triggered after the Neon environment update.

## Current deployment gate
- Wait for the fresh Vercel deployment created from this commit to reach Ready.
- Verify `/api/health` returns database `connected`.
- Verify Home, Plan, Around Me, Safety and My Trip on the deployed URL.

## Not claimed live
BOM/weather, road closures, tides/coastal data, live fuel prices, campground availability, council rules and route-provider data are not labelled live until verified provider integrations and freshness/failure audits are added.
