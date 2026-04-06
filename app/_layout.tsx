import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '@/constants/Colors';
import { useProtectedRoute, useHydrate } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  useHydrate();

  useProtectedRoute();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"   />  
      <Stack.Screen name="(auth)"  />  
      <Stack.Screen name="(user)"  />  
      <Stack.Screen name="(admin)" />  
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={Colors.background.default} />
        <RootLayoutInner />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}