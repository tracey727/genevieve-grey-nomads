# Northern Territory MyFuel NT audit

MyFuel NT is the Northern Territory Government's real-time consumer fuel-price service.

Current audit finding:
- The consumer service is real-time.
- The NT Open Data portal publishes historical daily/monthly MyFuel NT datasets under Creative Commons Attribution.
- GENEVIEVE has not verified an approved current third-party real-time API contract suitable for a commercial subscription app.
- Historical open-data spreadsheets must not be represented as current/live fuel prices.
- GENEVIEVE must not scrape the MyFuel NT consumer website.

Until approved third-party real-time access is documented, the provider-specific route returns `live:false`, `scrapingUsed:false`, and directs the traveller to the official MyFuel NT service or Maps.
