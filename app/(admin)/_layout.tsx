import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"     />   
      <Stack.Screen name="menu-list" />   
      <Stack.Screen name="orders"    />   
    </Stack>
  );
}