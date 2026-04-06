import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type ErrorViewProps = {
  message:   string;
  onRetry?:  () => void;
};

export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="cloud-offline-outline" size={48} color={Colors.status.error} />
      </View>

      <Text style={styles.title}>Aduh, Ada Yang Error!</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh-outline" size={18} color={Colors.white} />
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrapper: {
    width:          80,
    height:         80,
    borderRadius:   40,
    backgroundColor: '#FFF5F5',
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   4,
  },
  title: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  message: {
    ...Typography.body,
    color:     Colors.text.secondary,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             8,
    backgroundColor: Colors.primary.default,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius:    12,
    marginTop:       8,
    shadowColor:     Colors.primary.default,
    shadowOpacity:   0.3,
    shadowOffset:    { width: 0, height: 3 },
    shadowRadius:    6,
    elevation:       3,
  },
  retryText: {
    ...Typography.button,
    color: Colors.white,
  },
});