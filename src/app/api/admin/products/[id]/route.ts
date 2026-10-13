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

    const payload = await getPayload({ config: configPromise });

    const updateData: any = {};
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.compareAtPrice !== undefined)
      updateData.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null;
    if (body.name) updateData.name = body.name;
    if (body.status) updateData.status = body.status;
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);

    const updated = await payload.update({
      collection: "products",
      id,
      data: updateData,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Ürün güncellenemedi." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({ config: configPromise });

    await payload.delete({
      collection: "products",
      id,
    });

    return NextResponse.json({ success: true, message: "Ürün silindi." });
  } catch (error: any) {
    console.error("Ürün silme hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Ürün silinemedi." },
      { status: 500 }
    );
  }
}
