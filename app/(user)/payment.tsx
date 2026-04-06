import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useCart } from '@/hooks/useOrder';
import { useOrder } from '@/hooks/useOrder';
import { OrderSummary, PaymentOption } from '@/components';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { items, summary, isEmpty } = useCart();
  const {
    selectedPayment,
    setSelectedPayment,
    placeOrder,
    isLoading,
    error,
    clearError,
  } = useOrder();

  if (isEmpty) {
    router.replace('/(user)/cart');
    return null;
  }

  const handleBayar = async () => {
    clearError();
    await placeOrder();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesanan Kamu</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        <View style={styles.section}>
          <OrderSummary items={items} showEstimasi />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <PaymentOption
            selected={selectedPayment}
            onChange={setSelectedPayment}
          />
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={Colors.status.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.payBtn, isLoading && styles.payBtnDisabled]}
          onPress={handleBayar}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.payBtnText}>
              Konfirmasi Pesanan
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom:     14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
  },

  content: {
    padding: 24,
    gap:     20,
  },
  section: {
    gap: 12,
  },
  divider: {
    height:          1,
    backgroundColor: Colors.border.default,
  },

  errorBox: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             8,
    backgroundColor: '#FFF5F5',
    borderRadius:    10,
    padding:         12,
    borderWidth:     1,
    borderColor:     '#FED7D7',
  },
  errorText: {
    ...Typography.labelSm,
    color: Colors.status.error,
    flex:  1,
  },

  bottomBar: {
    position:          'absolute',
    bottom:            0,
    left:              0,
    right:             0,
    backgroundColor:   Colors.white,
    paddingHorizontal: 24,
    paddingTop:        16,
    borderTopWidth:    1,
    borderTopColor:    Colors.border.default,
    shadowColor:       '#000',
    shadowOpacity:     0.08,
    shadowOffset:      { width: 0, height: -3 },
    shadowRadius:      8,
    elevation:         8,
  },
  payBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius:    12,
    paddingVertical: 16,
    alignItems:      'center',
    shadowColor:     Colors.primary.default,
    shadowOpacity:   0.35,
    shadowOffset:    { width: 0, height: 4 },
    shadowRadius:    8,
    elevation:       4,
  },
  payBtnDisabled: {
    opacity: 0.65,
  },
  payBtnText: {
    ...Typography.button,
    color: Colors.white,
  },
});