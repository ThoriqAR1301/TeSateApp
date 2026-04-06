import { create } from 'zustand';
import orderService, { Order, CreateOrderPayload } from '@/services/orderService';
import { PaymentMethodId } from '@/constants/Config';
import { CartItem } from '@/services/orderService';

type OrderState = {
  activeOrder:     Order | null;
  orderHistory:    Order[];
  isLoading:       boolean;
  error:           string | null;
  selectedPayment: PaymentMethodId;

  setSelectedPayment: (method: PaymentMethodId)        => void;
  createOrder:        (payload: CreateOrderPayload)     => Promise<boolean>;
  checkOrderStatus:   (orderId: string)                 => Promise<void>;
  clearActiveOrder:   ()                                => void;
  clearError:         ()                                => void;
};

const useOrderStore = create<OrderState>()((set, get) => ({
  activeOrder:     null,
  orderHistory:    [],
  isLoading:       false,
  error:           null,
  selectedPayment: 'cash',   

  setSelectedPayment: (method) => {
    set({ selectedPayment: method });
  },

  createOrder: async (payload) => {
    set({ isLoading: true, error: null });
    const res = await orderService.createOrder(payload);
    if (res.success && res.data) {
      set((state) => ({
        activeOrder:  res.data,
        orderHistory: [res.data!, ...state.orderHistory],
        isLoading:    false,
      }));
      return true;
    }
    set({ error: res.error, isLoading: false });
    return false;
  },

  checkOrderStatus: async (orderId) => {
    set({ isLoading: true, error: null });
    const res = await orderService.getOrderStatus(orderId);
    if (res.success && res.data) {
      set({ activeOrder: res.data, isLoading: false });
    } else {
      set({ error: res.error, isLoading: false });
    }
  },

  clearActiveOrder: () => set({ activeOrder: null }),

  clearError: () => set({ error: null }),
}));

export default useOrderStore;