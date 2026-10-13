import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, carrier, trackingNumber, trackingUrl, notes } = body;

    const payload = await getPayload({ config: configPromise });

    const updateData: any = {};
    if (status) updateData.status = status;
    if (carrier) updateData.carrier = carrier;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (trackingUrl) updateData.trackingUrl = trackingUrl;
    if (notes !== undefined) updateData.notes = notes;

    const updatedOrder = await payload.update({
      collection: "orders",
      id,
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Payload sipariş güncelleme hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Sipariş güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
