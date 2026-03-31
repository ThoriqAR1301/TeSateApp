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

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [rememberMe,     setRememberMe]     = useState(false);
  const [showPassword,   setShowPassword]   = useState(false);
  const [isLoading,      setIsLoading]      = useState(false);
  const [errorMsg,       setErrorMsg]       = useState('');

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
    if (!email.trim()) {
      setErrorMsg('Email Tidak Boleh Kosong Ya!');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Format Email Kamu Salah Nih!');
      return false;
    }
    if (!password) {
      setErrorMsg('Password Tidak Boleh Kosong Ya!');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password Minimal 6 Karakter Ya!');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1200)); 
      router.replace('/(user)');
    } catch (err) {
      setErrorMsg('Login Gagal. Cek Email & Password Kamu Ya!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAdmin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1200)); 
      router.replace('/(admin)');
    } catch (err) {
      setErrorMsg('Login Admin Gagal. Cek Kredensial Kamu Ya!');
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

          <Text style={styles.title}>Login Dulu Kali Ah</Text>
          <Text style={styles.subtitle}>
            Masuk Pake Akun Kamu Yang Udah Didaftarin Ya!
          </Text>

          <View style={styles.formWrapper}>

            <View style={styles.inputWrapper}>
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
                onChangeText={(val) => { setEmail(val); setErrorMsg(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
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
                onChangeText={(val) => { setPassword(val); setErrorMsg(''); }}
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

            {errorMsg ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color={Colors.status.error} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.optionRow}>
              <TouchableOpacity
                style={styles.rememberRow}
                onPress={() => setRememberMe(prev => !prev)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxActive,
                ]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  )}
                </View>
                <Text style={styles.rememberText}>Ingatin Akunku</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotText}>Lupa Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.btnPrimaryText}>Masuk!</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAdmin, isLoading && styles.btnDisabled]}
              onPress={handleLoginAdmin}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.btnAdminText}>Masuk Admin!</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Belum Punya Akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Daftar</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  logo: {
    width:  width * 0.30,
    height: width * 0.30,
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
    marginBottom: 36,
  },

  formWrapper: {
    gap: 14,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection:   'row',
    alignItems:      'center',
    borderWidth:     1.5,
    borderColor:     Colors.border.default,
    borderRadius:    12,
    paddingHorizontal: 14,
    backgroundColor: Colors.background.default,
    height:          52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex:     1,
    ...Typography.body,
    color:    Colors.text.primary,
    padding:  0,
  },
  eyeIcon: {
    padding: 4,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
    marginTop:     -4,
  },
  errorText: {
    ...Typography.labelSm,
    color: Colors.status.error,
  },

  optionRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginTop:      4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
  },
  checkbox: {
    width:        18,
    height:       18,
    borderRadius: 4,
    borderWidth:  1.5,
    borderColor:  Colors.border.default,
    alignItems:   'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary.default,
    borderColor:     Colors.primary.default,
  },
  rememberText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  forgotText: {
    ...Typography.body,
    color:      Colors.text.link,
    fontWeight: '600',
  },

  btnGroup: {
    gap: 12,
    marginBottom: 20,
  },
  btnPrimary: {
    backgroundColor: Colors.primary.default,
    borderRadius:    12,
    paddingVertical: 16,
    alignItems:      'center',
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
  btnAdmin: {
    backgroundColor: Colors.secondary.default,
    borderRadius:    12,
    paddingVertical: 16,
    alignItems:      'center',
    shadowColor:     '#000',
    shadowOpacity:   0.15,
    shadowOffset:    { width: 0, height: 4 },
    shadowRadius:    8,
    elevation:       4,
  },
  btnAdminText: {
    ...Typography.button,
    color: Colors.secondary.contrast,
  },
  btnDisabled: {
    opacity: 0.65,
  },

  registerRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
  },
  registerText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  registerLink: {
    ...Typography.body,
    color:              Colors.text.link,
    fontWeight:         '600',
    textDecorationLine: 'underline',
  },
});