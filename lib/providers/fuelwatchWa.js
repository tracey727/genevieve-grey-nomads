const FUELWATCH_RSS = 'https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS';

const PRODUCT_CODES = {
  ulp: '1',
  unleaded: '1',
  petrol: '1',
  premium: '2',
  pulp: '2',
  diesel: '4',
  lpg: '5',
  '98': '6',
  '98 ron': '6',
  e85: '10',
  'brand diesel': '11'
};

function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function parseItems(xml) {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return items.map((item) => {
    const price = Number(tag(item, 'price'));
    return {
      station: tag(item, 'trading-name') || tag(item, 'title'),
      brand: tag(item, 'brand'),
      address: tag(item, 'address'),
      suburb: tag(item, 'location'),
      phone: tag(item, 'phone'),
      latitude: Number(tag(item, 'latitude')) || null,
      longitude: Number(tag(item, 'longitude')) || null,
      priceCentsPerLitre: Number.isFinite(price) ? price : null
    };
  }).filter((item) => Number.isFinite(item.priceCentsPerLitre));
}

export async function getWaFuelWatchPrices({ suburb, fuelType = 'diesel' }) {
  const cleanSuburb = String(suburb || '').trim().slice(0, 80);
  if (!cleanSuburb) {
    return {
      ok: false,
      configured: true,
      live: false,
      provider: 'WA FuelWatch',
      message: 'WA FuelWatch requires a suburb or town before live prices can be checked.'
    };
  }

  const product = PRODUCT_CODES[String(fuelType).toLowerCase()] || PRODUCT_CODES.diesel;
  const url = new URL(FUELWATCH_RSS);
  url.searchParams.set('Product', product);
  url.searchParams.set('Suburb', cleanSuburb);
  url.searchParams.set('Surrounding', 'yes');
  url.searchParams.set('Day', 'today');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8' },
      cache: 'no-store',
      signal: controller.signal
    });
    if (!response.ok) {
      return { ok: false, configured: true, live: false, provider: 'WA FuelWatch', message: 'WA FuelWatch is temporarily unavailable.' };
    }
    const xml = await response.text();
    const prices = parseItems(xml);
    if (!prices.length) {
      return {
        ok: false,
        configured: true,
        live: false,
        provider: 'WA FuelWatch',
        message: `WA FuelWatch returned no current ${fuelType} prices for ${cleanSuburb}.`
      };
    }
    return {
      ok: true,
      configured: true,
      live: true,
      provider: 'WA FuelWatch',
      attribution: 'FuelWatch, Government of Western Australia',
      sourceUrl: 'https://www.fuelwatch.wa.gov.au/',
      fetchedAt: new Date().toISOString(),
      prices
    };
  } catch {
    return { ok: false, configured: true, live: false, provider: 'WA FuelWatch', message: 'WA FuelWatch could not be reached. No fuel price has been shown.' };
  } finally {
    clearTimeout(timeout);
  }
}
