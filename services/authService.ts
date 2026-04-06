import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/Config';

export type UserRole = 'user' | 'admin';

export type User = {
  id:       string;
  nama:     string;
  email:    string;
  alamat?:  string;
  role:     UserRole;
  token:    string;
};

export type LoginPayload = {
  email:    string;
  password: string;
};

export type RegisterPayload = {
  namaLengkap: string;
  email:       string;
  password:    string;
};

export type AuthResponse = {
  success: boolean;
  data:    User | null;
  error:   string | null;
};

const MOCK_ADMIN = {
  email:    'admin@tesate.com',
  password: 'admin123',
};

const authService = {

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      await new Promise(res => setTimeout(res, 800));

      const mockUser: User = {
        id:    '1',
        nama:  'Mang Saswi',
        email: payload.email,
        role:  'user',
        token: 'mock-user-token-' + Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockUser.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));

      return { success: true, data: mockUser, error: null };
    } catch {
      return { success: false, data: null, error: 'Login Gagal. Coba Lagi Ya!' };
    }
  },

  loginAdmin: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      await new Promise(res => setTimeout(res, 800));

      if (
        payload.email    !== MOCK_ADMIN.email ||
        payload.password !== MOCK_ADMIN.password
      ) {
        return {
          success: false,
          data:    null,
          error:   'Email Atau Password Admin Salah Nih!',
        };
      }

      const mockAdmin: User = {
        id:    'admin-1',
        nama:  'Cak Awih',
        email: payload.email,
        role:  'admin',
        token: 'mock-admin-token-' + Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockAdmin.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockAdmin));

      return { success: true, data: mockAdmin, error: null };
    } catch {
      return { success: false, data: null, error: 'Login Admin Gagal. Coba Lagi Ya!' };
    }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      await new Promise(res => setTimeout(res, 800));

      const newUser: User = {
        id:    Date.now().toString(),
        nama:  payload.namaLengkap,
        email: payload.email,
        role:  'user',
        token: 'mock-token-' + Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newUser.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));

      return { success: true, data: newUser, error: null };
    } catch {
      return { success: false, data: null, error: 'Pendaftaran Gagal. Coba Lagi Ya!' };
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.CART,
    ]);
  },

  getUser: async (): Promise<User | null> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

};

export default authService;