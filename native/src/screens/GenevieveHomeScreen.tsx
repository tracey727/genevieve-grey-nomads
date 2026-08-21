import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShieldAlert,
  MapPin,
  Compass,
  Map,
  MessageSquare,
  Menu,
  Home,
  Navigation,
  Calculator,
  Car,
  ChevronRight,
  Sun,
  Fuel,
  Wallet,
  Wifi,
} from 'lucide-react-native';
import TreeEmblem from '../components/TreeEmblem';

export interface HomeScreenData {
  nextStop: string;
  nextStopTime: string;
  weather: string;
  fuelRange: string;
  budgetStatus: string;
  tripBudget: string;
  spent: string;
  available: string;
  emergencyReserve: string;
}

export interface HomeScreenCallbacks {
  onContinueJourney?: () => void;
  onPlanTrip?: () => void;
  onAroundMe?: () => void;
  onSafety?: () => void;
  onBudgetPlanner?: () => void;
  onMyTrip?: () => void;
  onEmergencyPress?: () => void;
  onTabSelect?: (tabName: string) => void;
}

export interface HomeConnectionStatus {
  online: boolean;
  label?: string;
}

interface Props {
  data?: Partial<HomeScreenData>;
  callbacks?: HomeScreenCallbacks;
  connection?: HomeConnectionStatus;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F3E5AB';
const GOLD_DEEP = '#9A6723';
const NAVY = '#071321';
const CARD = '#0A2037';
const CARD_DEEP = '#061626';
const HERO_IMAGE = 'https://genevieve-grey-nomads.vercel.app/approved-home-hero.webp';

export const GenevieveHomeScreen: React.FC<Props> = ({ data, callbacks, connection }) => {
  const { width } = useWindowDimensions();
  const compact = width < 390;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.hero} imageStyle={styles.heroImage}>
          <LinearGradient
            colors={['rgba(0,8,15,0.22)', 'rgba(3,19,33,0.42)', '#071321']}
            locations={[0, 0.56, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.heroSideShade} />

          <View style={styles.headerContainer}>
            <TreeEmblem width={compact ? 130 : 150} height={compact ? 150 : 172} />
            <Text style={[styles.titleText, compact && styles.titleTextCompact]}>GENEVIEVE</Text>
            <Text style={styles.subtitleText}>Safety from roots to every journey.</Text>

            <View style={[styles.liveBadge, connection?.online === false && styles.liveBadgeOffline]}>
              <Wifi size={12} color={connection?.online === false ? '#C8CDD4' : '#A8D954'} strokeWidth={2} />
              <Text style={[styles.liveBadgeText, connection?.online === false && styles.liveBadgeTextOffline]}>
                {connection?.online === false ? 'OFFLINE MODE' : connection?.label || 'LIVE · CONNECTED'}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentSection}>
          <LinearGradient colors={['#0D2945', '#081D33', '#061626']} style={styles.cardGradient}>
            <View style={styles.statusRow}>
              <ImageBackground
                source={{ uri: HERO_IMAGE }}
                style={[styles.avatarContainer, compact && styles.avatarCompact]}
                imageStyle={styles.avatarImage}
              >
                <LinearGradient
                  colors={['rgba(3,16,28,0.01)', 'rgba(3,16,28,0.26)']}
                  style={StyleSheet.absoluteFill}
                />
              </ImageBackground>

              <View style={styles.statusDetails}>
                <Text style={styles.greetingText}>G&apos;day, Traveller</Text>

                <InfoLine Icon={MapPin}>
                  Next stop: <Text style={styles.highlightText}>{data?.nextStop || 'Ballina'}</Text> — {data?.nextStopTime || '1 hr 42 min'}
                </InfoLine>

                <InfoLine Icon={Sun}>
                  Weather: <Text style={styles.highlightText}>{data?.weather || '24°C — no major warnings'}</Text>
                </InfoLine>

                <InfoLine Icon={Fuel}>
                  Fuel range: <Text style={styles.highlightText}>{data?.fuelRange || '420 km'}</Text>
                </InfoLine>

