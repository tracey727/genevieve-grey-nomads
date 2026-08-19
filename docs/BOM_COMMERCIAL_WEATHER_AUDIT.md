# BOM national weather commercial-use audit

GENEVIEVE Grey Nomads is intended to offer paid subscriptions, so its production weather integration is commercial use.

Bureau audit finding:
- BOM anonymous automated web/FTP forecast, warning and observation feeds are free but not for commercial use.
- BOM offers registered/paid real-time data services and data licence agreements for broader/commercial use.
- GENEVIEVE must not enable the weather button as live using anonymous FTP/FWO or personal/non-commercial RSS feeds.

Production activation requires:
1. A BOM registered/licensed service suitable for GENEVIEVE's commercial use.
2. The licensed endpoint and credentials stored server-side in Vercel.
3. `BOM_DATA_SERVICE_MODE=registered-commercial`.
4. `BOM_COMMERCIAL_LICENCE_CONFIRMED=true` only after the licence/service terms are actually confirmed.
5. Australia-wide location response contract validated.
6. Timeout/outage/no-result paths tested as `live:false`.
7. No precise device location persistence.
8. CI, Vercel preview and production endpoint verification.

The endpoint explicitly blocks known anonymous BOM feed URL patterns from commercial live activation.
