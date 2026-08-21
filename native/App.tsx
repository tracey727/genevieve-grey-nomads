import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  Banknote,
  Compass,
  Fuel,
  Home,
  Map,
  MapPinned,
  MessageSquare,
  MoreHorizontal,
  Navigation,
  Route,
  ShieldCheck,
  Sun,
} from 'lucide-react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import TreeEmblem from './src/components/TreeEmblem';
import { colors, radius } from './src/theme';

const HERO = 'https://genevieve-grey-nomads.vercel.app/approved-home-hero.webp';

type Tab = 'HOME' | 'EXPLORE' | 'MY MAPS' | 'MESSAGES' | 'MORE';

type Action = {
  title: string;
  tab: Tab;
  Icon: React.ComponentType<any>;
};

const actions: Action[] = [
  { title: 'CONTINUE JOURNEY', tab: 'MY MAPS', Icon: Route },
  { title: 'PLAN TRIP', tab: 'MY MAPS', Icon: MapPinned },
  { title: 'AROUND ME', tab: 'EXPLORE', Icon: Navigation },
  { title: 'SAFETY', tab: 'MORE', Icon: ShieldCheck },
  { title: 'BUDGET PLANNER', tab: 'HOME', Icon: Banknote },
  { title: 'MY TRIP', tab: 'MY MAPS', Icon: Map },
];

const tabs: { label: Tab; Icon: React.ComponentType<any> }[] = [
  { label: 'HOME', Icon: Home },
  { label: 'EXPLORE', Icon: Compass },
  { label: 'MY MAPS', Icon: Map },
  { label: 'MESSAGES', Icon: MessageSquare },
  { label: 'MORE', Icon: MoreHorizontal },
];

function GoldBorder({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.goldBorder, style]}>{children}</View>;
}

function Hero() {
  return (
    <ImageBackground source={{ uri: HERO }} style={styles.hero} imageStyle={styles.heroImage}>
      <LinearGradient
        colors={['rgba(1,9,17,0.18)', 'rgba(2,16,29,0.38)', 'rgba(3,17,29,0.94)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.logoWrap}>
        <TreeEmblem width={152} height={176} />
        <Text style={styles.brand}>GENEVIEVE</Text>
        <Text style={styles.tagline}>Safety from roots to every journey.</Text>
      </View>
    </ImageBackground>
  );
}

function JourneyCard() {
  return (
    <GoldBorder style={styles.journeyCard}>
      <ImageBackground source={{ uri: HERO }} style={styles.journeyPhoto} imageStyle={styles.journeyPhotoImage}>
        <LinearGradient colors={['transparent', 'rgba(2,13,23,0.42)']} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <View style={styles.journeyCopy}>
        <Text style={styles.greeting}>G’day, Traveller</Text>
        <InfoRow Icon={MapPinned} label="Next stop" value="Ballina — 1 hr 42 min" />
        <InfoRow Icon={Sun} label="Weather" value="24°C — no major warnings" />
        <InfoRow Icon={Fuel} label="Fuel range" value="420 km" />
        <InfoRow Icon={Banknote} label="Budget status" value="On budget" green />
      </View>
    </GoldBorder>
  );
}

function InfoRow({ Icon, label, value, green }: { Icon: React.ComponentType<any>; label: string; value: string; green?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Icon size={19} color={colors.gold} strokeWidth={1.9} />
      <Text style={styles.infoText} numberOfLines={2}>
        <Text style={styles.infoLabel}>{label}: </Text>
        <Text style={green ? styles.infoGreen : styles.infoValue}>{value}</Text>
      </Text>
    </View>
  );
}

function EmergencyBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Emergency and Safety">
      <LinearGradient colors={[colors.red700, colors.red900, '#3e0f08']} style={styles.emergency}>
        <View style={styles.shieldBadge}>
          <AlertTriangle size={26} color={colors.goldSoft} strokeWidth={1.8} />
        </View>
        <View style={styles.emergencyCopy}>
          <Text style={styles.emergencyTitle}>EMERGENCY / SAFETY</Text>
          <Text style={styles.emergencySub}>Tap for immediate assistance</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </LinearGradient>
    </Pressable>
  );
}

