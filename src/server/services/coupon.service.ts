export interface CouponResult {
  valid: boolean;
  message?: string;
  code?: string;
  discountType?: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountAmount?: number; // Kuruş cinsinden indirim
}

export class CouponService {
  /**
   * Kupon kodunu doğrular ve sepete uygulanacak indirim tutarını hesaplar.
   * Tüm hesaplama her zaman sunucuda yapılır (Şartname Madde 7.2).
   */
  static async validateAndCalculate(
    code: string,
    subtotalKurus: number
  ): Promise<CouponResult> {
    const cleanCode = code.trim().toUpperCase();

    // Örnek kuponlar
    if (cleanCode === "YILDIZ10") {
      if (subtotalKurus < 25000) {
        return {
          valid: false,
          message: "Bu kupon için minimum sepet tutarı 250,00 ₺ olmalıdır.",
        };
      }
      // %10 indirim
      const discount = Math.round(subtotalKurus * 0.1);
      return {
        valid: true,
        code: cleanCode,
        discountType: "PERCENTAGE",
        discountAmount: discount,
      };
    }

    if (cleanCode === "HOSGELDIN50") {
      if (subtotalKurus < 50000) {
        return {
          valid: false,
          message: "Bu kupon için minimum sepet tutarı 500,00 ₺ olmalıdır.",
        };
      }
      // 50 TL (5000 kuruş) sabit indirim
      return {
        valid: true,
        code: cleanCode,
        discountType: "FIXED",
        discountAmount: 5000,
      };
    }

    return {
      valid: false,
      message: "Geçersiz veya süresi dolmuş kupon kodu.",
    };
  }
}
