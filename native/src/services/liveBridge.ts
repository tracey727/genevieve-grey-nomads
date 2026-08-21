import { Linking } from 'react-native';

export const LIVE_BASE_URL = 'https://genevieve-grey-nomads.vercel.app';

export const liveRoutes = {
  home: '/',
  explore: '/around',
  maps: '/plan',
  messages: '/trip',
  more: '/safety',
  continueJourney: '/trip',
  planTrip: '/plan',
  aroundMe: '/around',
  safety: '/safety',
  budgetPlanner: '/plan#budget',
  myTrip: '/trip',
  emergency: '/safety',
} as const;

export type LiveRouteKey = keyof typeof liveRoutes;

export interface LiveHealth {
  ok: boolean;
  database: 'connected' | 'not-configured' | 'unavailable' | string;
}

export async function getLiveHealth(): Promise<LiveHealth> {
  const response = await fetch(`${LIVE_BASE_URL}/api/health`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Live service returned ${response.status}`);
  }

  const data = (await response.json()) as LiveHealth;
  return data;
}

export async function openLiveRoute(route: LiveRouteKey): Promise<void> {
  const path = liveRoutes[route];
  const url = `${LIVE_BASE_URL}${path}`;
  const supported = await Linking.canOpenURL(url);

  if (!supported) {
    throw new Error(`Cannot open ${url}`);
  }

  await Linking.openURL(url);
}
