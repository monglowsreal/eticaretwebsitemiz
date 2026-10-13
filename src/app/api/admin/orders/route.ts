import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const whereClause: any = {};
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter as OrderStatus;
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        items: true,
        shipments: true,
        payments: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Eğer veritabanında henüz sipariş yoksa, test amacıyla başlangıç örnek siparişleri üret
    if (orders.length === 0 && (!statusFilter || statusFilter === "ALL")) {
      const mockOrders = [
        {
          id: "order-demo-1",
          orderNumber: "SY-202610-8421",
          status: "PAID",
          guestName: "Mehmet Kaya",
          guestEmail: "mehmet.kaya@example.com",
          guestPhone: "0532 555 44 33",
          shippingAddress: {
            fullName: "Mehmet Kaya",
            city: "İstanbul",
            district: "Kadıköy",
            addressLine: "Caddebostan Mah. Bağdat Cad. No: 142 D: 5",
            postalCode: "34728",
          },
          subtotal: 289900,
          shippingCost: 0,
          discountAmount: 0,
          totalAmount: 289900,
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          items: [
            {
              id: "item-1",
              productName: "Sarıyıldız VG-10 Şam Çeliği 67 Katman Şef Bıçağı",
              variantName: "20 cm - Ceviz Sap",
              productSku: "SY-KN-VG10-20",
              unitPrice: 289900,
              quantity: 1,
              totalPrice: 289900,
            },
          ],
          shipments: [],
        },
        {
          id: "order-demo-2",
          orderNumber: "SY-202610-8420",
          status: "SHIPPED",
          guestName: "Fatma Demir",
          guestEmail: "fatma.demir@example.com",
          guestPhone: "0544 123 99 88",
          shippingAddress: {
            fullName: "Fatma Demir",
            city: "Ankara",
            district: "Çankaya",
            addressLine: "Tunalı Hilmi Cad. No: 88 D: 12",
            postalCode: "06680",
          },
          subtotal: 129900,
          shippingCost: 0,
          discountAmount: 10000,
          totalAmount: 119900,
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          items: [
            {
              id: "item-2",
              productName: "Sarıyıldız 100W GaN Pro 4 Portlu Hızlı Şarj Cihazı",
              variantName: "Siyah",
              productSku: "SY-CHG-100W",
              unitPrice: 129900,
              quantity: 1,
              totalPrice: 129900,
            },
          ],
          shipments: [
            {
              carrier: "Yurtiçi Kargo",
              trackingNumber: "YK-982173456",
              status: "Kargoya Verildi",
            },
          ],
        },
        {
          id: "order-demo-3",
          orderNumber: "SY-202610-8419",
          status: "PROCESSING",
          guestName: "Can Yıldırım",
          guestEmail: "can.yildirim@example.com",
          guestPhone: "0505 777 22 11",
          shippingAddress: {
            fullName: "Can Yıldırım",
            city: "İzmir",
            district: "Karşıyaka",
            addressLine: "Bostanlı Mah. Cemal Gürsel Cad. No: 45",
            postalCode: "35590",
          },
          subtotal: 68900,
          shippingCost: 4990,
          discountAmount: 0,
          totalAmount: 73890,
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          items: [
            {
              id: "item-3",
              productName: "Sarıyıldız Solar Kamp Lambası & Powerbank",
              variantName: "Asker Yeşili",
              productSku: "SY-SOL-5000",
              unitPrice: 68900,
              quantity: 1,
              totalPrice: 68900,
            },
          ],
          shipments: [],
        },
      ];
      return NextResponse.json({ success: true, orders: mockOrders });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Sipariş listeleme hatası:", error);
    return NextResponse.json(
      { error: "Siparişler getirilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
