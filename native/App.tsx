import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import GenevieveHomeScreen, {
  type HomeScreenCallbacks,
  type HomeScreenData,
} from './src/screens/GenevieveHomeScreen';

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

const callbacks: HomeScreenCallbacks = {
  // These callbacks are deliberately kept separate from the UI component.
  // The native navigation/backend layer can attach real handlers here next.
  onContinueJourney: () => undefined,
  onPlanTrip: () => undefined,
  onAroundMe: () => undefined,
  onSafety: () => undefined,
  onBudgetPlanner: () => undefined,
  onMyTrip: () => undefined,
  onEmergencyPress: () => undefined,
  onTabSelect: () => undefined,
};

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="light" />
      <GenevieveHomeScreen data={homeData} callbacks={callbacks} />
    </SafeAreaProvider>
  );
}
