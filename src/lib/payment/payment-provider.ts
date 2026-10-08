export interface PaymentInitRequest {
  orderNumber: string;
  amountKurus: number;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    identityNumber?: string;
    ip: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  callbackUrl: string;
}

export interface PaymentInitResponse {
  success: boolean;
  paymentPageUrl?: string;
  token?: string;
  checkoutFormContent?: string;
  errorMessage?: string;
}

export interface PaymentCallbackResult {
  success: boolean;
  orderNumber: string;
  transactionId?: string;
  paidAmountKurus?: number;
  rawResponse?: Record<string, unknown>;
  errorMessage?: string;
}

export interface PaymentProvider {
  name: string;
  initializeCheckout(request: PaymentInitRequest): Promise<PaymentInitResponse>;
  verifyCallback(params: Record<string, unknown>): Promise<PaymentCallbackResult>;
}
