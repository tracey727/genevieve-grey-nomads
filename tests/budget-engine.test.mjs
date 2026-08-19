import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTripBudget, estimateBetweenPlaces } from '../lib/budget-engine.mjs';

test('Gold Coast to Perth gets a non-zero planning estimate', () => {
  const km = estimateBetweenPlaces('Gold Coast, QLD', 'Perth, WA');
  assert.ok(km > 3000);
  assert.ok(km < 5000);
});

test('budget engine protects emergency reserve from available cash', () => {
  const result = calculateTripBudget({ totalBudget: 2000, routeDistanceKm: 4000, fuelConsumptionL100: 10, fuelPricePerL: 2, days: 8, dailyFood: 20, emergencyReserve: 250 });
  assert.equal(result.fuelCost, 800);
  assert.equal(result.foodCost, 160);
  assert.equal(result.available, 790);
  assert.equal(result.status, 'on-budget');
});

test('over-budget result is explicit', () => {
  const result = calculateTripBudget({ totalBudget: 500, routeDistanceKm: 4000, fuelConsumptionL100: 15, fuelPricePerL: 2.2, emergencyReserve: 100 });
  assert.equal(result.status, 'over-budget');
  assert.ok(result.available < 0);
});

test('fuel stop advice uses reserve and a conservative refuel point', () => {
  const result = calculateTripBudget({ routeDistanceKm: 1000, fuelConsumptionL100: 10, tankLitres: 60, fuelReserveLitres: 10 });
  assert.equal(result.safeRangeKm, 500);
  assert.equal(result.refuelByKm, 375);
  assert.equal(result.minimumFuelStops, 2);
});

test('return trip doubles planned distance', () => {
  const result = calculateTripBudget({ routeDistanceKm: 1000, returnTrip: true });
  assert.equal(result.totalDistanceKm, 2000);
});