                <InfoLine Icon={Wallet}>
                  Budget status: <Text style={styles.positiveText}>{data?.budgetStatus || 'On budget'}</Text>
                </InfoLine>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.contentSectionTight}>
          <TouchableOpacity activeOpacity={0.82} onPress={callbacks?.onEmergencyPress}>
            <LinearGradient
              colors={['#98270F', '#6A1B1B', '#3B0D08']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.emergencyBanner}
            >
              <View style={styles.emergencyLeft}>
                <View style={styles.emergencyIconWrap}>
                  <ShieldAlert size={25} color={GOLD_LIGHT} strokeWidth={1.9} />
                </View>
                <View style={styles.emergencyTextGroup}>
                  <Text style={styles.emergencyTitle}>EMERGENCY / SAFETY</Text>
                  <Text style={styles.emergencySubtitle}>Tap for immediate assistance</Text>
                </View>
              </View>
              <ChevronRight size={23} color={GOLD_LIGHT} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.contentSectionTight}>
          <View style={styles.gridContainer}>
            <GridButton title="1. CONTINUE JOURNEY" Icon={Navigation} onPress={callbacks?.onContinueJourney} compact={compact} />
            <GridButton title="2. PLAN TRIP" Icon={MapPin} onPress={callbacks?.onPlanTrip} compact={compact} />
            <GridButton title="3. AROUND ME" Icon={Compass} onPress={callbacks?.onAroundMe} compact={compact} />
            <GridButton title="4. SAFETY" Icon={ShieldAlert} onPress={callbacks?.onSafety} compact={compact} />
            <GridButton title="5. BUDGET PLANNER" Icon={Calculator} onPress={callbacks?.onBudgetPlanner} compact={compact} />
            <GridButton title="6. MY TRIP" Icon={Car} onPress={callbacks?.onMyTrip} compact={compact} />
          </View>
        </View>

        <View style={styles.contentSectionTight}>
          <LinearGradient colors={['#0B2742', '#071B2E', '#05131F']} style={styles.budgetBar}>
            <BudgetItem label="Trip budget" value={data?.tripBudget || '$2,000'} />
            <BudgetItem label="Spent" value={data?.spent || '$426'} />
            <BudgetItem label="Available" value={data?.available || '$611'} valueColor="#A8D954" />
            <BudgetItem label="Emergency reserve" value={data?.emergencyReserve || '$250'} valueColor={GOLD_LIGHT} last />
          </LinearGradient>
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <NavItem label="HOME" Icon={Home} active onPress={() => callbacks?.onTabSelect?.('HOME')} />
        <NavItem label="EXPLORE" Icon={Compass} onPress={() => callbacks?.onTabSelect?.('EXPLORE')} />
        <NavItem label="MY MAPS" Icon={Map} onPress={() => callbacks?.onTabSelect?.('MY MAPS')} />
        <NavItem label="MESSAGES" Icon={MessageSquare} onPress={() => callbacks?.onTabSelect?.('MESSAGES')} />
        <NavItem label="MORE" Icon={Menu} onPress={() => callbacks?.onTabSelect?.('MORE')} />
      </View>
    </SafeAreaView>
  );
};

const InfoLine = ({ Icon, children }: { Icon: React.ComponentType<any>; children: React.ReactNode }) => (
  <View style={styles.infoLine}>
    <Icon size={15} color={GOLD} strokeWidth={1.9} />
    <Text style={styles.infoText}>{children}</Text>
  </View>
);

