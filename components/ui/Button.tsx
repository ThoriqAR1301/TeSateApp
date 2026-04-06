import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize    = 'sm' | 'md' | 'lg';

type ButtonProps = {
  label:       string;
  onPress:     () => void;
  variant?:    ButtonVariant;
  size?:       ButtonSize;
  isLoading?:  boolean;
  disabled?:   boolean;
  iconLeft?:   keyof typeof Ionicons.glyphMap;
  iconRight?:  keyof typeof Ionicons.glyphMap;
  style?:      ViewStyle;
  textStyle?:  TextStyle;
  fullWidth?:  boolean;
};

const variantStyles: Record<ButtonVariant, {
  container: ViewStyle;
  text:      TextStyle;
}> = {
  primary: {
    container: {
      backgroundColor: Colors.primary.default,
      shadowColor:     Colors.primary.default,
      shadowOpacity:   0.35,
      shadowOffset:    { width: 0, height: 4 },
      shadowRadius:    8,
      elevation:       4,
    },
    text: { color: Colors.white },
  },
  secondary: {
    container: {
      backgroundColor: Colors.secondary.default,
      shadowColor:     '#000',
      shadowOpacity:   0.15,
      shadowOffset:    { width: 0, height: 4 },
      shadowRadius:    8,
      elevation:       4,
    },
    text: { color: Colors.white },
  },
  outline: {
    container: {
      backgroundColor: Colors.transparent,
      borderWidth:     1.5,
      borderColor:     Colors.primary.default,
    },
    text: { color: Colors.primary.default },
  },
  ghost: {
    container: {
      backgroundColor: Colors.transparent,
    },
    text: { color: Colors.primary.default },
  },
};

const sizeStyles: Record<ButtonSize, {
  container: ViewStyle;
  text:      TextStyle;
  iconSize:  number;
}> = {
  sm: {
    container: { paddingVertical: 9,  paddingHorizontal: 16, borderRadius: 8  },
    text:      { fontSize: 13 },
    iconSize:  15,
  },
  md: {
    container: { paddingVertical: 13, paddingHorizontal: 20, borderRadius: 12 },
    text:      { fontSize: 14 },
    iconSize:  17,
  },
  lg: {
    container: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12 },
    text:      { fontSize: 15 },
    iconSize:  19,
  },
};

export default function Button({
  label,
  onPress,
  variant   = 'primary',
  size      = 'md',
  isLoading = false,
  disabled  = false,
  iconLeft,
  iconRight,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const vStyle   = variantStyles[variant];
  const sStyle   = sizeStyles[size];
  const isDisabled = disabled || isLoading;
  const iconColor  = variant === 'outline' || variant === 'ghost'
    ? Colors.primary.default
    : Colors.white;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        styles.base,
        vStyle.container,
        sStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost'
            ? Colors.primary.default
            : Colors.white}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {iconLeft && (
            <Ionicons name={iconLeft} size={sStyle.iconSize} color={iconColor} />
          )}
          <Text style={[styles.text, vStyle.text, sStyle.text, textStyle]}>
            {label}
          </Text>
          {iconRight && (
            <Ionicons name={iconRight} size={sStyle.iconSize} color={iconColor} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  inner: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           7,
  },
  text: {
    ...Typography.button,
  },
});