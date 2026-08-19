# GENEVIEVE Grey Nomads — complete app audit

Date: 19 August 2026 (AEST)
Deployment path during this audit: Cloudflare Workers/OpenNext only.

## Audit rules
1. Preserve the premium deep-navy/gold GENEVIEVE identity and approved high-quality Home composition.
2. Preserve all six Home actions in chronological order: Continue Journey → Plan Trip → Around Me → Safety → Budget Planner → My Trip.
3. Safety must remain free and independent of subscription state.
4. 000 must require a continuous three-second hold followed by a deliberate full slide before the telephone action is exposed.
5. Trip budgeting must protect the emergency reserve and must not recommend unsafe fuel-range stretching.
6. Location used by Around Me remains transient and is not persisted by the screen.
7. Unverified weather/fuel/road closure/tide/campground/council data must not be labelled live.
8. The app remains local-first if Neon or external providers are unavailable.
9. Cloudflare deployment files and PWA identity must remain present.
10. Checkout remains disabled until the payment/legal/provider launch gates pass.

## Screen completeness

### Home
- Premium navy/gold Home shell and double-gold framing present.
- Official GENEVIEVE brand header and slogan present.
- Six numbered primary actions present and linked.
- Journey, weather status, journey distance and budget snapshot present.
- Emergency/Safety entry explicitly says it opens guarded emergency controls.
- Optional local traveller first name can personalise the greeting without cloud persistence.

### Plan Trip / Budget Planner
- Start/destination, road distance, return trip, travel days and max daily distance present.
- Total budget, protected emergency reserve, food, camping, pet and toll/fees allowances present.
- Fuel consumption, planning price, tank capacity and fuel reserve present.
- Conservative refuel-by guidance and no unsafe fuel stretching rule present.
- Local save remains available if cloud storage fails.

### Around Me
- Basic nearby searches: fuel, toilets, food, caravan parks, free/rest areas, hospitals, veterinary clinics, emergency vets, dog parks and drinking water.
- Verified-live gates: fuel prices and BOM weather.
- Agreed manual travel checks now present: road closures, tides, campground availability and council rules.
- Manual checks are explicitly not represented as live until verified provider integrations are approved.

### Safety
- Guarded 000 control present.
- Hospital, police and emergency-vet search paths preserved.
- Safety remains independent of subscription/payment status.

### My Trip
- Current device plan remains local-first.
- Cloud trip save/load remains available when Neon is configured.
- Free local traveller settings added: first name and preferred fuel type.
- Membership is kept separate from journey and safety controls.

### Membership
- Free/Plus boundary now stated visibly.
- Free remains $0 with guarded emergency, essential safety, basic Around Me, one current trip/basic overview, basic settings and PWA; no ads.
- Agreed Plus launch pricing is documented as A$9.99/month or A$99/year.
- Plus describes enhanced planning, multiple saved trips, enhanced Around Me and verified live travel data when approved providers are connected.
- Checkout remains disabled until launch gates pass.

### PWA
- `GENEVIEVE Grey Nomads` manifest, `en-AU`, standalone display and app icon endpoint preserved.

## Current production configuration gaps found by live Cloudflare smoke audit
- Cloudflare `/api/health`: database currently `not-configured`; Neon cloud-trip storage therefore cannot operate until `DATABASE_URL` is added to Cloudflare.
- Live road-distance provider is currently not configured; planner safely falls back to the conservative estimate.
- National live fuel provider is currently fail-closed except provider-specific adapters that have separately passed their own tests.
- BOM commercial weather remains fail-closed until licensed commercial credentials are configured.

These are configuration/provider gates, not broken application code. They must remain explicit rather than being hidden or represented as live.
