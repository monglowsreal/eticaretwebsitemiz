import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const payload = await getPayload({ config: configPromise });

    const where: any = {};
    if (statusFilter && statusFilter !== "ALL") {
      where.status = { equals: statusFilter };
    }

    const res = await payload.find({
      collection: "orders",
      where,
      limit: 100,
      depth: 2,
    });

    return NextResponse.json({ success: true, orders: res.docs });
  } catch (error: any) {
    console.error("Payload sipariş listeleme hatası:", error);
    return NextResponse.json(
      { error: "Siparişler listelenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
