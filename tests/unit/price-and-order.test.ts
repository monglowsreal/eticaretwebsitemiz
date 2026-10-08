import { describe, it, expect } from "vitest";
import { OrderService } from "../../src/server/services/order.service";
import { CouponService } from "../../src/server/services/coupon.service";
import { formatPrice, slugify } from "../../src/lib/utils";
import { OrderStatus } from "@prisma/client";

describe("Fiyat ve Sipariş Hesaplama Testleri (OrderService)", () => {
  it("500 TL altındaki sepetlerde 49,90 TL kargo ücreti eklemelidir", () => {
    const result = OrderService.calculateTotals({
      items: [
        {
          variantId: "var-1",
          unitPrice: 35000, // 350.00 TL
          quantity: 1,
        },
      ],
    });

    expect(result.subtotal).toBe(35000);
    expect(result.shippingCost).toBe(4990); // 49.90 TL
    expect(result.totalAmount).toBe(39990); // 399.90 TL
  });

  it("500 TL ve üzerindeki sepetlerde kargo ücretsiz olmalıdır", () => {
    const result = OrderService.calculateTotals({
      items: [
        {
          variantId: "var-1",
          unitPrice: 84900, // 849.00 TL
          quantity: 1,
        },
      ],
    });

    expect(result.subtotal).toBe(84900);
    expect(result.shippingCost).toBe(0); // Ücretsiz
    expect(result.totalAmount).toBe(84900);
  });

  it("Kupon indirimi toplama doğru yansıtılmalıdır", () => {
    const result = OrderService.calculateTotals({
      items: [
        {
          variantId: "var-1",
          unitPrice: 100000, // 1000.00 TL
          quantity: 1,
        },
      ],
      couponCode: "YILDIZ10",
      couponDiscountKurus: 10000, // 100.00 TL indirim
    });

    expect(result.subtotal).toBe(100000);
    expect(result.discountAmount).toBe(10000);
    expect(result.shippingCost).toBe(0);
    expect(result.totalAmount).toBe(90000); // 900.00 TL
  });
});

describe("Sipariş Durumu Geçiş Matrisi Testleri", () => {
  it("PENDING_PAYMENT durumundan PAID durumuna geçiş geçerli olmalıdır", () => {
    expect(
      OrderService.canTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.PAID)
    ).toBe(true);
  });

  it("PAID durumundan DELIVERED durumuna doğrudan geçilememelidir (önce kargolanmalı)", () => {
    expect(
      OrderService.canTransition(OrderStatus.PAID, OrderStatus.DELIVERED)
    ).toBe(false);
  });

  it("SHIPPED durumundan DELIVERED durumuna geçiş geçerli olmalıdır", () => {
    expect(
      OrderService.canTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED)
    ).toBe(true);
  });
});

describe("Kupon Servisi Testleri (CouponService)", () => {
  it("YILDIZ10 kuponu 250 TL altı sepetlerde reddedilmelidir", async () => {
    const res = await CouponService.validateAndCalculate("YILDIZ10", 20000); // 200 TL
    expect(res.valid).toBe(false);
  });

  it("YILDIZ10 kuponu 500 TL sepette 50 TL indirim üretmelidir", async () => {
    const res = await CouponService.validateAndCalculate("YILDIZ10", 50000); // 500 TL
    expect(res.valid).toBe(true);
    expect(res.discountAmount).toBe(5000); // 50 TL
  });
});

describe("Yardımcı Fonksiyon Testleri (Utils)", () => {
  it("formatPrice kuruş tutarını Türk Lirası olarak biçimlendirmelidir", () => {
    const formatted = formatPrice(84900);
    expect(formatted).toContain("849,00");
  });

  it("slugify Türkçe karakterleri ve boşlukları URL uyumlu yapmalıdır", () => {
    expect(slugify("Şef Bıçakları & Satırlar")).toBe("sef-bicaklari-satirlar");
  });
});
