import './globals.css';

export const metadata = {
  title: 'GENEVIEVE Grey Nomads',
  description: 'Australian journey, budget and safety planning for travellers.',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
