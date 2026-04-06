import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store';

export function useAuth() {
  const {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    loginAdmin,
    register,
    logout,
    clearError,
  } = useAuthStore();

  return {
    user,
    isLoggedIn,
    isLoading,
    error,
    isAdmin:    user?.role === 'admin',
    isUser:     user?.role === 'user',
    login,
    loginAdmin,
    register,
    logout,
    clearError,
  };
}

export function useProtectedRoute() {
  const { isLoggedIn, user, } = useAuthStore();
  const segments              = useSegments();
  const router                = useRouter();

  useEffect(() => {
    const inAuthGroup  = segments[0] === '(auth)';
    const inUserGroup  = segments[0] === '(user)';
    const inAdminGroup = segments[0] === '(admin)';

    if (!isLoggedIn) {
      if (!inAuthGroup) {
        router.replace('/(auth)/start');
      }
      return;
    }

    if (user?.role === 'admin') {
      if (!inAdminGroup) {
        router.replace('/(admin)');
      }
      return;
    }

    if (user?.role === 'user') {
      if (inAuthGroup) {
        router.replace('/(user)');
      }
      return;
    }
  }, [isLoggedIn, user, segments]);
}

export function useHydrate() {
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);
}

export default useAuth;