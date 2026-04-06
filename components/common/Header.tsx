import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type HeaderProps = {
  title:       string;
  showBack?:   boolean;
  rightIcon?:  keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function Header({
  title,
  showBack     = false,
  rightIcon,
  onRightPress,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.side}>
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={22} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 20,
    paddingBottom:     12,
    backgroundColor:   Colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  side: {
    width: 40,
  },
  title: {
    ...Typography.h4,
    color:  Colors.text.primary,
    flex:   1,
    textAlign: 'center',
  },
  iconBtn: {
    padding: 4,
  },
});