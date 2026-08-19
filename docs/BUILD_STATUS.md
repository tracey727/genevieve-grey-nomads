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

## Next deployment gate
- Confirm GitHub CI passes on the full staged build.
- Create/import a new Vercel project from this repository only.
- Add `DATABASE_URL` to the new Vercel project as a server-only environment variable; the real credential is deliberately excluded from source.
- Verify `/api/health`, Home, Plan, Around Me, Safety and My Trip on the deployed URL before calling it live.

## Not claimed live
BOM/weather, road closures, tides/coastal data, live fuel prices, campground availability, council rules and route-provider data are not labelled live until verified provider integrations and freshness/failure audits are added.
