import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useCart } from '@/hooks/useOrder';
import { EmptyState } from '@/components';
import { formatCurrency } from '@/utils/formatCurrency';
import { CartItem } from '@/services/orderService';

function CartItemRow({ item }: { item: CartItem }) {
  const { increaseQty, decreaseQty, removeItem } = useCart();

  return (
    <View style={itemStyles.container}>
      <Image
        source={{ uri: item.thumbnail }}
        style={itemStyles.image}
        resizeMode="cover"
      />

      <View style={itemStyles.info}>
        <Text style={itemStyles.name} numberOfLines={2}>{item.title}</Text>
        <Text style={itemStyles.price}>{formatCurrency(item.price)}</Text>

        <View style={itemStyles.qtyRow}>
          <TouchableOpacity
            style={itemStyles.qtyBtn}
            onPress={() => decreaseQty(item.id)}
            activeOpacity={0.75}
          >
            <Ionicons name="remove" size={16} color={Colors.white} />
          </TouchableOpacity>
          <Text style={itemStyles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={itemStyles.qtyBtn}
            onPress={() => increaseQty(item.id)}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={itemStyles.deleteBtn}
        onPress={() => removeItem(item.id)}
        activeOpacity={0.75}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
      </TouchableOpacity>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.background.card,
    borderRadius:    14,
    padding:         12,
    gap:             12,
    shadowColor:     '#000',
    shadowOpacity:   0.05,
    shadowOffset:    { width: 0, height: 2 },
    shadowRadius:    4,
    elevation:       1,
  },
  image: {
    width:        70,
    height:       70,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    gap:  6,
  },
  name: {
    ...Typography.label,
    color: Colors.text.primary,
  },
  price: {
    ...Typography.price,
    color: Colors.primary.default,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  qtyBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius:    6,
    width:           26,
    height:          26,
    alignItems:      'center',
    justifyContent:  'center',
  },
  qtyText: {
    ...Typography.label,
    color:     Colors.text.primary,
    minWidth:  20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: 6,
  },
});

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, summary, isEmpty, clearCart } = useCart();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang Kamu</Text>
        {!isEmpty && (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearText}>Hapus Semua</Text>
          </TouchableOpacity>
        )}
      </View>

      {isEmpty ? (
        <View style={styles.emptyWrapper}>
          <EmptyState
            title="Kamu Belom Pesan Loh"
            subtitle="Yuk Pesan Dulu"
            icon="cart-outline"
          />
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.replace('/(user)')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopBtnText}>Lihat Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CartItemRow item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />

          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(summary.subtotal)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Biaya Aplikasi</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(summary.appFee)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Biaya Antar</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(summary.deliveryFee)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(summary.total)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => router.push('/(user)/payment')}
              activeOpacity={0.85}
            >
              <Text style={styles.payBtnText}>
                Bayar Sekarang — {formatCurrency(summary.total)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.background.soft,
  },

  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 20,
    paddingBottom:     14,
    backgroundColor:   Colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
    gap:               12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    flex:  1,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    ...Typography.labelSm,
    color: Colors.status.error,
  },

  emptyWrapper: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
    gap:            20,
    paddingHorizontal: 32,
  },
  shopBtn: {
    backgroundColor: Colors.primary.default,
    paddingVertical:   14,
    paddingHorizontal: 40,
    borderRadius:      12,
    shadowColor:       Colors.primary.default,
    shadowOpacity:     0.3,
    shadowOffset:      { width: 0, height: 4 },
    shadowRadius:      8,
    elevation:         4,
  },
  shopBtnText: {
    ...Typography.button,
    color: Colors.white,
  },

  listContent: {
    padding:       16,
    paddingBottom: 20,
  },

  bottomBar: {
    backgroundColor:   Colors.background.default,
    paddingHorizontal: 20,
    paddingTop:        16,
    borderTopWidth:    1,
    borderTopColor:    Colors.border.default,
    shadowColor:       '#000',
    shadowOpacity:     0.06,
    shadowOffset:      { width: 0, height: -3 },
    shadowRadius:      8,
    elevation:         8,
    gap:               14,
  },
  summaryBox: {
    gap: 8,
  },
  summaryRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  totalRow: {
    marginTop:     6,
    paddingTop:    10,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
  totalLabel: {
    ...Typography.label,
    color:      Colors.text.primary,
    fontWeight: '700',
  },
  totalValue: {
    ...Typography.label,
    color:      Colors.primary.default,
    fontWeight: '700',
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
  payBtnText: {
    ...Typography.button,
    color: Colors.white,
  },
});