import { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router  = useRouter();

  const scaleAnim   = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue:         1,
        friction:        5,
        tension:         80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue:         1,
        duration:        500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/(auth)/start');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background.default} />

      <Animated.View
        style={[
          styles.imageWrapper,
          {
            transform: [{ scale: scaleAnim }],
            opacity:   opacityAnim,
          },
        ]}
      >
        <Image
          source={require('@/assets/images/sate-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.background.default,
    justifyContent:  'center',
    alignItems:      'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems:     'center',
  },
  image: {
    width:  width * 0.55,   
    height: width * 0.55,
  },
});