import {
  PaymentProvider,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentCallbackResult,
} from "./payment-provider";

export class IyzicoPaymentProvider implements PaymentProvider {
  name = "iyzico";
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.IYZICO_API_KEY || "sandbox-api-key";
    this.secretKey = process.env.IYZICO_SECRET_KEY || "sandbox-secret-key";
    this.baseUrl =
      process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
  }

  async initializeCheckout(
    request: PaymentInitRequest
  ): Promise<PaymentInitResponse> {
    // Sandbox / Mock test akışı
    const isMock =
      !process.env.IYZICO_API_KEY ||
      process.env.IYZICO_API_KEY === "sandbox-api-key";

    if (isMock) {
      // Geliştirme ortamı için simüle edilmiş ödeme formu/yönlendirmesi
      return {
        success: true,
        token: `mock_iyzico_token_${Date.now()}`,
        paymentPageUrl: `/odeme/mock-3d-secure?order=${request.orderNumber}&amount=${request.amountKurus}`,
      };
    }

    // Gerçek iyzico API çağrısı entegrasyonu (Aşama 3'te tam sandbox anahtarları ile bağlanır)
    return {
      success: true,
      token: "iyzico_token_ready",
      paymentPageUrl: `/odeme/mock-3d-secure?order=${request.orderNumber}&amount=${request.amountKurus}`,
    };
  }

  async verifyCallback(
    params: Record<string, unknown>
  ): Promise<PaymentCallbackResult> {
    const orderNumber = String(params.orderNumber || "");
    const status = String(params.status || "success");

    if (status === "success") {
      return {
        success: true,
        orderNumber,
        transactionId: `iyz_${Date.now()}`,
        paidAmountKurus: Number(params.amount || 0),
        rawResponse: params,
      };
    }

    return {
      success: false,
      orderNumber,
      errorMessage: String(params.errorMessage || "Ödeme onaylanamadı."),
    };
  }
}
