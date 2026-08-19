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

export const AUSTRALIAN_POINTS = Object.freeze({
  'Gold Coast, QLD': { lat: -28.0167, lon: 153.4 },
  'Brisbane, QLD': { lat: -27.4698, lon: 153.0251 },
  'Cairns, QLD': { lat: -16.9186, lon: 145.7781 },
  'Townsville, QLD': { lat: -19.2589, lon: 146.8169 },
  'Sydney, NSW': { lat: -33.8688, lon: 151.2093 },
  'Canberra, ACT': { lat: -35.2809, lon: 149.13 },
  'Melbourne, VIC': { lat: -37.8136, lon: 144.9631 },
  'Adelaide, SA': { lat: -34.9285, lon: 138.6007 },
  'Port Augusta, SA': { lat: -32.4925, lon: 137.7658 },
  'Ceduna, SA': { lat: -32.1266, lon: 133.6763 },
  'Perth, WA': { lat: -31.9523, lon: 115.8613 },
  'Kalgoorlie, WA': { lat: -30.7489, lon: 121.4658 },
  'Esperance, WA': { lat: -33.8608, lon: 121.8896 },
  'Albany, WA': { lat: -35.0275, lon: 117.8837 },
  'Geraldton, WA': { lat: -28.7774, lon: 114.6149 },
  'Broome, WA': { lat: -17.9614, lon: 122.2359 },
  'Darwin, NT': { lat: -12.4634, lon: 130.8456 },
  'Alice Springs, NT': { lat: -23.698, lon: 133.8807 }
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
  const emergencyReserve = money(clampNonNegative(input.emergencyReserve));
  const totalBudget = money(clampNonNegative(input.totalBudget));

  const spendBeforeReserve = money(fuelCost + foodCost + accommodationCost + petCost + feesCost);
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

  return { totalBudget, totalDistanceKm: Math.round(totalDistanceKm), fuelLitres: money(fuelLitres), fuelCost, foodCost, accommodationCost, petCost, feesCost, emergencyReserve, spendBeforeReserve, committed, available, status, safeRangeKm, refuelByKm, minimumFuelStops, drivingDays, overnightStops, savings };
}