function ActionGrid({ compact, onSelect }: { compact: boolean; onSelect: (tab: Tab) => void }) {
  return (
    <View style={styles.grid}>
      {actions.map(({ title, tab, Icon }, index) => (
        <Pressable key={title} onPress={() => onSelect(tab)} style={[styles.actionCard, compact && styles.actionCompact]}>
          <LinearGradient colors={['#0b304b', '#061c2e', '#03121f']} style={styles.actionGradient}>
            <Icon size={compact ? 35 : 41} color={colors.gold} strokeWidth={1.55} />
            <Text style={styles.actionText}>{index + 1}. {title}</Text>
            <Text style={styles.actionArrow}>›</Text>
          </LinearGradient>
        </Pressable>
      ))}
    </View>
  );
}

function BudgetBar() {
  const items = [
    ['Trip budget', '$2,000', colors.cream],
    ['Spent', '$426', colors.cream],
    ['Available', '$611', colors.green],
    ['Emergency reserve', '$250', colors.goldSoft],
  ] as const;

  return (
    <GoldBorder style={styles.budgetBar}>
      {items.map(([label, value, colour], index) => (
        <View key={label} style={[styles.budgetCell, index < items.length - 1 && styles.budgetDivider]}>
          <Text style={styles.budgetLabel}>{label}</Text>
          <Text style={[styles.budgetValue, { color: colour }]}>{value}</Text>
        </View>
      ))}
    </GoldBorder>
  );
}

