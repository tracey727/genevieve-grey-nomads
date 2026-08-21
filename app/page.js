'use client';

import GreyNomadsHomeScreen from '../components/GreyNomadsHomeScreen';
import { GENEVIEVE_LOGO_SRC } from '../lib/genevieveLogo';
import useTripData from '../lib/hooks/useTripData';

const actions = [
  { number: '1', title: 'Continue journey', href: '/trip', icon: 'journey', art: 'road' },
  { number: '2', title: 'Plan trip', href: '/plan', icon: 'plan', art: 'map' },
  { number: '3', title: 'Around me', href: '/around', icon: 'around', art: 'outback' },
  { number: '4', title: 'Safety', href: '/safety', icon: 'safety' },
  { number: '5', title: 'Budget planner', href: '/plan#budget', icon: 'budget' },
  { number: '6', title: 'My trip', href: '/trip', icon: 'trip' }
];

const routes = {
  trip: '/trip',
  plan: '/plan',
  around: '/around',
  safety: '/safety',
  budget: '/plan#budget'
};

export default function Home() {
  const trip = useTripData();

  return (
    <GreyNomadsHomeScreen
      trip={trip}
      actions={actions}
      routes={routes}
      brandLogoSrc={GENEVIEVE_LOGO_SRC}
    />
  );
}
