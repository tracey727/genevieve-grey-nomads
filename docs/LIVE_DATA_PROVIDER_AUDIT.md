# GENEVIEVE — The Budget Travels — official live-data provider audit

## Provider activation rule
A provider may be shown as live only after: official source/terms verified; commercial-use rights confirmed; credentials stored server-side where required; response contract normalised; timeout/failure path tested; no precise device location persisted; CI and Cloudflare build pass; production endpoint is verified after deployment.

## Fuel providers

### Western Australia — FuelWatch
- Official WA Government FuelWatch RSS feed.
- FuelWatch states the data may be used in a webpage or app when FuelWatch is acknowledged as the source and linked back.
- No API secret required.
- Adapter added at `lib/providers/fuelwatchWa.js`.
- Adapter requires a town/suburb query and fails closed when no result is returned.
- User-facing automatic switch remains off until the app has a reliable locality resolver or a simple locality input.
- Repository CI passed on the provider-adapter branch before merge; provider-specific Cloudflare response verification remains the final gate.

### NSW + Tasmania — FuelCheck v2
- Official API.NSW Fuel API.
- v2 supports NSW and Tasmania.
- OAuth consumer key/secret required; token lasts approximately 12 hours.
- Do not use the public portal trial credentials for production.
- Production activation blocked on the GENEVIEVE API.NSW account credentials and request-contract verification.

### Queensland — Fuel Prices Queensland
- Official Queensland data consumer/developer API.
- Developer/data consumer registration required via Fuel Prices Queensland.
- Production activation blocked on issued API documentation/credentials.

### Victoria — Servo Saver Public API
- Official Service Victoria / DataVic API.
- Authorised API access required.
- Public Open Data fuel price output is explicitly 24-hour delayed and must never be labelled real-time/live.
- Production activation blocked on authorised API access and final display wording.

## Weather — Bureau of Meteorology
- BOM anonymous automated forecast/observation feeds are free but explicitly not for commercial use.
- GENEVIEVE subscriptions are commercial use, so production must use BOM Registered User Services / licensed real-time data with appropriate rights.
- The The Budget Travels weather endpoint remains fail-closed until licensed BOM service credentials and response contract are verified.

## Safety/privacy
- Provider credentials are server-only.
- The client must never receive API secrets.
- Location remains transient for the Around Me request and is not persisted by these provider adapters.
- Unavailable or unverified provider data never produces a fabricated price/weather value.
