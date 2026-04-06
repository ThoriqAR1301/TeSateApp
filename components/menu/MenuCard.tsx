import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { Product } from '@/services/menuService';
import { useCart } from '@/hooks';
import { formatCurrency } from '@/utils/formatCurrency';

type MenuCardProps = {
  product: Product;
};

const CARD_WIDTH = (Dimensions.get('window').width - 28 * 2 - 12) / 2;

export default function MenuCard({ product }: MenuCardProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/(user)/detail/${product.id}`)} activeOpacity={0.88}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart} activeOpacity={0.8}>
            <Ionicons name="cart-outline" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.background.card,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
  },
  info: {
    padding: 10,
    gap: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    ...Typography.price,
    color: Colors.text.primary,
  },
  cartBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius: 8,
    padding: 7,
    shadowColor: Colors.primary.default,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
});
