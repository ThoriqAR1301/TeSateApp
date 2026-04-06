import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { MENU_CATEGORIES } from '@/constants/Config';
import { useAuth } from '@/hooks/useAuth';

type FormData = {
  namaMakanan:  string;
  harga:        string;
  stock:        string;
  waktuMasak:   string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function FormField({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
}: {
  placeholder:  string;
  value:        string;
  onChangeText: (v: string) => void;
  error?:       string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}) {
  return (
    <View style={fieldStyles.wrapper}>
      <View style={[fieldStyles.inputBox, error ? fieldStyles.inputError : null]}>
        <TextInput
          style={fieldStyles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
      {error ? <Text style={fieldStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper:    { gap: 4 },
  inputBox: {
    borderWidth:       1.5,
    borderColor:       Colors.border.default,
    borderRadius:      12,
    paddingHorizontal: 16,
    height:            52,
    justifyContent:    'center',
    backgroundColor:   Colors.background.default,
  },
  inputError: { borderColor: Colors.status.error },
  input: {
    ...Typography.body,
    color:   Colors.text.primary,
    padding: 0,
  },
  errorText: {
    ...Typography.caption,
    color:      Colors.status.error,
    marginLeft: 4,
  },
});

export default function AdminAddMenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [activeCategory, setActiveCategory] = useState('makanan');
  const [isLoading,      setIsLoading]      = useState(false);

  const [form, setForm] = useState<FormData>({
    namaMakanan: '',
    harga:       '',
    stock:       '',
    waktuMasak:  '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.namaMakanan.trim())
      newErrors.namaMakanan = 'Nama makanan wajib diisi!';
    if (!form.harga.trim() || isNaN(Number(form.harga)))
      newErrors.harga = 'Harga harus berupa angka!';
    if (!form.stock.trim() || isNaN(Number(form.stock)))
      newErrors.stock = 'Stock harus berupa angka!';
    if (!form.waktuMasak.trim() || isNaN(Number(form.waktuMasak)))
      newErrors.waktuMasak = 'Waktu masak harus berupa angka!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 800));
      Alert.alert('Berhasil!', `Menu "${form.namaMakanan}" berhasil ditambahkan!`);
      setForm({ namaMakanan: '', harga: '', stock: '', waktuMasak: '' });
    } catch {
      Alert.alert('Gagal', 'Gagal Menambahkan Menu. Coba Lagi Ya!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin Mau Keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar', style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/start');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.greeting}>Sore, {user?.nama ?? 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={Colors.status.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {MENU_CATEGORIES.filter(c => c.id !== 'rekomendasi').map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.formCard}>
          <FormField
            placeholder="Masukan Nama Makanan"
            value={form.namaMakanan}
            onChangeText={v => setField('namaMakanan', v)}
            error={errors.namaMakanan}
          />
          <FormField
            placeholder="Masukan Harga"
            value={form.harga}
            onChangeText={v => setField('harga', v)}
            error={errors.harga}
            keyboardType="numeric"
          />
          <FormField
            placeholder="Masukan Stock"
            value={form.stock}
            onChangeText={v => setField('stock', v)}
            error={errors.stock}
            keyboardType="numeric"
          />
          <FormField
            placeholder="Masukan Waktu Masak (Mins)"
            value={form.waktuMasak}
            onChangeText={v => setField('waktuMasak', v)}
            error={errors.waktuMasak}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.submitBtn, isLoading && { opacity: 0.65 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Masukin Menu!</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => router.push('/(admin)/orders')}
          activeOpacity={0.85}
        >
          <Text style={styles.orderBtnText}>Liat Pesenan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuListBtn}
          onPress={() => router.push('/(admin)/menu-list')}
          activeOpacity={0.85}
        >
          <Text style={styles.menuListBtnText}>Kelola Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.background.default,
  },

  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 24,
    paddingBottom:     14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  greeting: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  logoutBtn: { padding: 4 },

  content: {
    paddingTop: 20,
    gap:        16,
  },

  categoryRow: {
    paddingHorizontal: 24,
    gap:               8,
  },
  chip: {
    paddingVertical:   8,
    paddingHorizontal: 20,
    borderRadius:      20,
    backgroundColor:   Colors.primary.light,
  },
  chipActive: {
    backgroundColor: Colors.primary.default,
  },
  chipLabel: {
    ...Typography.labelSm,
    color: Colors.primary.default,
  },
  chipLabelActive: {
    color: Colors.white,
  },

  formCard: {
    marginHorizontal: 24,
    gap:              12,
  },

  submitBtn: {
    backgroundColor: Colors.primary.default,
    borderRadius:    12,
    paddingVertical: 16,
    alignItems:      'center',
    marginTop:       4,
    shadowColor:     Colors.primary.default,
    shadowOpacity:   0.35,
    shadowOffset:    { width: 0, height: 4 },
    shadowRadius:    8,
    elevation:       4,
  },
  submitBtnText: {
    ...Typography.button,
    color: Colors.white,
  },

  orderBtn: {
    marginHorizontal: 24,
    backgroundColor:  Colors.secondary.default,
    borderRadius:     12,
    paddingVertical:  16,
    alignItems:       'center',
    shadowColor:      '#000',
    shadowOpacity:    0.12,
    shadowOffset:     { width: 0, height: 3 },
    shadowRadius:     6,
    elevation:        3,
  },
  orderBtnText: {
    ...Typography.button,
    color: Colors.white,
  },

  menuListBtn: {
    marginHorizontal: 24,
    backgroundColor:  Colors.transparent,
    borderRadius:     12,
    paddingVertical:  14,
    alignItems:       'center',
    borderWidth:      1.5,
    borderColor:      Colors.primary.default,
  },
  menuListBtnText: {
    ...Typography.button,
    color: Colors.primary.default,
  },
});