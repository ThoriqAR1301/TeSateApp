import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { EmptyState } from '@/components';

export default function InformasiScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Informasi</Text>
      </View>

      <EmptyState
        title="Belum Ada Informasi Bang..."
        icon="alert-circle-outline"
      />
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
    alignItems:        'center',
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
});