import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, ORDER_CONFIG } from '@/constants/Config';
import { CartItem } from '@/services/orderService';

type CartSummary = {
  subtotal:    number;
  appFee:      number;
  deliveryFee: number;
  total:       number;
  totalItems:  number;
};

type CartState = {
  items: CartItem[];

  getSummary:    ()                                    => CartSummary;
  getItemById:   (id: number)                          => CartItem | undefined;
  getTotalItems: ()                                    => number;

  addItem:       (item: Omit<CartItem, 'quantity'>)    => void;
  removeItem:    (id: number)                          => void;
  increaseQty:   (id: number)                          => void;
  decreaseQty:   (id: number)                          => void;
  clearCart:     ()                                    => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      getSummary: () => {
        const { items } = get();
        const subtotal    = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const appFee      = ORDER_CONFIG.APP_FEE;
        const deliveryFee = ORDER_CONFIG.DELIVERY_FEE;
        const total       = subtotal + appFee + deliveryFee;
        const totalItems  = items.reduce((sum, i) => sum + i.quantity, 0);
        return { subtotal, appFee, deliveryFee, total, totalItems };
      },

      getItemById: (id) => {
        return get().items.find(i => i.id === id);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(i => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === newItem.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id),
        }));
      },

      increaseQty: (id) => {
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      decreaseQty: (id) => {
        set((state) => {
          const item = state.items.find(i => i.id === id);
          if (!item) return state;
          if (item.quantity <= 1) {
            return { items: state.items.filter(i => i.id !== id) };
          }
          return {
            items: state.items.map(i =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name:    STORAGE_KEYS.CART,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;