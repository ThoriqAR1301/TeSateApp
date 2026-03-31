import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { APP_INFO } from '@/constants/Config';

const { width } = Dimensions.get('window');

export default function StartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const imageAnim   = useRef(new Animated.Value(-30)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const textAnim    = useRef(new Animated.Value(30)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const btnAnim     = useRef(new Animated.Value(30)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.spring(imageAnim, {
          toValue: 0, friction: 7, tension: 60, useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(textAnim, {
          toValue: 0, friction: 7, tension: 60, useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(btnAnim, {
          toValue: 0, friction: 7, tension: 60, useNativeDriver: true,
        }),
        Animated.timing(btnOpacity, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <Animated.View
        style={[
          styles.imageWrapper,
          {
            transform: [{ translateY: imageAnim }],
            opacity:   imageOpacity,
          },
        ]}
      >
        <Image
          source={require('@/assets/images/sate-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.textWrapper,
          {
            transform: [{ translateY: textAnim }],
            opacity:   textOpacity,
          },
        ]}
      >
        <Text style={styles.title}>{APP_INFO.TAGLINE}</Text>
        <Text style={styles.subtitle}>
          Pengantaran Ke Rumah, Dan Reservasi Online Untuk {APP_INFO.OWNER}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            transform: [{ translateY: btnAnim }],
            opacity:   btnOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Pesan Sekarang!</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Sudah Punya Akun? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.background.default,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 28,
  },

  imageWrapper: {
    alignItems:    'center',
    marginBottom:  32,
  },
  image: {
    width:  width * 0.65,
    height: width * 0.65,
  },

  textWrapper: {
    alignItems:    'center',
    marginBottom:  40,
    paddingHorizontal: 8,
  },
  title: {
    ...Typography.h1,
    color:       Colors.text.primary,
    textAlign:   'center',
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.bodyLg,
    color:     Colors.text.secondary,
    textAlign: 'center',
  },

  buttonWrapper: {
    width:      '100%',
    alignItems: 'center',
    gap:        16,
  },
  btnPrimary: {
    width:           '100%',
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

  loginRow: {
    flexDirection: 'row',
    alignItems:    'center',
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