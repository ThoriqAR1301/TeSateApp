import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
};

function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

function CartButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.cartButton}
      onPress={() => router.push('/(user)/cart')}
      activeOpacity={0.85}
    >
      <Ionicons name="cart" size={26} color={Colors.white} />
    </TouchableOpacity>
  );
}

export default function UserLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown:     false,
        tabBarShowLabel: true,
        tabBarActiveTintColor:   Colors.primary.default,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          height:          60 + insets.bottom,
          paddingBottom:   insets.bottom + 4,
          paddingTop:      8,
          backgroundColor: Colors.background.default,
          borderTopColor:  Colors.border.default,
          borderTopWidth:  1,
          elevation:       8,
          shadowColor:     '#000',
          shadowOpacity:   0.06,
          shadowOffset:    { width: 0, height: -2 },
          shadowRadius:    6,
        },
        tabBarLabelStyle: {
          fontSize:   10,
          fontWeight: '500',
          marginTop:  2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="informasi"
        options={{
          title: 'Informasi',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="information-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: () => <CartButton />,
        }}
      />

      <Tabs.Screen
        name="notifikasi"
        options={{
          title: 'Notifikasi',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="notifications-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Akun',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen name="detail/[id]" options={{ href: null }} />
      <Tabs.Screen name="payment"     options={{ href: null }} />
      <Tabs.Screen name="waiting"     options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    width:           58,
    height:          58,
    borderRadius:    29,
    backgroundColor: Colors.primary.default,
    justifyContent:  'center',
    alignItems:      'center',
    marginBottom:    20,
    shadowColor:     Colors.primary.default,
    shadowOpacity:   0.4,
    shadowOffset:    { width: 0, height: 4 },
    shadowRadius:    8,
    elevation:       6,
  },
});