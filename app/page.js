'use client';

import GreyNomadsHomeScreen from '../components/GreyNomadsHomeScreen';
import {
  AroundGoldIcon,
  BudgetGoldIcon,
  JourneyGoldIcon,
  PlanGoldIcon,
  SafetyGoldIcon,
  TripGoldIcon
} from '../components/GoldActionIcons';
import useTripData from '../lib/hooks/useTripData';

const actions = [
  { number: '1', title: 'Continue journey', href: '/trip', Icon: JourneyGoldIcon, art: 'road' },
  { number: '2', title: 'Plan trip', href: '/plan', Icon: PlanGoldIcon, art: 'map' },
  { number: '3', title: 'Around me', href: '/around', Icon: AroundGoldIcon, art: 'outback' },
  { number: '4', title: 'Safety', href: '/safety', Icon: SafetyGoldIcon },
  { number: '5', title: 'Budget planner', href: '/plan#budget', Icon: BudgetGoldIcon },
  { number: '6', title: 'My trip', href: '/trip', Icon: TripGoldIcon }
];

const routes = {
  trip: '/trip',
  plan: '/plan',
  around: '/around',
  safety: '/safety',
  budget: '/plan#budget'
};

const mockupContent = {
  travellerName: 'Traveller',
  nextStop: 'Ballina — 1 hr 42 min',
  weather: '24°C — no major warnings',
  fuelRange: '420 km',
  budgetStatus: 'On budget',
  tripBudget: '$2,000',
  spent: '$426',
  available: '$611',
  emergencyReserve: '$250'
};

export default function Home() {
  // Existing trip state remains isolated and available to the screen without
  // being coupled to this visual mockup content.
  const trip = useTripData();

  return (
    <GreyNomadsHomeScreen
      trip={trip}
      actions={actions}
      routes={routes}
      content={mockupContent}
    />
  );
}
