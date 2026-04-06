import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService, { User, LoginPayload, RegisterPayload } from '@/services/authService';
import { STORAGE_KEYS } from '@/constants/Config';

type AuthState = {
  user:        User | null;
  isLoggedIn:  boolean;
  isLoading:   boolean;
  error:       string | null;

  login:        (payload: LoginPayload)    => Promise<boolean>;
  loginAdmin:   (payload: LoginPayload)    => Promise<boolean>;
  register:     (payload: RegisterPayload) => Promise<boolean>;
  logout:       ()                         => Promise<void>;
  clearError:   ()                         => void;
  hydrate:      ()                         => Promise<void>;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:       null,
      isLoggedIn: false,
      isLoading:  false,
      error:      null,

      login: async (payload) => {
        set({ isLoading: true, error: null });
        const res = await authService.login(payload);
        if (res.success && res.data) {
          set({ user: res.data, isLoggedIn: true, isLoading: false });
          return true;
        }
        set({ error: res.error, isLoading: false });
        return false;
      },

      loginAdmin: async (payload) => {
        set({ isLoading: true, error: null });
        const res = await authService.loginAdmin(payload);
        if (res.success && res.data) {
          set({ user: res.data, isLoggedIn: true, isLoading: false });
          return true;
        }
        set({ error: res.error, isLoading: false });
        return false;
      },

      register: async (payload) => {
        set({ isLoading: true, error: null });
        const res = await authService.register(payload);
        if (res.success && res.data) {
          set({ user: res.data, isLoggedIn: true, isLoading: false });
          return true;
        }
        set({ error: res.error, isLoading: false });
        return false;
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isLoggedIn: false, error: null });
      },

      clearError: () => set({ error: null }),

      hydrate: async () => {
        const user = await authService.getUser();
        if (user) {
          set({ user, isLoggedIn: true });
        }
      },
    }),
    {
      name:    STORAGE_KEYS.USER_DATA,
      storage: createJSONStorage(() => AsyncStorage),
      // Hanya persist field berikut
      partialize: (state) => ({
        user:       state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;