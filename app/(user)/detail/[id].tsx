import { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useProductById } from '@/hooks/useMenu';
import { useCart } from '@/hooks/useOrder';
import { ErrorView } from '@/components';
import { formatCurrency } from '@/utils/formatCurrency';

const { width } = Dimensions.get('window');

export default function DetailMenuScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const insets   = useSafeAreaInsets();

  const { product, isLoading, error, refetch } = useProductById(id);
  const { addItem, getItemById, increaseQty, decreaseQty } = useCart();

  const [qty, setQty] = useState(1);

  const cartItem   = product ? getItemById(product.id) : undefined;
  const cartQty    = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id:        product.id,
        title:     product.title,
        price:     product.price,
        thumbnail: product.thumbnail,
      });
    }
    setQty(1);
  };

  const handlePesanSekarang = () => {
    handleAddToCart();
    router.push('/(user)/cart');
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary.default} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <ErrorView
          message={error ?? 'Produk tidak ditemukan.'}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>

          <Text style={styles.name}>{product.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
            <Text style={styles.metaText}>
              {product.stock > 0 ? `${product.stock} mins` : 'Stok Habis'}
            </Text>
            <View style={styles.dot} />
            <Ionicons name="star" size={14} color="#F6AD55" />
            <Text style={styles.metaText}>{product.rating.toFixed(1)}</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>

        <Text style={styles.price}>{formatCurrency(product.price)}</Text>

        <View style={styles.qtyControl}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQty(q => Math.max(1, q - 1))}
            activeOpacity={0.75}
          >
            <Ionicons name="remove" size={18} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQty(q => q + 1)}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnCart}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.btnCartText}>
              Add To Cart {cartQty > 0 ? `(${cartQty})` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOrder}
            onPress={handlePesanSekarang}
            activeOpacity={0.85}
          >
            <Text style={styles.btnOrderText}>Pesan Sekarang!</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems:     'center',
  },

  backBtn: {
    position:        'absolute',
    left:            20,
    zIndex:          10,
    backgroundColor: Colors.white,
    borderRadius:    20,
    padding:         8,
    shadowColor:     '#000',
    shadowOpacity:   0.1,
    shadowOffset:    { width: 0, height: 2 },
    shadowRadius:    4,
    elevation:       3,
  },

  image: {
    width,
    height: width * 0.75,
  },

  content: {
    padding: 24,
    gap:     12,
  },
  name: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  metaText: {
    ...Typography.bodySm,
    color: Colors.text.secondary,
  },
  dot: {
    width:           4,
    height:          4,
    borderRadius:    2,
    backgroundColor: Colors.text.placeholder,
  },
  description: {
    ...Typography.bodyLg,
    color:      Colors.text.secondary,
    lineHeight: 24,
  },
  categoryChip: {
    alignSelf:         'flex-start',
    backgroundColor:   Colors.primary.light,
    paddingVertical:   6,
    paddingHorizontal: 14,
    borderRadius:      20,
  },
  categoryText: {
    ...Typography.labelSm,
    color: Colors.primary.default,
    textTransform: 'capitalize',
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
    gap:               12,
  },
  price: {
    ...Typography.h3,
    color: Colors.primary.default,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems:    'center',
    alignSelf:     'flex-end',
    gap:           12,
  },
  qtyBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius:    8,
    width:           32,
    height:          32,
    alignItems:      'center',
    justifyContent:  'center',
  },
  qtyText: {
    ...Typography.h4,
    color:     Colors.text.primary,
    minWidth:  24,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap:           10,
  },
  btnCart: {
    flex:            1,
    backgroundColor: Colors.secondary.default,
    borderRadius:    12,
    paddingVertical: 14,
    alignItems:      'center',
  },
  btnCartText: {
    ...Typography.button,
    color: Colors.white,
  },
  btnOrder: {
    flex:            1,
    backgroundColor: Colors.primary.default,
    borderRadius:    12,
    paddingVertical: 14,
    alignItems:      'center',
    shadowColor:     Colors.primary.default,
    shadowOpacity:   0.35,
    shadowOffset:    { width: 0, height: 4 },
    shadowRadius:    8,
    elevation:       4,
  },
  btnOrderText: {
    ...Typography.button,
    color: Colors.white,
  },
});