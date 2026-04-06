import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type EmptyStateProps = {
  title:       string;
  subtitle?:   string;
  icon?:       keyof typeof Ionicons.glyphMap;
  image?:      ImageSourcePropType;
};

export default function EmptyState({
  title,
  subtitle,
  icon  = 'alert-circle-outline',
  image,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={48} color={Colors.empty.icon} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
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
    borderWidth:    2,
    borderColor:    Colors.empty.icon,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   4,
  },
  image: {
    width:        200,
    height:       200,
    marginBottom: 8,
  },
  title: {
    ...Typography.h4,
    color:     Colors.empty.text,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color:     Colors.empty.text,
    textAlign: 'center',
  },
});