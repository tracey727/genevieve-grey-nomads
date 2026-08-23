const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clampNonNegative = (value) => Math.max(0, toNumber(value));
const money = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function estimateRoadKm(straightLineKm, roadFactor = 1.18) {
  const km = clampNonNegative(straightLineKm);
  if (!km) return 0;
  return Math.round((km * roadFactor) / 10) * 10;
}

export function haversineKm(a, b) {
  if (!a || !b) return 0;
  const rad = (deg) => (deg * Math.PI) / 180;
  const R = 6371.0088;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Australia-wide planning anchors. These are fallback points only; the live road
// provider can geocode any Australian town/address entered in the planner.
export const AUSTRALIAN_POINTS = Object.freeze({
  // Queensland
  'Gold Coast, QLD': { lat: -28.0167, lon: 153.4 },
  'Brisbane, QLD': { lat: -27.4698, lon: 153.0251 },
  'Sunshine Coast, QLD': { lat: -26.65, lon: 153.0667 },
  'Toowoomba, QLD': { lat: -27.5598, lon: 151.9507 },
  'Hervey Bay, QLD': { lat: -25.2882, lon: 152.7694 },
  'Bundaberg, QLD': { lat: -24.8661, lon: 152.3489 },
  'Rockhampton, QLD': { lat: -23.3791, lon: 150.5100 },
  'Mackay, QLD': { lat: -21.1411, lon: 149.1860 },
  'Townsville, QLD': { lat: -19.2589, lon: 146.8169 },
  'Cairns, QLD': { lat: -16.9186, lon: 145.7781 },
  'Roma, QLD': { lat: -26.5739, lon: 148.7908 },
  'Longreach, QLD': { lat: -23.4400, lon: 144.2500 },
  'Mount Isa, QLD': { lat: -20.7256, lon: 139.4927 },

  // New South Wales
  'Sydney, NSW': { lat: -33.8688, lon: 151.2093 },
  'Newcastle, NSW': { lat: -32.9283, lon: 151.7817 },
  'Wollongong, NSW': { lat: -34.4278, lon: 150.8931 },
  'Coffs Harbour, NSW': { lat: -30.2963, lon: 153.1135 },
  'Port Macquarie, NSW': { lat: -31.4333, lon: 152.9000 },
  'Tamworth, NSW': { lat: -31.0927, lon: 150.9320 },
  'Dubbo, NSW': { lat: -32.2569, lon: 148.6011 },
  'Orange, NSW': { lat: -33.2839, lon: 149.1000 },
  'Wagga Wagga, NSW': { lat: -35.1082, lon: 147.3598 },
  'Albury, NSW': { lat: -36.0808, lon: 146.9165 },
  'Broken Hill, NSW': { lat: -31.9539, lon: 141.4539 },
  'Bourke, NSW': { lat: -30.0900, lon: 145.9400 },

  // Australian Capital Territory
  'Canberra, ACT': { lat: -35.2809, lon: 149.13 },

  // Victoria
  'Melbourne, VIC': { lat: -37.8136, lon: 144.9631 },
  'Geelong, VIC': { lat: -38.1499, lon: 144.3617 },
  'Ballarat, VIC': { lat: -37.5622, lon: 143.8503 },
  'Bendigo, VIC': { lat: -36.7570, lon: 144.2794 },
  'Shepparton, VIC': { lat: -36.3833, lon: 145.4000 },
  'Wangaratta, VIC': { lat: -36.3585, lon: 146.3175 },
  'Mildura, VIC': { lat: -34.2080, lon: 142.1246 },
  'Warrnambool, VIC': { lat: -38.3833, lon: 142.4833 },
  'Sale, VIC': { lat: -38.1000, lon: 147.0667 },

  // Tasmania
  'Hobart, TAS': { lat: -42.8821, lon: 147.3272 },
  'Launceston, TAS': { lat: -41.4332, lon: 147.1441 },
  'Devonport, TAS': { lat: -41.1769, lon: 146.3515 },
  'Burnie, TAS': { lat: -41.0525, lon: 145.9066 },
  'Strahan, TAS': { lat: -42.1510, lon: 145.3290 },

  // South Australia
  'Adelaide, SA': { lat: -34.9285, lon: 138.6007 },
  'Mount Gambier, SA': { lat: -37.8294, lon: 140.7828 },
  'Whyalla, SA': { lat: -33.0333, lon: 137.5833 },
  'Port Augusta, SA': { lat: -32.4925, lon: 137.7658 },
  'Port Lincoln, SA': { lat: -34.7286, lon: 135.8744 },
  'Ceduna, SA': { lat: -32.1266, lon: 133.6763 },
  'Coober Pedy, SA': { lat: -29.0135, lon: 134.7544 },

  // Western Australia
  'Perth, WA': { lat: -31.9523, lon: 115.8613 },
  'Bunbury, WA': { lat: -33.3267, lon: 115.6369 },
  'Albany, WA': { lat: -35.0275, lon: 117.8837 },
  'Esperance, WA': { lat: -33.8608, lon: 121.8896 },
  'Kalgoorlie, WA': { lat: -30.7489, lon: 121.4658 },
  'Geraldton, WA': { lat: -28.7774, lon: 114.6149 },
  'Carnarvon, WA': { lat: -24.8807, lon: 113.6594 },
  'Exmouth, WA': { lat: -21.9444, lon: 114.1250 },
  'Karratha, WA': { lat: -20.7364, lon: 116.8463 },
  'Port Hedland, WA': { lat: -20.3107, lon: 118.6011 },
  'Broome, WA': { lat: -17.9614, lon: 122.2359 },
  'Kununurra, WA': { lat: -15.7783, lon: 128.7421 },

  // Northern Territory
  'Darwin, NT': { lat: -12.4634, lon: 130.8456 },
  'Katherine, NT': { lat: -14.4652, lon: 132.2635 },
  'Tennant Creek, NT': { lat: -19.6497, lon: 134.1914 },
  'Alice Springs, NT': { lat: -23.6980, lon: 133.8807 },
  'Yulara, NT': { lat: -25.2406, lon: 130.9889 }
});

export function estimateBetweenPlaces(origin, destination) {
  const a = AUSTRALIAN_POINTS[origin];
  const b = AUSTRALIAN_POINTS[destination];
  if (!a || !b) return 0;
  return estimateRoadKm(haversineKm(a, b));
}

export function calculateTripBudget(input = {}) {
  const oneWayDistanceKm = clampNonNegative(input.routeDistanceKm);
  const returnMultiplier = input.returnTrip ? 2 : 1;
  const totalDistanceKm = oneWayDistanceKm * returnMultiplier;
  const fuelConsumptionL100 = Math.max(1, clampNonNegative(input.fuelConsumptionL100) || 10);
  const fuelPricePerL = clampNonNegative(input.fuelPricePerL);
  const fuelLitres = (totalDistanceKm * fuelConsumptionL100) / 100;
  const fuelCost = money(fuelLitres * fuelPricePerL);

  const days = Math.max(1, Math.round(clampNonNegative(input.days) || 1));
  const dailyFood = clampNonNegative(input.dailyFood);
  const foodCost = money(days * dailyFood);
  const paidNights = Math.max(0, Math.round(clampNonNegative(input.paidNights)));
  const avgPaidNight = clampNonNegative(input.avgPaidNight);
  const accommodationCost = money(paidNights * avgPaidNight);
  const petCost = money(clampNonNegative(input.petBudget));
  const feesCost = money(clampNonNegative(input.feesBudget));
  const otherCost = money(clampNonNegative(input.otherBudget));
  const emergencyReserve = money(clampNonNegative(input.emergencyReserve));
  const totalBudget = money(clampNonNegative(input.totalBudget));

  const spendBeforeReserve = money(fuelCost + foodCost + accommodationCost + petCost + feesCost + otherCost);
  const committed = money(spendBeforeReserve + emergencyReserve);
  const available = money(totalBudget - committed);
  const contingencyTarget = money(Math.max(100, totalBudget * 0.1));
  const status = available < 0 ? 'over-budget' : available < contingencyTarget ? 'tight' : 'on-budget';

  const tankLitres = clampNonNegative(input.tankLitres);
  const reserveLitres = Math.min(tankLitres, clampNonNegative(input.fuelReserveLitres));
  const usableFuel = Math.max(0, tankLitres - reserveLitres);
  const safeRangeKm = usableFuel ? Math.floor((usableFuel / fuelConsumptionL100) * 100) : 0;
  const refuelByKm = safeRangeKm ? Math.floor(safeRangeKm * 0.75) : 0;
  const minimumFuelStops = refuelByKm && totalDistanceKm ? Math.max(0, Math.ceil(totalDistanceKm / refuelByKm) - 1) : 0;

  const maxDailyKm = Math.max(1, clampNonNegative(input.maxDailyKm) || 450);
  const drivingDays = totalDistanceKm ? Math.max(1, Math.ceil(totalDistanceKm / maxDailyKm)) : 0;
  const overnightStops = Math.max(0, drivingDays - 1);

  const savings = [];
  if (paidNights > 0 && accommodationCost > 0) savings.push({ label: 'Use free or lower-cost camping where legal and suitable', potential: accommodationCost });
  if (dailyFood > 20) savings.push({ label: 'Reduce the daily food allowance by $10', potential: money(days * 10) });
  if (emergencyReserve < Math.max(150, totalBudget * 0.08)) savings.push({ label: 'Increase the protected emergency reserve before departure', potential: 0, safety: true });

  return { totalBudget, totalDistanceKm: Math.round(totalDistanceKm), fuelLitres: money(fuelLitres), fuelCost, foodCost, accommodationCost, petCost, feesCost, otherCost, emergencyReserve, spendBeforeReserve, committed, available, status, safeRangeKm, refuelByKm, minimumFuelStops, drivingDays, overnightStops, savings };
}
