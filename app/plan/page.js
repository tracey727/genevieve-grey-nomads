'use client';

import { useMemo, useState } from 'react';
import Shell from '../../components/Shell';
import { AUSTRALIAN_POINTS, calculateTripBudget, estimateBetweenPlaces } from '../../lib/budget-engine.mjs';

const cityNames = Object.keys(AUSTRALIAN_POINTS);
const initial = {
  origin: 'Gold Coast, QLD', destination: 'Perth, WA', totalBudget: 2000, days: 10,
  routeDistanceKm: estimateBetweenPlaces('Gold Coast, QLD', 'Perth, WA'), fuelConsumptionL100: 12,
  fuelPricePerL: 2.0, tankLitres: 80, fuelReserveLitres: 15, maxDailyKm: 450, dailyFood: 25,
  paidNights: 0, avgPaidNight: 45, petBudget: 50, feesBudget: 50, otherBudget: 0, emergencyReserve: 250, returnTrip: false
};

export default function PlanTripPage() {
  const [form, setForm] = useState(initial);
  const result = useMemo(() => calculateTripBudget(form), [form]);
  const [saved, setSaved] = useState('');
  const [routeStatus, setRouteStatus] = useState('Planning estimate shown. You can enter any Australian town, suburb or address.');
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const estimateDistance = async () => {
    const origin = String(form.origin || '').trim();
    const destination = String(form.destination || '').trim();
    if (!origin || !destination) {
      setRouteStatus('Enter both a start and destination anywhere in Australia.');
      return;
    }

    const fallback = estimateBetweenPlaces(origin, destination);
    setRouteStatus('Checking the Australian road route…');
    try {
      const response = await fetch('/api/route-distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination })
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.ok && Number.isFinite(Number(payload.roadDistanceKm))) {
        update('routeDistanceKm', Number(payload.roadDistanceKm));
        setRouteStatus(`Road distance checked: ${Number(payload.roadDistanceKm).toLocaleString('en-AU')} km. ${payload.attribution || ''}`.trim());
        return;
      }
      if (fallback) {
        update('routeDistanceKm', fallback);
        setRouteStatus('Live road distance is unavailable, so GENEVIEVE used its Australia-wide planning anchor estimate. Confirm the route in Maps before departure.');
      } else {
        setRouteStatus('Live road distance is unavailable for this town pair. Enter the route distance shown by your maps service, or use “Confirm route in Maps”.');
      }
    } catch {
      if (fallback) {
        update('routeDistanceKm', fallback);
        setRouteStatus('Live road distance is unavailable, so GENEVIEVE used its Australia-wide planning anchor estimate. Confirm the route in Maps before departure.');
      } else {
        setRouteStatus('Live road distance could not be reached. Enter the route distance shown by your maps service, or use “Confirm route in Maps”.');
      }
    }
  };

  const saveLocal = () => {
    try { localStorage.setItem('genevieve:last-plan', JSON.stringify({ ...form, result })); setSaved('Saved on this device. Open My Trip to save it to your private trip store.'); }
    catch { setSaved('This browser could not save locally. Your calculation is still visible on this screen.'); }
  };

  const clearPlan = () => {
    if (!window.confirm('Clear this journey and start again? Any device-saved copy of this plan will be removed.')) return;
    try { localStorage.removeItem('genevieve:last-plan'); } catch {}
    setForm(initial);
    setRouteStatus('Journey cleared. Start again by changing the trip details above.');
    setSaved('This device plan has been cleared. Saved journeys in My Trip can be deleted there.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mapsHref = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(form.origin)}&destination=${encodeURIComponent(form.destination)}`;

  return (
    <Shell current="Plan">
      <section className="page-heading"><p className="eyebrow">Budget-safe journey</p><h2>Plan the trip around your money</h2><p>Plan between any Australian town, suburb or address. Safety reserves are protected rather than treated as spending money.</p></section>
      <datalist id="australian-planning-places">{cityNames.map((c) => <option key={c} value={c} />)}</datalist>
      <form className="planner-grid" onSubmit={(e) => e.preventDefault()}>
        <section className="panel form-panel">
          <h3>1. Journey</h3>
          <label>Start<input list="australian-planning-places" value={form.origin} onChange={(e) => update('origin', e.target.value)} placeholder="Town, suburb or address, Australia" /></label>
          <label>Destination<input list="australian-planning-places" value={form.destination} onChange={(e) => update('destination', e.target.value)} placeholder="Town, suburb or address, Australia" /></label>
          <div className="inline-actions"><button type="button" className="secondary-button" onClick={estimateDistance}>Check road distance</button><a className="text-link" href={mapsHref} target="_blank" rel="noreferrer">Confirm route in Maps ↗</a></div>
          <p className="form-message" role="status">{routeStatus}</p>
          <label>Route distance (km)<input inputMode="decimal" type="number" min="0" value={form.routeDistanceKm} onChange={(e) => update('routeDistanceKm', e.target.value)} /><small>Planning value. GENEVIEVE uses a verified Australia-only road calculation when available and otherwise keeps a conservative fallback or lets you enter the map distance.</small></label>
          <label className="check-row"><input type="checkbox" checked={form.returnTrip} onChange={(e) => update('returnTrip', e.target.checked)} /> Return trip</label>
          <label>Travel days<input type="number" min="1" value={form.days} onChange={(e) => update('days', e.target.value)} /></label>
          <label>Maximum driving per day (km)<input type="number" min="1" value={form.maxDailyKm} onChange={(e) => update('maxDailyKm', e.target.value)} /></label>
        </section>
        <section className="panel form-panel" id="budget">
          <h3>2. Budget</h3>
          <label>Total trip budget ($AUD)<input type="number" min="0" step="10" value={form.totalBudget} onChange={(e) => update('totalBudget', e.target.value)} /></label>
          <label>Emergency reserve — protected ($)<input type="number" min="0" step="10" value={form.emergencyReserve} onChange={(e) => update('emergencyReserve', e.target.value)} /></label>
          <label>Food per day ($)<input type="number" min="0" step="1" value={form.dailyFood} onChange={(e) => update('dailyFood', e.target.value)} /></label>
          <label>Paid camping nights<input type="number" min="0" value={form.paidNights} onChange={(e) => update('paidNights', e.target.value)} /></label>
          <label>Average paid night ($)<input type="number" min="0" value={form.avgPaidNight} onChange={(e) => update('avgPaidNight', e.target.value)} /></label>
          <label>Pet allowance ($)<input type="number" min="0" value={form.petBudget} onChange={(e) => update('petBudget', e.target.value)} /></label>
          <label>Tolls / fees allowance ($)<input type="number" min="0" value={form.feesBudget} onChange={(e) => update('feesBudget', e.target.value)} /></label>
          <label>Other planned expenses ($)<input type="number" min="0" value={form.otherBudget} onChange={(e) => update('otherBudget', e.target.value)} /></label>
        </section>
        <section className="panel form-panel">
          <h3>3. Fuel safety</h3>
          <label>Consumption while travelling (L/100 km)<input type="number" min="1" step="0.1" value={form.fuelConsumptionL100} onChange={(e) => update('fuelConsumptionL100', e.target.value)} /></label>
          <label>Planning fuel price ($/L)<input type="number" min="0" step="0.01" value={form.fuelPricePerL} onChange={(e) => update('fuelPricePerL', e.target.value)} /></label>
          <label>Tank capacity (L)<input type="number" min="0" step="1" value={form.tankLitres} onChange={(e) => update('tankLitres', e.target.value)} /></label>
          <label>Fuel reserve kept in tank (L)<input type="number" min="0" step="1" value={form.fuelReserveLitres} onChange={(e) => update('fuelReserveLitres', e.target.value)} /></label>
          <div className="safety-note">GENEVIEVE does not recommend stretching fuel range simply to save money. The planner uses a conservative refuel-by distance when tank details are provided.</div>
        </section>
      </form>
      <section className={`panel result-panel ${result.status}`}>
        <div className="result-title"><div><p className="eyebrow">Plan result</p><h3>{result.status.replace('-', ' ')}</h3></div><strong className="result-balance">${result.available.toLocaleString('en-AU')}</strong></div>
        <div className="metric-grid">
          <div><small>Total distance</small><strong>{result.totalDistanceKm.toLocaleString('en-AU')} km</strong></div><div><small>Fuel estimate</small><strong>${result.fuelCost.toLocaleString('en-AU')}</strong></div><div><small>Food</small><strong>${result.foodCost.toLocaleString('en-AU')}</strong></div><div><small>Camping</small><strong>${result.accommodationCost.toLocaleString('en-AU')}</strong></div><div><small>Other expenses</small><strong>${result.otherCost.toLocaleString('en-AU')}</strong></div><div><small>Protected reserve</small><strong>${result.emergencyReserve.toLocaleString('en-AU')}</strong></div><div><small>Driving days needed</small><strong>{result.drivingDays || '—'}</strong></div><div><small>Refuel by</small><strong>{result.refuelByKm ? `${result.refuelByKm} km` : 'Add tank details'}</strong></div><div><small>Minimum fuel stops</small><strong>{result.minimumFuelStops}</strong></div>
        </div>
        {result.savings.length > 0 && <div className="saving-box"><strong>Options</strong>{result.savings.map((s) => <p key={s.label}>{s.safety ? 'Safety: ' : s.potential ? `Potential $${s.potential}: ` : ''}{s.label}</p>)}</div>}
        <div className="inline-actions"><button type="button" className="primary-button" onClick={saveLocal}>Keep this journey</button><button type="button" className="danger-button" onClick={clearPlan}>Clear this plan</button></div>{saved && <p className="form-message" role="status">{saved}</p>}
      </section>
    </Shell>
  );
}
