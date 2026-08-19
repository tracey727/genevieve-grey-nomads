# NSW/Tasmania FuelCheck activation stage

This stage adds the credential-gated FuelCheck adapter but does not expose FuelCheck as live to normal users.

Activation requires all four server-only values to be present in Vercel and verified against the current official API.NSW FuelCheck documentation/account:
- `NSW_FUELCHECK_CLIENT_ID`
- `NSW_FUELCHECK_CLIENT_SECRET`
- `NSW_FUELCHECK_TOKEN_URL`
- `NSW_FUELCHECK_NEARBY_URL`

Audit sequence before user-facing enablement:
1. Obtain official API.NSW credentials in the GENEVIEVE account.
2. Store the four values server-side in Vercel; never expose them with `NEXT_PUBLIC_`.
3. Call the provider-specific audit route with NSW coordinates and verify a real current fuel price response.
4. Repeat with Tasmania coordinates.
5. Verify bad credentials fail closed and do not leak secrets.
6. Verify provider outage/timeout returns `live: false` and no invented price.
7. Verify precise device coordinates are not persisted by this adapter.
8. Pass repository CI and Vercel preview build.
9. Only then add automatic state routing/user-facing live display.
