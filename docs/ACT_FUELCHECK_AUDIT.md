# ACT FuelCheck audit

The ACT Government confirms FuelCheck provides real-time consumer fuel prices across Canberra/ACT.

Current developer-access finding:
- FuelCheck consumer coverage includes the ACT.
- API.NSW's currently published Fuel API v2 developer documentation explicitly documents NSW and Tasmania support.
- GENEVIEVE has not found current official developer documentation confirming ACT data is available through those API endpoints.
- GENEVIEVE must not assume undocumented ACT API coverage or scrape the consumer service.

Until API.NSW/ACT Government confirms an approved developer method, the ACT provider route returns `live:false`, `scrapingUsed:false`, and directs users to official FuelCheck or Maps.
