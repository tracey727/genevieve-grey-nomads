# GENEVIEVE — Budget Traveller — Native Expo App

This is the separate native iPhone/Android build. It lives under `native/` on the `native/expo-grey-nomads` branch so the production Next.js/Cloudflare app remains untouched.

## Run on a phone with Expo Go

```bash
cd native
npm install
npx expo install react-native-safe-area-context lucide-react-native react-native-svg
npx expo install expo-linear-gradient expo-status-bar
npx expo install --fix
npx expo start
```

Scan the Expo QR code from the phone. The screen is safe-area aware and scrolls independently of the fixed native bottom navigation.

## What is native already

- Premium dark navy/gold Home Screen
- Inline Tree / Infinity / Roots SVG emblem, so there is no broken image dependency
- Exact tagline: `Safety from roots to every journey.`
- Ballina journey summary, weather, fuel and on-budget status
- Emergency / Safety banner
- Responsive 3 x 2 action grid using native Lucide SVG icons
- Four-column budget bar
- Native bottom tabs: HOME, EXPLORE, MY MAPS, MESSAGES, MORE
- iPhone notch/Dynamic Island/home-indicator and Android system-inset handling via `react-native-safe-area-context`
- Tablet-aware responsive sizing via `useWindowDimensions()`

## Production builds

After an Expo/EAS account is connected:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile production
eas build --platform android --profile production
```

Bundle identifiers are currently configured as `com.genevieve.greynomads` for both platforms and can be changed before store submission if needed.
