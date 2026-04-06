import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useProducts } from '@/hooks/useMenu';
import { EmptyState, ErrorView } from '@/components';
import { formatCurrency } from '@/utils/formatCurrency';
import { Product } from '@/services/menuService';

function AdminMenuCard({
  product,
  onEdit,
  onDelete,
}: {
  product:  Product;
  onEdit:   (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  return (
    <View style={cardStyles.container}>
      <Image
        source={{ uri: product.thumbnail }}
        style={cardStyles.image}
        resizeMode="cover"
      />
      <View style={cardStyles.info}>
        <Text style={cardStyles.name} numberOfLines={1}>{product.title}</Text>
        <Text style={cardStyles.desc} numberOfLines={2}>{product.description}</Text>
        <View style={cardStyles.bottomRow}>
          <Text style={cardStyles.price}>{formatCurrency(product.price)}</Text>
          <View style={cardStyles.actionRow}>
            <TouchableOpacity
              style={[cardStyles.actionBtn, cardStyles.editBtn]}
              onPress={() => onEdit(product)}
              activeOpacity={0.75}
            >
              <Ionicons name="pencil-outline" size={16} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[cardStyles.actionBtn, cardStyles.deleteBtn]}
              onPress={() => onDelete(product)}
              activeOpacity={0.75}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const CARD_WIDTH = 160;

const cardStyles = StyleSheet.create({
  container: {
    width:           CARD_WIDTH,
    backgroundColor: Colors.background.card,
    borderRadius:    14,
    overflow:        'hidden',
    shadowColor:     '#000',
    shadowOpacity:   0.06,
    shadowOffset:    { width: 0, height: 2 },
    shadowRadius:    5,
    elevation:       2,
  },
  image: {
    width:  '100%',
    height: CARD_WIDTH * 0.7,
  },
  info: {
    padding: 10,
    gap:     4,
  },
  name: {
    ...Typography.label,
    color: Colors.text.primary,
  },
  desc: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  bottomRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginTop:      6,
  },
  price: {
    ...Typography.price,
    color: Colors.text.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap:           6,
  },
  actionBtn: {
    width:          30,
    height:         30,
    borderRadius:   8,
    alignItems:     'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: Colors.primary.default,
  },
  deleteBtn: {
    backgroundColor: '#CC2F5E',
  },
});

export default function AdminMenuListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('makanan');

  const { products, isLoading, error, refetch } = useProducts(20, 0);

  const handleEdit = (product: Product) => {
    Alert.alert('Edit Menu', `Edit "${product.title}"?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Edit',  onPress: () => {
      }},
    ]);
  };

  const handleDelete = (product: Product) => {
    Alert.alert('Hapus Menu', `Yakin hapus "${product.title}"?`, [
      { text: 'Batal',  style: 'cancel' },
      {
        text:    'Hapus',
        style:   'destructive',
        onPress: () => {
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Sore, Cak Awih</Text>
      </View>

      <View style={styles.categoryRow}>
        {['Makanan', 'Minuman', 'Snack'].map(cat => {
          const isActive = activeCategory === cat.toLowerCase();
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveCategory(cat.toLowerCase())}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary.default} />
        </View>
      )}

      {!isLoading && error && (
        <ErrorView message={error} onRetry={refetch} />
      )}

      {!isLoading && !error && (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <AdminMenuCard
              product={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="Belum ada menu nih"
              subtitle="Tambah menu dulu yuk!"
              icon="restaurant-outline"
            />
          }
        />
      )}

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
  centered: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
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
  chipActive: {
    backgroundColor: Colors.primary.default,
  },
  chipLabel: {
    ...Typography.labelSm,
    color: Colors.primary.default,
  },
  chipLabelActive: {
    color: Colors.white,
  },

  listContent: {
    paddingHorizontal: 24,
    paddingTop:        4,
    gap:               12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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