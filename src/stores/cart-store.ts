import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemType } from "@/types";

interface CartStore {
  items: CartItemType[];
  isCartOpen: boolean;
  couponCode: string | null;
  discountAmount: number; // Kuruş
  
  // Eylemler
  addItem: (item: Omit<CartItemType, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  // Hesaplanan getter'lar
  getTotalCount: () => number;
  getSubtotal: () => number; // Kuruş
  getShippingCost: () => number; // Kuruş
  getTotalPrice: () => number; // Kuruş
  getFreeShippingRemaining: () => number; // Kuruş
}

// Ücretsiz kargo barajı: 500 TL = 50000 Kuruş
export const FREE_SHIPPING_THRESHOLD = 50000;
export const DEFAULT_SHIPPING_FEE = 4990; // 49.90 TL

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      couponCode: null,
      discountAmount: 0,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.variantId === item.variantId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentQty = updatedItems[existingIndex].quantity;
            const newQty = Math.min(
              currentQty + quantity,
              item.stock > 0 ? item.stock : currentQty + quantity
            );
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
            };
            return { items: updatedItems, isCartOpen: true };
          }

          return {
            items: [...state.items, { ...item, quantity }],
            isCartOpen: true,
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountAmount: 0 });
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      applyCoupon: (code, discount) => {
        set({ couponCode: code, discountAmount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, discountAmount: 0 });
      },

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return DEFAULT_SHIPPING_FEE;
      },

      getTotalPrice: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingCost();
        const discount = get().discountAmount;
        return Math.max(0, subtotal + shipping - discount);
      },

      getFreeShippingRemaining: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      },
    }),
    {
      name: "sariyildiz-cart-storage",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
);
