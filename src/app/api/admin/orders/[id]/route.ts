import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, carrier, trackingNumber, notes } = body;

    // Eğer demo ID ise başarı döndür
    if (id.startsWith("order-demo-")) {
      return NextResponse.json({
        success: true,
        message: "Demo sipariş durumu güncellendi.",
        order: { id, status, carrier, trackingNumber, notes },
      });
    }

    const updateData: any = {};
    if (status) updateData.status = status as OrderStatus;
    if (notes !== undefined) updateData.notes = notes;

    const updatedOrder = await db.order.update({
      where: { id },
      data: updateData,
    });

    // Eğer kargoya verildiyse ve kargo bilgisi varsa Shipment oluştur veya güncelle
    if (status === "SHIPPED" && carrier && trackingNumber) {
      await db.shipment.create({
        data: {
          orderId: id,
          carrier,
          trackingNumber,
          status: "Kargoya Verildi",
          shippedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Sipariş güncelleme hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Sipariş güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
