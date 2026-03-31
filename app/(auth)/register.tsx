import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [namaLengkap,    setNamaLengkap]    = useState('');
  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [konfirmasiPass, setKonfirmasiPass] = useState('');
  const [showPassword,   setShowPassword]   = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [isLoading,      setIsLoading]      = useState(false);
  const [errors,         setErrors]         = useState<Record<string, string>>({});

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 450, useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, friction: 7, tension: 60, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!namaLengkap.trim()) {
      newErrors.namaLengkap = 'Nama Lengkap Tidak Boleh Kosong Ya!';
    } else if (namaLengkap.trim().length < 3) {
      newErrors.namaLengkap = 'Nama Minimal 3 Karakter Ya!';
    }

    if (!email.trim()) {
      newErrors.email = 'Email Tidak Boleh Kosong Ya!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format Email Kamu Salah Nih!';
    }

    if (!password) {
      newErrors.password = 'Password Tidak Boleh Kosong Ya!';
    } else if (password.length < 6) {
      newErrors.password = 'Password Minimal 6 Karakter Ya!';
    }

    if (!konfirmasiPass) {
      newErrors.konfirmasiPass = 'Konfirmasi Password Tidak Boleh Kosong Ya!';
    } else if (password !== konfirmasiPass) {
      newErrors.konfirmasiPass = 'Password Kamu Ngga Sama Nih!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1200)); 
      router.replace('/(user)');
    } catch (err) {
      setErrors({ general: 'Pendaftaran Gagal. Coba Lagi Ya!' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" backgroundColor={Colors.background.default} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={require('@/assets/images/sate-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Daftar Dulu</Text>
          <Text style={styles.subtitle}>
            Daftarin Akun Kamu Disini, Isi Yang Lengkap Ya Data Yang Aku Minta, Jangan Sampe Ngga!
          </Text>

          {errors.general ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={Colors.status.error} />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          ) : null}

          <View style={styles.formWrapper}>

            <View>
              <View style={[
                styles.inputWrapper,
                errors.namaLengkap ? styles.inputError : null,
              ]}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nama Lengkap"
                  placeholderTextColor={Colors.text.placeholder}
                  value={namaLengkap}
                  onChangeText={(val) => { setNamaLengkap(val); clearError('namaLengkap'); }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {errors.namaLengkap ? <ErrorMsg message={errors.namaLengkap} /> : null}
            </View>

            <View>
              <View style={[
                styles.inputWrapper,
                errors.email ? styles.inputError : null,
              ]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Colors.text.placeholder}
                  value={email}
                  onChangeText={(val) => { setEmail(val); clearError('email'); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? <ErrorMsg message={errors.email} /> : null}
            </View>

            <View>
              <View style={[
                styles.inputWrapper,
                errors.password ? styles.inputError : null,
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor={Colors.text.placeholder}
                  value={password}
                  onChangeText={(val) => { setPassword(val); clearError('password'); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={Colors.text.placeholder}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <ErrorMsg message={errors.password} /> : null}
            </View>

            <View>
              <View style={[
                styles.inputWrapper,
                errors.konfirmasiPass ? styles.inputError : null,
              ]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Konfirmasi Password"
                  placeholderTextColor={Colors.text.placeholder}
                  value={konfirmasiPass}
                  onChangeText={(val) => { setKonfirmasiPass(val); clearError('konfirmasiPass'); }}
                  secureTextEntry={!showKonfirmasi}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowKonfirmasi(prev => !prev)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showKonfirmasi ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={Colors.text.placeholder}
                  />
                </TouchableOpacity>
              </View>
              {errors.konfirmasiPass ? <ErrorMsg message={errors.konfirmasiPass} /> : null}
            </View>

          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.btnPrimaryText}>Daftar!</Text>
            )}
          </TouchableOpacity>

          {/* ── Link Login ── */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Udah Punya Akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Masuk</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ErrorMsg({ message }: { message: string }) {
  return (
    <View style={styles.errorRow}>
      <Ionicons name="alert-circle" size={13} color={Colors.status.error} />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow:          1,
    backgroundColor:   Colors.background.default,
    paddingHorizontal: 28,
  },

  logoWrapper: {
    alignItems:   'center',
    marginBottom: 16,
  },
  logo: {
    width:  width * 0.28,
    height: width * 0.28,
  },

  title: {
    ...Typography.h1,
    color:        Colors.text.primary,
    textAlign:    'center',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color:        Colors.text.secondary,
    textAlign:    'center',
    marginBottom: 28,
  },

  errorBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             8,
    backgroundColor: '#FFF0F0',
    borderRadius:    10,
    padding:         12,
    marginBottom:    16,
    borderWidth:     1,
    borderColor:     '#FFCDD2',
  },
  errorBannerText: {
    ...Typography.labelSm,
    color: Colors.status.error,
    flex:  1,
  },

  formWrapper: {
    gap:          14,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection:     'row',
    alignItems:        'center',
    borderWidth:       1.5,
    borderColor:       Colors.border.default,
    borderRadius:      12,
    paddingHorizontal: 14,
    backgroundColor:   Colors.background.default,
    height:            52,
  },
  inputError: {
    borderColor: Colors.status.error,
  },
  inputIcon: {
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
    marginTop:     5,
    marginLeft:    4,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.status.error,
  },

  btnPrimary: {
    backgroundColor: Colors.primary.default,
    borderRadius:    12,
    paddingVertical: 16,
    alignItems:      'center',
    marginBottom:    20,
    shadowColor:     Colors.primary.default,
    shadowOpacity:   0.35,
    shadowOffset:    { width: 0, height: 4 },
    shadowRadius:    8,
    elevation:       4,
  },
  btnPrimaryText: {
    ...Typography.button,
    color: Colors.primary.contrast,
  },
  btnDisabled: {
    opacity: 0.65,
  },

  loginRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
  },
  loginText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  loginLink: {
    ...Typography.body,
    color:              Colors.text.link,
    fontWeight:         '600',
    textDecorationLine: 'underline',
  },
});