import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import './globals.css';
import './premium.css';
import './delete-controls.css';
import './approved-home.css';
import './home-realistic.css';
import './home-mockup-fixes.css';
import './gday-traveller-image.css';
import './gum-leaves-reference.css';
import './continue-journey-toggle.css';
import './vip-toggle-upgrade.css';
import './safety-toggle-upgrade.css';
import './budget-traveller-home-lock.css';

export const metadata = {
  title: 'GENEVIEVE — Budget Traveller',
  description: 'Australian journey, budget and safety planning for travellers.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/api/app-icon',
    apple: '/api/app-icon'
  },
  appleWebApp: {
    capable: true,
    title: 'Budget Traveller',
    statusBarStyle: 'black-translucent'
  }
};

export const viewport = {
  themeColor: '#061d34'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
