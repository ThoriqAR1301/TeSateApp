import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PAYMENT_METHODS, PaymentMethodId } from '@/constants/Config';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type PaymentOptionProps = {
  selected:  PaymentMethodId;
  onChange:  (id: PaymentMethodId) => void;
};

export default function PaymentOption({ selected, onChange }: PaymentOptionProps) {
  return (
    <View style={styles.container}>
      {PAYMENT_METHODS.map((method) => {
        const isActive = selected === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.option, { backgroundColor: method.color }]}
            onPress={() => onChange(method.id as PaymentMethodId)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={
                method.id === 'cash' ? 'cash-outline'
                : method.id === 'ovo' ? 'wallet-outline'
                : 'qr-code-outline'
              }
              size={22}
              color={Colors.white}
            />

            <Text style={styles.label}>{method.label}</Text>

            <View style={[styles.radio, isActive && styles.radioActive]}>
              {isActive && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  option: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   16,
    paddingHorizontal: 20,
    borderRadius:      14,
    gap:               12,
  },
  label: {
    ...Typography.label,
    color: Colors.white,
    flex:  1,
  },
  radio: {
    width:           22,
    height:          22,
    borderRadius:    11,
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.5)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  radioActive: {
    borderColor: Colors.white,
  },
  radioDot: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: Colors.white,
  },
});