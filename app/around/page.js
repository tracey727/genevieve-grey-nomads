'use client';

import { useState } from 'react';
import Shell from '../../components/Shell';

const categories = [
  ['Fuel', 'fuel station'], ['Toilets', 'public toilets'], ['Food', 'food'], ['Caravan parks', 'caravan park'],
  ['Free / rest areas', 'rest area'], ['Hospitals', 'hospital'], ['Veterinary clinics', 'veterinary clinic'],
  ['Emergency vets', 'emergency vet'], ['Dog parks', 'dog park'], ['Drinking water', 'drinking water']
];

const travelChecks = [
  ['Road closures', 'road closures Australia official'],
  ['Tides', 'Australian tides official'],
  ['Campground availability', 'campground availability Australia'],
  ['Council rules', 'council camping rules Australia']
];

export default function AroundPage() {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('Location is used on this screen only. GENEVIEVE does not store it here.');
  const [liveMessage, setLiveMessage] = useState('Live weather and fuel prices appear only when a verified provider is connected.');
  const [checking, setChecking] = useState('');

  const locate = () => {
    if (!navigator.geolocation) return setMessage('Location is not available in this browser.');
    setMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setLocation({ lat: coords.latitude, lon: coords.longitude }); setMessage('Location ready. Choose what you need nearby.'); },
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
      const response = await fetch(`${path}?lat=${encodeURIComponent(location.lat)}&lon=${encodeURIComponent(location.lon)}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!payload.live) return setLiveMessage(payload.fallback || payload.message || 'Live data is not available yet.');

      if (kind === 'fuel') {
        const source = payload.data || payload;
        const prices = Array.isArray(source?.prices) ? source.prices.filter(item => Number.isFinite(Number(item?.priceCentsPerLitre))) : [];
        const cheapest = prices.sort((a, b) => Number(a.priceCentsPerLitre) - Number(b.priceCentsPerLitre))[0];
        setLiveMessage(cheapest
          ? `${cheapest.station || cheapest.brand || 'Nearby fuel'}: ${Number(cheapest.priceCentsPerLitre).toFixed(1)}¢/L ${cheapest.fuelType || ''}. Confirm at the pump.`
          : 'The fuel provider responded, but its price format has not yet passed the GENEVIEVE display check.');
      } else {
        const source = payload.data || payload;
        const observation = source?.observation;
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

  const searchHref = (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return (
    <Shell current="Around Me">
      <section className="page-heading"><p className="eyebrow">Around me</p><h2>Find what matters, fast</h2><p>One simple screen for essentials. Search results open in your maps service so the app does not pretend unverified business data is live.</p></section>
      <section className="panel locate-panel"><button className="primary-button" onClick={locate}>Use my location</button><p role="status">{message}</p></section>
      <section className="panel locate-panel" aria-label="Live travel data">
        <p className="eyebrow">Verified live travel data</p>
        <div className="inline-actions">
          <button className="secondary-button" disabled={Boolean(checking)} onClick={() => checkLive('fuel')}>{checking === 'fuel' ? 'Checking…' : 'Fuel prices'}</button>
          <button className="secondary-button" disabled={Boolean(checking)} onClick={() => checkLive('weather')}>{checking === 'weather' ? 'Checking…' : 'BOM weather'}</button>
        </div>
        <p className="form-message" role="status">{liveMessage}</p>
      </section>
      <section className="nearby-grid">{categories.map(([label, query]) => <a key={label} href={hrefFor(query)} target="_blank" rel="noreferrer" className="nearby-card"><strong>{label}</strong><span>Search nearby ↗</span></a>)}</section>
      <section className="panel" aria-label="Travel checks">
        <p className="eyebrow">Travel checks</p>
        <h3>Check before you move</h3>
        <p>These agreed travel checks are available now as manual official-source searches. GENEVIEVE will only label them live after a verified provider integration is approved.</p>
        <div className="nearby-grid">
          {travelChecks.map(([label, query]) => <a key={label} href={searchHref(query)} target="_blank" rel="noreferrer" className="nearby-card"><strong>{label}</strong><span>Check source ↗</span></a>)}
        </div>
      </section>
    </Shell>
  );
}
