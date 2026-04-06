import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type InputProps = TextInputProps & {
  label?:       string;
  iconLeft?:    keyof typeof Ionicons.glyphMap;
  error?:       string;
  containerStyle?: ViewStyle;
  isPassword?:  boolean;
};

export default function Input({
  label,
  iconLeft,
  error,
  containerStyle,
  isPassword = false,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused,    setIsFocused]    = useState(false);

  const hasError    = !!error;
  const borderColor = hasError
    ? Colors.status.error
    : isFocused
      ? Colors.border.focus
      : Colors.border.default;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, { borderColor }]}>
        {iconLeft && (
          <Ionicons
            name={iconLeft}
            size={18}
            color={isFocused ? Colors.primary.default : Colors.text.placeholder}
            style={styles.iconLeft}
          />
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.text.placeholder}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(p => !p)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={Colors.text.placeholder}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={Colors.status.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.text.primary,
  },
  inputWrapper: {
    flexDirection:     'row',
    alignItems:        'center',
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 14,
    backgroundColor:   Colors.background.default,
    height:            52,
  },
  iconLeft: {
    marginRight: 10,
  },
  input: {
    flex:    1,
    ...Typography.body,
    color:   Colors.text.primary,
    padding: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.status.error,
  },
});