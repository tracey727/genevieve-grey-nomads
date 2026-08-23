'use client';

import { useState } from 'react';
import Shell from '../../components/Shell';
import { AUSTRALIAN_JURISDICTION_OPTIONS, inferAustralianJurisdiction } from '../../lib/australia-coverage.mjs';

const categories = [
  ['Fuel', 'fuel station'], ['Toilets', 'public toilets'], ['Food', 'food'], ['Caravan parks', 'caravan park'],
  ['Free / rest areas', 'rest area'], ['Hospitals', 'hospital'], ['Veterinary clinics', 'veterinary clinic'],
  ['Emergency vets', 'emergency vet'], ['Dog parks', 'dog park'], ['Drinking water', 'drinking water']
];

export default function AroundPage() {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('Location is used on this screen only. GENEVIEVE does not store it here.');
  const [liveMessage, setLiveMessage] = useState('Live weather and fuel prices appear only when a verified provider is connected.');
  const [checking, setChecking] = useState('');
  const [jurisdiction, setJurisdiction] = useState('auto');
  const [fuelTown, setFuelTown] = useState('');
  const [fuelType, setFuelType] = useState('diesel');

  const locate = () => {
    if (!navigator.geolocation) return setMessage('Location is not available in this browser.');
    setMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation = { lat: coords.latitude, lon: coords.longitude };
        setLocation(nextLocation);
        const inferred = inferAustralianJurisdiction(nextLocation.lat, nextLocation.lon);
        if (jurisdiction === 'auto' && inferred?.fuelProvider) setJurisdiction(inferred.fuelProvider);
        setMessage(inferred
          ? `Location ready. ${inferred.name} was selected for state-based travel data; you can change it below if you are near a border.`
          : 'Location ready. Choose your state or territory below, then select what you need nearby.');
      },
      () => setMessage('Location permission was not available. You can still search manually in your maps app.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  const checkLive = async (kind) => {
    if (!location) return setLiveMessage('Tap “Use my location” first. Your coordinates are not stored by this screen.');
    setChecking(kind);
    setLiveMessage(kind === 'fuel' ? 'Checking verified fuel-price data…' : 'Checking verified BOM weather data…');
    try {
      const path = kind === 'fuel' ? '/api/fuel-prices' : '/api/weather';
      const params = new URLSearchParams({ lat: String(location.lat), lon: String(location.lon) });
      if (kind === 'fuel') {
        params.set('fuelType', fuelType);
        if (jurisdiction !== 'auto') params.set('provider', jurisdiction);
        if (fuelTown.trim()) params.set('suburb', fuelTown.trim());
      }
      const response = await fetch(`${path}?${params.toString()}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!payload.live) return setLiveMessage(payload.fallback || payload.message || 'Live data is not available yet.');

      if (kind === 'fuel') {
        const prices = Array.isArray(payload.data?.prices)
          ? payload.data.prices.filter(item => Number.isFinite(Number(item?.priceCentsPerLitre)))
          : Array.isArray(payload.prices)
            ? payload.prices.filter(item => Number.isFinite(Number(item?.priceCentsPerLitre)))
            : [];
        const cheapest = prices.sort((a, b) => Number(a.priceCentsPerLitre) - Number(b.priceCentsPerLitre))[0];
        setLiveMessage(cheapest
          ? `${payload.provider || 'Verified provider'} · ${cheapest.station || cheapest.brand || 'Nearby fuel'}: ${Number(cheapest.priceCentsPerLitre).toFixed(1)}¢/L ${cheapest.fuelType || fuelType}. Confirm at the pump.`
          : 'The fuel provider responded, but its price format has not yet passed the GENEVIEVE display check.');
      } else {
        const observation = payload.data?.observation;
        setLiveMessage(observation && Number.isFinite(Number(observation.temperatureC))
          ? `BOM observation: ${Number(observation.temperatureC).toFixed(1)}°C${observation.summary ? ` · ${observation.summary}` : ''}. Check current warnings before travel.`
          : 'The weather provider responded, but its observation format has not yet passed the GENEVIEVE display check.');
      }
    } catch {
      setLiveMessage('Live data could not be reached. No unverified price or weather value has been shown.');
    } finally {
      setChecking('');
    }
  };

  const hrefFor = (query) => {
    const q = encodeURIComponent(query);
    if (!location) return `https://www.google.com/maps/search/?api=1&query=${q}`;
    return `https://www.google.com/maps/search/?api=1&query=${q}&center=${location.lat},${location.lon}`;
  };

  return (
    <Shell current="Around Me">
      <section className="page-heading"><p className="eyebrow">Around me</p><h2>Find what matters, fast</h2><p>Australia-wide nearby search for travel essentials. Search results open in your maps service so the app does not pretend unverified business data is live.</p></section>
      <section className="panel locate-panel"><button className="primary-button" onClick={locate}>Use my location</button><p role="status">{message}</p></section>
      <section className="panel locate-panel" aria-label="Live travel data">
        <p className="eyebrow">Live travel data</p>
        <div className="planner-grid">
          <label>State / territory for fuel data
            <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)}>
              <option value="auto">Auto / national fallback</option>
              {AUSTRALIAN_JURISDICTION_OPTIONS.map((item) => <option key={item.key} value={item.fuelProvider}>{item.name}</option>)}
            </select>
          </label>
          <label>Fuel type
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="diesel">Diesel</option>
              <option value="unleaded">Unleaded</option>
              <option value="premium">Premium</option>
              <option value="98">98 RON</option>
              <option value="lpg">LPG</option>
            </select>
          </label>
          <label>Town / suburb <small>Required by WA FuelWatch; optional elsewhere.</small>
            <input value={fuelTown} onChange={(e) => setFuelTown(e.target.value)} placeholder="e.g. Geraldton" />
          </label>
        </div>
        <div className="inline-actions">
          <button className="secondary-button" disabled={Boolean(checking)} onClick={() => checkLive('fuel')}>{checking === 'fuel' ? 'Checking…' : 'Fuel prices'}</button>
          <button className="secondary-button" disabled={Boolean(checking)} onClick={() => checkLive('weather')}>{checking === 'weather' ? 'Checking…' : 'BOM weather'}</button>
        </div>
        <p className="form-message" role="status">{liveMessage}</p>
      </section>
      <section className="nearby-grid">{categories.map(([label, query]) => <a key={label} href={hrefFor(query)} target="_blank" rel="noreferrer" className="nearby-card"><strong>{label}</strong><span>Search nearby ↗</span></a>)}</section>
    </Shell>
  );
}
