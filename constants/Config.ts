import Constants from 'expo-constants';

export const API_CONFIG = {
  BASE_URL:    'https://dummyjson.com',
  TIMEOUT:     10000,       
  ENDPOINTS: {
    PRODUCTS:        '/products',
    PRODUCT_BY_ID:   (id: number | string) => `/products/${id}`,
    PRODUCTS_SEARCH: '/products/search',
    PRODUCTS_CATEGORIES: '/products/categories',
    PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
    PRODUCT_LIMIT:   (limit: number, skip: number) =>
                       `/products?limit=${limit}&skip=${skip}`,
  },
} as const;

export const APP_INFO = {
  NAME:     'TeSate',
  TAGLINE:  'Pet Cepet, Sen Pesen!',
  VERSION:  Constants.expoConfig?.version ?? '1.0.0',
  OWNER:    'Sate Cak Awih',
  LOCATION: 'Bambu Apus, Jakarta Timur',
} as const;

export const ORDER_CONFIG = {
  APP_FEE:        2000,     
  DELIVERY_FEE:   5000,     
  EST_DELIVERY_MIN: 30,     
  EST_DELIVERY_MAX: 35,     
} as const;

export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Bayar Cash aja', color: '#1E1E1E' },
  { id: 'ovo',  label: 'Pake Ovo',       color: '#6B2FCC' },
  { id: 'qris', label: 'Pake Qris',      color: '#CC2F5E' },
] as const;

export type PaymentMethodId = typeof PAYMENT_METHODS[number]['id'];

export const STORAGE_KEYS = {
  AUTH_TOKEN:   '@tesate/auth_token',
  USER_DATA:    '@tesate/user_data',
  REMEMBER_ME:  '@tesate/remember_me',
  CART:         '@tesate/cart',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_SKIP:  0,
} as const;

export const ERROR_MESSAGES = {
  NETWORK:      'Koneksi gagal. Cek internet kamu ya!',
  TIMEOUT:      'Request terlalu lama. Coba lagi ya!',
  SERVER:       'Server lagi bermasalah. Tunggu bentar!',
  NOT_FOUND:    'Data tidak ditemukan.',
  UNAUTHORIZED: 'Sesi kamu habis. Login lagi ya!',
  UNKNOWN:      'Ada yang error nih. Coba lagi!',
} as const;

export const MENU_CATEGORIES = [
  { id: 'rekomendasi', label: 'Rekomendasi' },
  { id: 'makanan',     label: 'Makanan'     },
  { id: 'minuman',     label: 'Minuman'     },
  { id: 'snack',       label: 'Snack'       },
] as const;

export type MenuCategoryId = typeof MENU_CATEGORIES[number]['id'];