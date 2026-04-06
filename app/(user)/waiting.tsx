import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useOrderStore } from '@/store';
import { OrderSummary } from '@/components';
import { formatCurrency } from '@/utils/formatCurrency';

export default function WaitingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeOrder = useOrderStore(s => s.activeOrder);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, friction: 7, tension: 60, useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue:  1.12,
          duration: 700,
          easing:   Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue:  1,
          duration: 700,
          easing:   Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search-outline" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
      >
        <Animated.View
          style={[
            styles.illustrationWrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="time-outline"
                size={64}
                color={Colors.primary.default}
              />
            </View>
          </Animated.View>

          <Text style={styles.waitTitle}>Tunggu Lho...</Text>
          <Text style={styles.waitSubtitle}>Pesanan Kamu Lagi Diproses...</Text>
          <Text style={styles.waitDesc}>
            Tunggu Aja Depan Rumah Nanti Juga Sampe Kok
          </Text>

          {activeOrder && (
            <View style={styles.estimasiBox}>
              <Ionicons
                name="bicycle-outline"
                size={18}
                color={Colors.primary.default}
              />
              <Text style={styles.estimasiText}>
                Estimasi Tiba : {activeOrder.estimasiMenit}
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.divider} />

        <Animated.View
          style={[
            styles.summarySection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Pesanan Kamu</Text>

          {activeOrder ? (
            <>
              <OrderSummary items={activeOrder.items} />

              <View style={styles.orderIdRow}>
                <Text style={styles.orderIdLabel}>ID Pesanan</Text>
                <Text style={styles.orderIdValue}>{activeOrder.id}</Text>
              </View>

              <View style={styles.orderIdRow}>
                <Text style={styles.orderIdLabel}>Metode Bayar</Text>
                <Text style={styles.orderIdValue}>
                  {activeOrder.paymentMethod === 'cash'
                    ? 'Bayar Cash'
                    : activeOrder.paymentMethod === 'ovo'
                    ? 'OVO'
                    : 'QRIS'}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.noOrderText}>
              Belum Ada Pesanan Aktif Nih
            </Text>
          )}
        </Animated.View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(user)')}
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={18} color={Colors.white} />
          <Text style={styles.homeBtnText}>Kembali Ke Beranda</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.background.default,
  },

  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 20,
    paddingBottom:     12,
  },
  backBtn:   { padding: 4 },
  searchBtn: { padding: 4 },

  content: {
    paddingHorizontal: 24,
    paddingTop:        16,
    gap:               24,
  },

  illustrationWrapper: {
    alignItems: 'center',
    gap:        10,
  },
  iconCircle: {
    width:           130,
    height:          130,
    borderRadius:    65,
    backgroundColor: Colors.primary.light,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    8,
  },
  waitTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  waitSubtitle: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  waitDesc: {
    ...Typography.body,
    color:     Colors.text.secondary,
    textAlign: 'center',
  },
  estimasiBox: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             8,
    backgroundColor: Colors.primary.light,
    paddingVertical:   10,
    paddingHorizontal: 18,
    borderRadius:    20,
    marginTop:       8,
  },
  estimasiText: {
    ...Typography.label,
    color: Colors.primary.default,
  },

  divider: {
    height:          1,
    backgroundColor: Colors.border.default,
  },

  summarySection: {
    gap: 14,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  orderIdRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingTop:     8,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
  orderIdLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  orderIdValue: {
    ...Typography.label,
    color: Colors.text.primary,
  },
  noOrderText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },

  homeBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             8,
    backgroundColor: Colors.primary.default,
    borderRadius:    12,
    paddingVertical: 16,
    shadowColor:     Colors.primary.default,
    shadowOpacity:   0.35,
    shadowOffset:    { width: 0, height: 4 },
    shadowRadius:    8,
    elevation:       4,
  },
  homeBtnText: {
    ...Typography.button,
    color: Colors.white,
  },
});