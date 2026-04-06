import { ORDER_CONFIG } from '@/constants/Config';
import { PaymentMethodId } from '@/constants/Config';

export type CartItem = {
  id:        number;
  title:     string;
  price:     number;
  quantity:  number;
  thumbnail: string;
};

export type Order = {
  id:            string;
  items:         CartItem[];
  subtotal:      number;
  appFee:        number;
  deliveryFee:   number;
  total:         number;
  paymentMethod: PaymentMethodId;
  status:        OrderStatus;
  estimasiMenit: string;
  createdAt:     string;
};

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export type CreateOrderPayload = {
  items:         CartItem[];
  paymentMethod: PaymentMethodId;
};

export type OrderResponse = {
  success: boolean;
  data:    Order | null;
  error:   string | null;
};

export function calculateOrderTotal(items: CartItem[]): {
  subtotal:    number;
  appFee:      number;
  deliveryFee: number;
  total:       number;
} {
  const subtotal    = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const appFee      = ORDER_CONFIG.APP_FEE;
  const deliveryFee = ORDER_CONFIG.DELIVERY_FEE;
  const total       = subtotal + appFee + deliveryFee;
  return { subtotal, appFee, deliveryFee, total };
}

const orderService = {

  createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    try {
      await new Promise(res => setTimeout(res, 800));

      const { subtotal, appFee, deliveryFee, total } =
        calculateOrderTotal(payload.items);

      const newOrder: Order = {
        id:            'ORD-' + Date.now(),
        items:         payload.items,
        subtotal,
        appFee,
        deliveryFee,
        total,
        paymentMethod: payload.paymentMethod,
        status:        'processing',
        estimasiMenit: `${ORDER_CONFIG.EST_DELIVERY_MIN}–${ORDER_CONFIG.EST_DELIVERY_MAX} mins`,
        createdAt:     new Date().toISOString(),
      };

      return { success: true, data: newOrder, error: null };
    } catch {
      return { success: false, data: null, error: 'Gagal Membuat Pesanan. Coba Lagi Ya!' };
    }
  },

  getOrderStatus: async (orderId: string): Promise<OrderResponse> => {
    try {
      await new Promise(res => setTimeout(res, 500));

      return {
        success: true,
        data:    null,   
        error:   null,
      };
    } catch {
      return { success: false, data: null, error: 'Gagal Mengecek Pesanan. Coba Lagi Ya!' };
    }
  },

};

export default orderService;