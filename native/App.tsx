import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import GenevieveHomeScreen, {
  type HomeConnectionStatus,
  type HomeScreenCallbacks,
  type HomeScreenData,
} from './src/screens/GenevieveHomeScreen';
import {
  getLiveHealth,
  openLiveRoute,
  type LiveRouteKey,
} from './src/services/liveBridge';

const homeData: HomeScreenData = {
  nextStop: 'Ballina',
  nextStopTime: '1 hr 42 min',
  weather: '24°C — no major warnings',
  fuelRange: '420 km',
  budgetStatus: 'On budget',
  tripBudget: '$2,000',
  spent: '$426',
  available: '$611',
  emergencyReserve: '$250',
};

function NativeHome() {
  const [connection, setConnection] = useState<HomeConnectionStatus>({
    online: false,
    label: 'CHECKING LIVE SERVICE',
  });

  useEffect(() => {
    let active = true;

    getLiveHealth()
      .then((health) => {
        if (!active) return;
        setConnection({
          online: health.ok && health.database === 'connected',
          label: health.ok && health.database === 'connected'
            ? 'LIVE · DATABASE CONNECTED'
            : 'LIVE SERVICE LIMITED',
        });
      })
      .catch(() => {
        if (!active) return;
        setConnection({ online: false, label: 'OFFLINE MODE' });
      });

    return () => {
      active = false;
    };
  }, []);

  const safeOpen = async (route: LiveRouteKey) => {
    try {
      await openLiveRoute(route);
    } catch {
      Alert.alert(
        'Live Budget Traveller unavailable',
        'The live service could not be opened. Please check your internet connection and try again.'
      );
    }
  };

  const callbacks = useMemo<HomeScreenCallbacks>(() => ({
    onContinueJourney: () => { void safeOpen('continueJourney'); },
    onPlanTrip: () => { void safeOpen('planTrip'); },
    onAroundMe: () => { void safeOpen('aroundMe'); },
    onSafety: () => { void safeOpen('safety'); },
    onBudgetPlanner: () => { void safeOpen('budgetPlanner'); },
    onMyTrip: () => { void safeOpen('myTrip'); },
    onEmergencyPress: () => { void safeOpen('emergency'); },
    onTabSelect: (tabName) => {
      const routeByTab: Record<string, LiveRouteKey> = {
        HOME: 'home',
        EXPLORE: 'explore',
        'MY MAPS': 'maps',
        MESSAGES: 'messages',
        MORE: 'more',
      };
      const route = routeByTab[tabName];
      if (route) void safeOpen(route);
    },
  }), []);

  return (
    <GenevieveHomeScreen
      data={homeData}
      callbacks={callbacks}
      connection={connection}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="light" />
      <NativeHome />
    </SafeAreaProvider>
  );
}
