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

interface Props {
  data?: Partial<HomeScreenData>;
  callbacks?: HomeScreenCallbacks;
}

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F3E5AB';
const NAVY = '#091528';
const CARD = '#0E1E36';
const HERO_IMAGE = 'https://genevieve-grey-nomads.vercel.app/approved-home-hero.webp';

export const GenevieveHomeScreen: React.FC<Props> = ({ data, callbacks }) => {
  const { width } = useWindowDimensions();
  const compact = width < 390;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={styles.headerContainer}>
          <TreeEmblem width={compact ? 132 : 150} height={compact ? 152 : 174} />
          <Text style={[styles.titleText, compact && styles.titleTextCompact]}>GENEVIEVE</Text>
          <Text style={styles.subtitleText}>Safety from roots to every journey.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.statusRow}>
            <ImageBackground
              source={{ uri: HERO_IMAGE }}
              style={[styles.avatarContainer, compact && styles.avatarCompact]}
              imageStyle={styles.avatarImage}
            >
              <LinearGradient
                colors={['rgba(3,16,28,0.02)', 'rgba(3,16,28,0.32)']}
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
        </View>

        <TouchableOpacity activeOpacity={0.82} onPress={callbacks?.onEmergencyPress}>
          <LinearGradient
            colors={['#8B2500', '#6A1B1B', '#3D0D08']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.emergencyBanner}
          >
            <View style={styles.emergencyLeft}>
              <View style={styles.emergencyIconWrap}>
                <ShieldAlert size={24} color={GOLD_LIGHT} strokeWidth={1.9} />
              </View>
              <View style={styles.emergencyTextGroup}>
                <Text style={styles.emergencyTitle}>EMERGENCY / SAFETY</Text>
                <Text style={styles.emergencySubtitle}>Tap for immediate assistance</Text>
              </View>
            </View>
            <ChevronRight size={22} color={GOLD_LIGHT} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.gridContainer}>
          <GridButton title="1. CONTINUE JOURNEY" Icon={Navigation} onPress={callbacks?.onContinueJourney} compact={compact} />
          <GridButton title="2. PLAN TRIP" Icon={MapPin} onPress={callbacks?.onPlanTrip} compact={compact} />
          <GridButton title="3. AROUND ME" Icon={Compass} onPress={callbacks?.onAroundMe} compact={compact} />
          <GridButton title="4. SAFETY" Icon={ShieldAlert} onPress={callbacks?.onSafety} compact={compact} />
          <GridButton title="5. BUDGET PLANNER" Icon={Calculator} onPress={callbacks?.onBudgetPlanner} compact={compact} />
          <GridButton title="6. MY TRIP" Icon={Car} onPress={callbacks?.onMyTrip} compact={compact} />
        </View>

        <View style={styles.budgetBar}>
          <BudgetItem label="Trip budget" value={data?.tripBudget || '$2,000'} />
          <BudgetItem label="Spent" value={data?.spent || '$426'} />
          <BudgetItem label="Available" value={data?.available || '$611'} valueColor="#9DD642" />
          <BudgetItem label="Emergency reserve" value={data?.emergencyReserve || '$250'} valueColor={GOLD_LIGHT} last />
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
    <LinearGradient colors={['#102A47', '#0B1D34', '#071426']} style={styles.gridCardGradient}>
      <Icon size={compact ? 27 : 31} color={GOLD} strokeWidth={1.7} style={styles.gridIcon} />
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
    <Icon size={21} color={active ? GOLD_LIGHT : '#8E8E93'} strokeWidth={1.8} />
    <Text style={[styles.navLabel, { color: active ? GOLD_LIGHT : '#8E8E93' }]} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  titleText: {
    color: GOLD_LIGHT,
    fontFamily: 'Georgia',
    fontSize: 31,
    fontWeight: '600',
    letterSpacing: 5,
    marginTop: -10,
    textShadowColor: 'rgba(0,0,0,0.72)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleTextCompact: {
    fontSize: 27,
    letterSpacing: 4,
  },
  subtitleText: {
    color: GOLD_LIGHT,
    fontFamily: 'Georgia',
    fontSize: 13.5,
    fontStyle: 'italic',
    marginTop: 4,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GOLD,
    padding: 13,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 88,
    height: 118,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: GOLD,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#07101E',
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
    fontSize: 20,
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
    color: '#9DD642',
    fontWeight: '800',
  },
  emergencyBanner: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 12,
    minHeight: 72,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyIconWrap: {
    width: 44,
    height: 48,
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
    letterSpacing: 1.4,
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
    marginBottom: 2,
  },
  gridCard: {
    width: '31.7%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GOLD,
    marginBottom: 10,
    minHeight: 118,
    overflow: 'hidden',
  },
  gridCardCompact: {
    minHeight: 108,
  },
  gridCardGradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  gridIcon: {
    alignSelf: 'center',
    marginTop: 5,
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
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GOLD,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 2,
  },
  budgetItem: {
    flex: 1,
    minHeight: 69,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  budgetDivider: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(212,175,55,0.34)',
  },
  budgetLabel: {
    color: '#A7ACB5',
    fontSize: 9.5,
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
    backgroundColor: '#07101E',
    borderTopWidth: 1,
    borderTopColor: GOLD,
    paddingTop: 9,
    paddingBottom: 8,
    minHeight: 70,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 8.8,
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 0.45,
  },
});

export default GenevieveHomeScreen;
