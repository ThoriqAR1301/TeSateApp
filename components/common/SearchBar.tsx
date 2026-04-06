import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type SearchBarProps = {
  value:        string;
  onChangeText: (text: string) => void;
  onClear?:     () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Cari Kesukaan Kamu!',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={18}
        color={Colors.text.placeholder}
        style={styles.iconLeft}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.placeholder}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color={Colors.text.placeholder} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   Colors.background.soft,
    borderRadius:      12,
    paddingHorizontal: 14,
    height:            48,
    marginHorizontal:  28,
    borderWidth:       1.5,
    borderColor:       Colors.border.default,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex:    1,
    ...Typography.body,
    color:   Colors.text.primary,
    padding: 0,
  },
  clearBtn: {
    padding: 2,
  },
});