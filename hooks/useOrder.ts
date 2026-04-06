import { useCallback } from 'react';
import { useRouter }   from 'expo-router';
import { useCartStore, useOrderStore } from '@/store';
import { PaymentMethodId } from '@/constants/Config';
import { CartItem } from '@/services/orderService';

export function useCart() {
  const {
    items,
    getSummary,
    getItemById,
    getTotalItems,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCartStore();

  const summary    = getSummary();
  const totalItems = getTotalItems();
  const isEmpty    = items.length === 0;

  return {
    items,
    summary,
    totalItems,
    isEmpty,
    getItemById,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
  };
}

export function useOrder() {
  const router = useRouter();

  const {
    activeOrder,
    orderHistory,
    isLoading,
    error,
    selectedPayment,
    setSelectedPayment,
    createOrder,
    checkOrderStatus,
    clearActiveOrder,
    clearError,
  } = useOrderStore();

  const { items, clearCart } = useCartStore();

  const placeOrder = useCallback(async (): Promise<boolean> => {
    if (items.length === 0) return false;

    const success = await createOrder({
      items,
      paymentMethod: selectedPayment,
    });

    if (success) {
      clearCart();                              
      router.push('/(user)/waiting');           
    }

    return success;
  }, [items, selectedPayment, createOrder, clearCart, router]);

  return {
    activeOrder,
    orderHistory,
    isLoading,
    error,
    selectedPayment,
    setSelectedPayment,
    placeOrder,
    checkOrderStatus,
    clearActiveOrder,
    clearError,
  };
}

export default useOrder;