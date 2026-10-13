import { NextResponse } from "next/server";
import { GeminiService } from "@/server/services/gemini.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, categoryHint } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Lütfen bir ürün fikri veya açıklaması girin." },
        { status: 400 }
      );
    }

    const generatedProduct = await GeminiService.generateProduct(prompt.trim(), categoryHint);

    return NextResponse.json({
      success: true,
      product: generatedProduct,
    });
  } catch (error: any) {
    console.error("Gemini AI API Hatası:", error);
    return NextResponse.json(
      { error: error?.message || "Yapay zeka ürün oluştururken bir hata oluştu." },
      { status: 500 }
    );
  }
}
