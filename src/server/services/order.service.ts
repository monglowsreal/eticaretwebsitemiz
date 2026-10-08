import { OrderStatus } from "@prisma/client";

export interface OrderCalculationInput {
  items: {
    variantId: string;
    unitPrice: number; // Kuruş
    quantity: number;
  }[];
  couponCode?: string | null;
  couponDiscountKurus?: number;
}

export interface OrderCalculationOutput {
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export class OrderService {
  public static FREE_SHIPPING_LIMIT = 50000; // 500 TL
  public static STANDARD_SHIPPING_FEE = 4990; // 49.90 TL
  public static DEFAULT_VAT_RATE = 20; // %20 KDV

  /**
   * Sunucu tarafında tutar, kargo ve KDV hesaplaması yapar.
   * Şartname Madde 7.2: Fiyatlar her zaman sunucuda hesaplanır.
   */
  static calculateTotals(input: OrderCalculationInput): OrderCalculationOutput {
    const subtotal = input.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const shippingCost =
      subtotal === 0 || subtotal >= this.FREE_SHIPPING_LIMIT
        ? 0
        : this.STANDARD_SHIPPING_FEE;

    const discountAmount = Math.min(input.couponDiscountKurus || 0, subtotal);
    
    // KDV dahil fiyattan matrah ve KDV ayrıştırması
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = Math.round(
      discountedSubtotal - discountedSubtotal / (1 + this.DEFAULT_VAT_RATE / 100)
    );

    const totalAmount = Math.max(0, discountedSubtotal + shippingCost);

    return {
      subtotal,
      shippingCost,
      discountAmount,
      taxAmount,
      totalAmount,
    };
  }

  /**
   * Benzersiz, okunabilir sipariş numarası üretir
   * Örnek: SY-202610-8492
   */
  static generateOrderNumber(): string {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `SY-${yearMonth}-${randomSuffix}`;
  }

  /**
   * Geçerli sipariş durumu geçiş matrisi (Şartname Madde 4)
   */
  private static validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING_PAYMENT: [OrderStatus.PAID, OrderStatus.CANCELLED, OrderStatus.EXPIRED],
    PAID: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
    PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    SHIPPED: [OrderStatus.DELIVERED, OrderStatus.RETURN_REQUESTED],
    DELIVERED: [OrderStatus.RETURN_REQUESTED],
    CANCELLED: [],
    RETURN_REQUESTED: [OrderStatus.RETURNED, OrderStatus.REFUNDED],
    RETURNED: [OrderStatus.REFUNDED],
    REFUNDED: [],
    EXPIRED: [],
  };

  /**
   * Durum geçişinin geçerli olup olmadığını denetler
   */
  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    return this.validTransitions[from]?.includes(to) ?? false;
  }
}
