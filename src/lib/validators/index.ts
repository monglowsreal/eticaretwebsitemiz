import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Parola en az 6 karakter olmalıdır"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().optional(),
  password: z.string().min(6, "Parola en az 6 karakter olmalıdır"),
  marketingConsent: z.boolean().default(false),
});

export const addressSchema = z.object({
  title: z.string().min(2, "Adres başlığı gereklidir (örn. Evim, İş)"),
  fullName: z.string().min(3, "Ad Soyad gereklidir"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  city: z.string().min(2, "İl seçiniz"),
  district: z.string().min(2, "İlçe seçiniz"),
  neighborhood: z.string().optional(),
  addressLine: z.string().min(10, "Açık adres en az 10 karakter olmalıdır"),
  postalCode: z.string().optional(),
  type: z.enum(["SHIPPING", "BILLING"]).default("SHIPPING"),
  isCorporate: z.boolean().default(false),
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
  taxOffice: z.string().optional(),
});

export const checkoutSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
  notes: z.string().optional(),
  acceptTerms: z.literal(true, {
    message: "Mesafeli satış sözleşmesini ve ön bilgilendirme formunu onaylamalısınız",
  }),
});