const GridButton = ({
  title,
  Icon,
  onPress,
  compact,
}: {
  title: string;
  Icon: React.ComponentType<any>;
  onPress?: () => void;
  compact?: boolean;
}) => (
  <TouchableOpacity style={[styles.gridCard, compact && styles.gridCardCompact]} onPress={onPress} activeOpacity={0.72}>
    <LinearGradient colors={['#113552', '#0A233B', '#061729']} style={styles.gridCardGradient}>
      <View style={styles.gridIconHalo}>
        <Icon size={compact ? 27 : 31} color={GOLD_LIGHT} strokeWidth={1.55} />
      </View>
      <View style={styles.gridCardFooter}>
        <Text style={styles.gridCardText}>{title}</Text>
        <ChevronRight size={14} color={GOLD} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const BudgetItem = ({
  label,
  value,
  valueColor = '#FFF',
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  last?: boolean;
}) => (
  <View style={[styles.budgetItem, !last && styles.budgetDivider]}>
    <Text style={styles.budgetLabel}>{label}</Text>
    <Text style={[styles.budgetValue, { color: valueColor }]}>{value}</Text>
  </View>
);

const NavItem = ({
  label,
  Icon,
  active,
  onPress,
}: {
  label: string;
  Icon: React.ComponentType<any>;
  active?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.72}>
    <Icon size={21} color={active ? GOLD_LIGHT : '#8E98A4'} strokeWidth={1.8} />
    <Text style={[styles.navLabel, { color: active ? GOLD_LIGHT : '#8E98A4' }]} numberOfLines={1}>{label}</Text>
    {active ? <View style={styles.navIndicator} /> : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },
  scrollContent: {
    paddingBottom: 18,
  },
  hero: {
    height: 300,
    justifyContent: 'flex-end',
    backgroundColor: NAVY,
  },
  heroImage: {
    opacity: 0.97,
  },
  heroSideShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,12,21,0.08)',
  },
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  titleText: {
    color: GOLD_LIGHT,
    fontFamily: 'Georgia',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 5.4,
    marginTop: -12,
    textShadowColor: 'rgba(0,0,0,0.86)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleTextCompact: {
    fontSize: 27,
    letterSpacing: 4.2,
  },
  subtitleText: {
    color: GOLD_LIGHT,
    fontFamily: 'Georgia',
    fontSize: 13.5,
    fontStyle: 'italic',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.76)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  liveBadge: {
    marginTop: 10,
    minHeight: 25,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(168,217,84,0.56)',
    backgroundColor: 'rgba(4,20,26,0.58)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveBadgeOffline: {
    borderColor: 'rgba(200,205,212,0.36)',
  },
  liveBadgeText: {
    color: '#B9E46A',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  liveBadgeTextOffline: {
    color: '#C8CDD4',
  },
  contentSection: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: GOLD,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.34,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  contentSectionTight: {
    marginHorizontal: 14,
    marginTop: 12,
  },
  cardGradient: {
    padding: 13,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 120,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: GOLD,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: CARD_DEEP,
  },
  avatarCompact: {
    width: 78,
    height: 108,
    marginRight: 10,
  },
  avatarImage: {
    borderRadius: 42,
  },
  statusDetails: {
    flex: 1,
  },
  greetingText: {
    color: '#FFF9EE',
    fontFamily: 'Georgia',
    fontSize: 21,
    fontWeight: '600',
    marginBottom: 7,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 30,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(212,175,55,0.18)',
  },
  infoText: {
    flex: 1,
    color: '#D7DCE4',
    fontSize: 11.5,
    marginLeft: 6,
    lineHeight: 15,
  },
  highlightText: {
    color: GOLD_LIGHT,
    fontWeight: '700',
  },
  positiveText: {
    color: '#A8D954',
    fontWeight: '800',
  },
  emergencyBanner: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    minHeight: 74,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyIconWrap: {
    width: 46,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(68,8,6,0.34)',
  },
  emergencyTextGroup: {
    marginLeft: 10,
    flex: 1,
  },
  emergencyTitle: {
    color: '#FFF9EE',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1.45,
  },
  emergencySubtitle: {
    color: GOLD_LIGHT,
    fontSize: 11.5,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '31.7%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GOLD,
    marginBottom: 10,
    minHeight: 120,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  gridCardCompact: {
    minHeight: 110,
  },
  gridCardGradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  gridIconHalo: {
    alignSelf: 'center',
    minWidth: 48,
    minHeight: 48,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(243,229,171,0.27)',
    backgroundColor: 'rgba(212,175,55,0.045)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  gridCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridCardText: {
    color: '#FFF9EE',
    fontSize: 9.3,
    lineHeight: 12,
    fontWeight: '800',
    flex: 1,
  },
  budgetBar: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GOLD,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  budgetItem: {
    flex: 1,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  budgetDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(212,175,55,0.34)',
  },
  budgetLabel: {
    color: '#AEB7C2',
    fontSize: 9.4,
    lineHeight: 12,
    textAlign: 'center',
    minHeight: 24,
  },
  budgetValue: {
    fontFamily: 'Georgia',
    fontSize: 14.5,
    fontWeight: '700',
    marginTop: 2,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#04101B',
    borderTopWidth: 1,
    borderTopColor: GOLD_DEEP,
    paddingTop: 9,
    paddingBottom: 8,
    minHeight: 70,
    shadowColor: '#000',
    shadowOpacity: 0.36,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navLabel: {
    fontSize: 8.8,
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 0.45,
  },
  navIndicator: {
    position: 'absolute',
    bottom: -5,
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor: GOLD_LIGHT,
  },
});

export default GenevieveHomeScreen;
