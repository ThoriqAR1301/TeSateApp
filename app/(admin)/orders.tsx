import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { EmptyState } from '@/components';

export default function AdminOrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const orders: never[] = [];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Sore, Cak Awih</Text>
      </View>

      <View style={styles.categoryRow}>
        {['Makanan', 'Minuman', 'Snack'].map(cat => (
          <TouchableOpacity key={cat} style={styles.chip}>
            <Text style={styles.chipLabel}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {orders.length === 0 ? (
        <EmptyState
          title="Belum Ada Pesanan Masuk"
          subtitle="Pesanan Baru Akan Muncul Di Sini"
          icon="receipt-outline"
        />
      ) : null}

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.backBtnText}>Back</Text>
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
    paddingHorizontal: 24,
    paddingBottom:     14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  categoryRow: {
    flexDirection:     'row',
    gap:               8,
    paddingHorizontal: 24,
    paddingVertical:   14,
  },
  chip: {
    paddingVertical:   8,
    paddingHorizontal: 20,
    borderRadius:      20,
    backgroundColor:   Colors.primary.light,
  },
  chipLabel: {
    ...Typography.labelSm,
    color: Colors.primary.default,
  },
  bottomBar: {
    position:          'absolute',
    bottom:            0,
    left:              0,
    right:             0,
    backgroundColor:   Colors.background.default,
    paddingHorizontal: 24,
    paddingTop:        16,
    borderTopWidth:    1,
    borderTopColor:    Colors.border.default,
  },
  backBtn: {
    backgroundColor: Colors.secondary.default,
    borderRadius:    12,
    paddingVertical: 16,
    alignItems:      'center',
  },
  backBtnText: {
    ...Typography.button,
    color: Colors.white,
  },
});