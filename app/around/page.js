'use client';

import { useState } from 'react';
import Shell from '../../components/Shell';

const categories = [
  ['Fuel', 'fuel station'], ['Toilets', 'public toilets'], ['Food', 'food'], ['Caravan parks', 'caravan park'],
  ['Free / rest areas', 'rest area'], ['Hospitals', 'hospital'], ['Veterinary clinics', 'veterinary clinic'],
  ['Emergency vets', 'emergency vet'], ['Dog parks', 'dog park'], ['Drinking water', 'drinking water']
];

export default function AroundPage() {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('Location is used on this screen only. GENEVIEVE does not store it here.');
  const locate = () => {
    if (!navigator.geolocation) return setMessage('Location is not available in this browser.');
    setMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setLocation({ lat: coords.latitude, lon: coords.longitude }); setMessage('Location ready. Choose what you need nearby.'); },
      () => setMessage('Location permission was not available. You can still search manually in your maps app.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };
  const hrefFor = (query) => {
    const q = encodeURIComponent(query);
    if (!location) return `https://www.google.com/maps/search/?api=1&query=${q}`;
    return `https://www.google.com/maps/search/?api=1&query=${q}&center=${location.lat},${location.lon}`;
  };
  return (
    <Shell current="Around Me">
      <section className="page-heading"><p className="eyebrow">Around me</p><h2>Find what matters, fast</h2><p>One simple screen for essentials. Search results open in your maps service so the app does not pretend unverified business data is live.</p></section>
      <section className="panel locate-panel"><button className="primary-button" onClick={locate}>Use my location</button><p role="status">{message}</p></section>
      <section className="nearby-grid">{categories.map(([label, query]) => <a key={label} href={hrefFor(query)} target="_blank" rel="noreferrer" className="nearby-card"><strong>{label}</strong><span>Search nearby ↗</span></a>)}</section>
    </Shell>
  );
}
