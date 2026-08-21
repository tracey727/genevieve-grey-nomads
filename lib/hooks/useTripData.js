'use client';

import { useEffect, useState } from 'react';

export default function useTripData() {
  const [summary, setSummary] = useState(null);
  const [travellerName, setTravellerName] = useState('Traveller');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('genevieve:last-plan');
      if (raw) setSummary(JSON.parse(raw));

      const profileRaw = localStorage.getItem('genevieve:traveller-profile');
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        const firstName = String(profile?.firstName || '').trim().slice(0, 40);
        if (firstName) setTravellerName(firstName);
      }
    } catch {
      // Keep the Home screen usable if local device data is unavailable/corrupt.
    }
  }, []);

  const destination = summary?.destination || 'Plan your next stop';
  const distance = summary?.result?.totalDistanceKm
    ? `${summary.result.totalDistanceKm.toLocaleString('en-AU')} km planned`
    : 'No journey selected';
  const fuelRange = summary?.result?.safeRangeKm
    ? `${summary.result.safeRangeKm.toLocaleString('en-AU')} km`
    : 'Add vehicle details';
  const budgetStatus = summary?.result?.status
    ? summary.result.status.replaceAll('-', ' ')
    : 'Ready to plan';

  return {
    summary,
    travellerName,
    destination,
    distance,
    fuelRange,
    budgetStatus
  };
}
