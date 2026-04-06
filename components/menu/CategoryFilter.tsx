import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MENU_CATEGORIES } from '@/constants/Config';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

type CategoryFilterProps = {
  active:   string;
  onChange: (id: string) => void;
};

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {MENU_CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onChange(cat.id)}
            activeOpacity={0.75}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    gap:               8,
    paddingVertical:   4,
  },
  chip: {
    paddingVertical:   8,
    paddingHorizontal: 18,
    borderRadius:      20,
    backgroundColor:   Colors.primary.light,
    borderWidth:       1.5,
    borderColor:       Colors.transparent,
  },
  chipActive: {
    backgroundColor: Colors.primary.default,
    borderColor:     Colors.primary.default,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.primary.default,
  },
  labelActive: {
    color: Colors.white,
  },
});