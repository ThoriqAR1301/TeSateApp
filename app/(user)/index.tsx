import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { APP_INFO } from '@/constants/Config';
import { useMenu } from '@/hooks/useMenu';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useOrder';
import {
  MenuCard,
  CategoryFilter,
  SearchBar,
  ErrorView,
  EmptyState,
} from '@/components';
import { Product } from '@/services/menuService';

function SkeletonCard() {
  return (
    <View style={skeleton.card}>
      <View style={skeleton.image} />
      <View style={skeleton.body}>
        <View style={skeleton.line} />
        <View style={[skeleton.line, { width: '60%' }]} />
        <View style={skeleton.bottom} />
      </View>
    </View>
  );
}

const skeleton = StyleSheet.create({
  card: {
    width:           '48%',
    backgroundColor: Colors.background.card,
    borderRadius:    14,
    overflow:        'hidden',
    elevation:       2,
  },
  image: {
    width:           '100%',
    height:          110,
    backgroundColor: Colors.border.default,
  },
  body: {
    padding: 10,
    gap:     8,
  },
  line: {
    height:          12,
    width:           '85%',
    backgroundColor: Colors.border.default,
    borderRadius:    6,
  },
  bottom: {
    height:          28,
    backgroundColor: Colors.border.default,
    borderRadius:    8,
    marginTop:       4,
  },
});

type BerandaHeaderProps = {
  userName:      string;
  totalItems:    number;
  searchKeyword: string;
  onSearch:      (text: string) => void;
  onClearSearch: () => void;
  activeCategory:string;
  onCategoryChange: (id: string) => void;
  onCartPress:   () => void;
};

function BerandaHeader({
  userName,
  totalItems,
  searchKeyword,
  onSearch,
  onClearSearch,
  activeCategory,
  onCategoryChange,
  onCartPress,
}: BerandaHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[header.container, { paddingTop: insets.top + 12 }]}>
      <View style={header.topRow}>
        <View style={header.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
          <Text style={header.location}>{APP_INFO.LOCATION}</Text>
        </View>
        <TouchableOpacity style={header.cartBtn} onPress={onCartPress} activeOpacity={0.8}>
          <Ionicons name="cart-outline" size={22} color={Colors.text.primary} />
          {totalItems > 0 && (
            <View style={header.badge}>
              <Text style={header.badgeText}>
                {totalItems > 99 ? '99+' : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={header.greeting}>
        Sore, {userName}
      </Text>

      <View style={{ marginTop: 14 }}>
        <SearchBar
          value={searchKeyword}
          onChangeText={onSearch}
          onClear={onClearSearch}
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <CategoryFilter
          active={activeCategory}
          onChange={onCategoryChange}
        />
      </View>
    </View>
  );
}

const header = StyleSheet.create({
  container: {
    backgroundColor:   Colors.background.default,
    paddingBottom:     14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  topRow: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 28,
    marginBottom:      6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  location: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  cartBtn: {
    position: 'relative',
    padding:  4,
  },
  badge: {
    position:        'absolute',
    top:             -2,
    right:           -2,
    backgroundColor: Colors.status.error,
    borderRadius:    10,
    minWidth:        18,
    height:          18,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    ...Typography.caption,
    color:      Colors.white,
    fontWeight: '700',
    fontSize:   10,
  },
  greeting: {
    ...Typography.h2,
    color:             Colors.text.primary,
    paddingHorizontal: 28,
  },
});

export default function BerandaScreen() {
  const router = useRouter();
  const { user }     = useAuth();
  const { totalItems } = useCart();

  const {
    displayProducts,
    activeCategory,
    setActiveCategory,
    isLoading,
    error,
    refetch,
    searchState,
  } = useMenu();

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <MenuCard product={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: Product) => item.id.toString(),
    []
  );

  if (isLoading && displayProducts.length === 0) {
    return (
      <View style={styles.container}>
        <BerandaHeader
          userName={user?.nama ?? 'Kamu'}
          totalItems={totalItems}
          searchKeyword={searchState.keyword}
          onSearch={searchState.search}
          onClearSearch={searchState.clearSearch}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onCartPress={() => router.push('/(user)/cart')}
        />
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </View>
    );
  }

  if (error && displayProducts.length === 0) {
    return (
      <View style={styles.container}>
        <BerandaHeader
          userName={user?.nama ?? 'Kamu'}
          totalItems={totalItems}
          searchKeyword={searchState.keyword}
          onSearch={searchState.search}
          onClearSearch={searchState.clearSearch}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onCartPress={() => router.push('/(user)/cart')}
        />
        <ErrorView message={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <FlatList
        data={displayProducts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={
          <BerandaHeader
            userName={user?.nama ?? 'Kamu'}
            totalItems={totalItems}
            searchKeyword={searchState.keyword}
            onSearch={searchState.search}
            onClearSearch={searchState.clearSearch}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onCartPress={() => router.push('/(user)/cart')}
          />
        }

        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <EmptyState
              title="Menu Belum Ada Nih"
              subtitle="Coba Cari Yang Lain Atau Refresh Dulu Ya!"
              icon="restaurant-outline"
            />
          </View>
        }

        ListFooterComponent={
          isLoading && displayProducts.length > 0
            ? <ActivityIndicator
                color={Colors.primary.default}
                style={{ marginVertical: 16 }}
              />
            : null
        }

        refreshControl={
          <RefreshControl
            refreshing={isLoading && displayProducts.length > 0}
            onRefresh={refetch}
            tintColor={Colors.primary.default}
            colors={[Colors.primary.default]}
          />
        }

        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.background.default,
  },
  listContent: {
    paddingHorizontal: 28,
    paddingTop:        16,
    paddingBottom:     100,
    gap:               12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  skeletonGrid: {
    flexDirection:     'row',
    flexWrap:          'wrap',
    justifyContent:    'space-between',
    paddingHorizontal: 28,
    paddingTop:        16,
    gap:               12,
  },
  emptyWrapper: {
    height:         300,
    justifyContent: 'center',
  },
});