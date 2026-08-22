import './globals.css';
import './premium.css';
import './delete-controls.css';
import './approved-home.css';
import './home-realistic.css';
import './home-mockup-fixes.css';
import './gday-traveller-image.css';
import './left-gum-sprig.css';

export const metadata = {
  title: 'GENEVIEVE Grey Nomads',
  description: 'Australian journey, budget and safety planning for travellers.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/api/app-icon',
    apple: '/api/app-icon'
  },
  appleWebApp: {
    capable: true,
    title: 'Grey Nomads',
    statusBarStyle: 'black-translucent'
  }
};

export const viewport = {
  themeColor: '#061d34'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
