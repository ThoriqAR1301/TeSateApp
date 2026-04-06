import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { CartItem } from '@/services/orderService';
import { ORDER_CONFIG } from '@/constants/Config';

type OrderSummaryProps = {
  items:           CartItem[];
  showEstimasi?:   boolean;
};

export default function OrderSummary({
  items,
  showEstimasi = false,
}: OrderSummaryProps) {
  const subtotal    = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const appFee      = ORDER_CONFIG.APP_FEE;
  const deliveryFee = ORDER_CONFIG.DELIVERY_FEE;
  const total       = subtotal + appFee + deliveryFee;

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.itemLabel}>
            {item.quantity}x {item.title}
          </Text>
          <Text style={styles.itemValue}>
            {formatCurrency(item.price * item.quantity)}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.feeLabel}>Biaya Aplikasi</Text>
        <Text style={styles.feeValue}>{formatCurrency(appFee)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.feeLabel}>Biaya Pesan Antar</Text>
        <Text style={styles.feeValue}>{formatCurrency(deliveryFee)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total Biaya</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>

      {showEstimasi && (
        <View style={styles.row}>
          <Text style={styles.feeLabel}>Estimasi Waktu Antar</Text>
          <Text style={styles.feeValue}>
            {ORDER_CONFIG.EST_DELIVERY_MIN}–{ORDER_CONFIG.EST_DELIVERY_MAX} mins
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  itemLabel: {
    ...Typography.body,
    color: Colors.text.primary,
    flex:  1,
  },
  itemValue: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  feeLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  feeValue: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  totalLabel: {
    ...Typography.label,
    color:      Colors.text.primary,
    fontWeight: '700',
  },
  totalValue: {
    ...Typography.label,
    color:      Colors.text.primary,
    fontWeight: '700',
  },
  divider: {
    height:          1,
    backgroundColor: Colors.border.default,
    marginVertical:  2,
  },
});