function BottomNav({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  return (
    <View style={styles.navShell}>
      {tabs.map(({ label, Icon }) => {
        const selected = active === label;
        return (
          <Pressable key={label} onPress={() => onSelect(label)} style={styles.navItem} accessibilityRole="tab" accessibilityState={{ selected }}>
            <Icon size={23} color={selected ? colors.goldSoft : colors.silver} strokeWidth={1.8} />
            <Text style={[styles.navLabel, selected && styles.navLabelActive]} numberOfLines={1}>{label}</Text>
            {selected && <View style={styles.navIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

function PlaceholderScreen({ tab }: { tab: Exclude<Tab, 'HOME'> }) {
  const copy = useMemo(() => ({
    EXPLORE: ['Explore', 'Nearby places, fuel, stops and local information will live here.'],
    'MY MAPS': ['My Maps', 'Your planned routes, saved journeys and trip map will live here.'],
    MESSAGES: ['Messages', 'Travel notices and future messaging tools will live here.'],
    MORE: ['More', 'Safety, settings, account and support tools will live here.'],
  }[tab]), [tab]);

  return (
    <View style={styles.placeholder}>
      <TreeEmblem width={120} height={138} />
      <Text style={styles.placeholderTitle}>{copy[0]}</Text>
      <Text style={styles.placeholderCopy}>{copy[1]}</Text>
    </View>
  );
}

function NativeApp() {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const [activeTab, setActiveTab] = useState<Tab>('HOME');

  const selectTab = (tab: Tab) => setActiveTab(tab);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.appFrame}>
        {activeTab === 'HOME' ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces
          >
            <Hero />
            <JourneyCard />
            <EmergencyBanner onPress={() => selectTab('MORE')} />
            <ActionGrid compact={compact} onSelect={selectTab} />
            <BudgetBar />
          </ScrollView>
        ) : (
          <PlaceholderScreen tab={activeTab} />
        )}
        <BottomNav active={activeTab} onSelect={selectTab} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NativeApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  appFrame: { flex: 1, backgroundColor: colors.navy900 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 18 },
  hero: { height: 330, justifyContent: 'flex-end', backgroundColor: colors.navy850 },
  heroImage: { opacity: 0.96 },
  logoWrap: { alignItems: 'center', paddingBottom: 20 },
  brand: {
    marginTop: -12,
    color: colors.goldSoft,
    fontFamily: 'Georgia',
    fontSize: 37,
    letterSpacing: 6,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: { marginTop: 4, color: colors.goldSoft, fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 15.5 },
  goldBorder: { borderWidth: 1, borderColor: colors.gold, backgroundColor: colors.navy850 },
  journeyCard: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    gap: 13,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  journeyPhoto: { width: 112, minHeight: 205, overflow: 'hidden', borderRadius: 48, borderWidth: 1, borderColor: colors.gold },
  journeyPhotoImage: { borderRadius: 48 },
  journeyCopy: { flex: 1, justifyContent: 'center' },
  greeting: { color: colors.cream, fontFamily: 'Georgia', fontSize: 26, marginBottom: 7 },
  infoRow: { minHeight: 39, flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  infoText: { flex: 1, fontSize: 13.2, lineHeight: 17.5 },
  infoLabel: { color: colors.cream, fontWeight: '700' },
  infoValue: { color: colors.goldSoft, fontWeight: '700' },
  infoGreen: { color: colors.green, fontWeight: '800' },
  emergency: {
    minHeight: 82,
    marginHorizontal: 14,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shieldBadge: { width: 52, height: 58, borderWidth: 1, borderColor: colors.goldSoft, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(70,8,5,0.34)' },
  emergencyCopy: { flex: 1 },
  emergencyTitle: { color: colors.goldSoft, fontWeight: '800', letterSpacing: 2.4, fontSize: 15 },
  emergencySub: { color: '#e9d7bb', marginTop: 4, fontSize: 13 },
  chevron: { color: colors.goldSoft, fontSize: 39, lineHeight: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 14, marginTop: 12 },
  actionCard: { width: '31.7%', minHeight: 142, borderWidth: 1, borderColor: colors.gold, borderRadius: radius.md, overflow: 'hidden' },
  actionCompact: { minHeight: 128 },
  actionGradient: { flex: 1, paddingHorizontal: 7, paddingVertical: 14, alignItems: 'center', justifyContent: 'space-between' },
  actionText: { color: colors.cream, fontSize: 10.8, fontWeight: '800', letterSpacing: 0.7, lineHeight: 14, textAlign: 'center' },
  actionArrow: { position: 'absolute', right: 7, bottom: 4, color: colors.gold, fontSize: 25 },
  budgetBar: { marginHorizontal: 14, marginTop: 12, borderRadius: radius.md, flexDirection: 'row', overflow: 'hidden' },
  budgetCell: { flex: 1, minHeight: 77, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  budgetDivider: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: 'rgba(231,173,80,0.35)' },
  budgetLabel: { color: '#d9b36d', fontSize: 10, lineHeight: 12, textAlign: 'center', minHeight: 25 },
  budgetValue: { marginTop: 3, fontFamily: 'Georgia', fontWeight: '700', fontSize: 17 },
  navShell: {
    minHeight: 78,
    flexDirection: 'row',
    paddingTop: 8,
    backgroundColor: '#02101b',
    borderTopWidth: 1,
    borderTopColor: colors.goldDark,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, position: 'relative' },
  navLabel: { color: colors.silver, fontSize: 9.5, letterSpacing: 0.7, fontWeight: '700' },
  navLabelActive: { color: colors.goldSoft },
  navIndicator: { position: 'absolute', bottom: 1, width: 38, height: 2, borderRadius: 2, backgroundColor: colors.goldSoft },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, backgroundColor: colors.navy900 },
  placeholderTitle: { color: colors.goldSoft, fontFamily: 'Georgia', fontSize: 32, marginTop: 8 },
  placeholderCopy: { color: '#c5ced5', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 12 },
});
