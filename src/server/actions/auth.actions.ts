"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthService } from "@/server/services/auth.service";
import { registerSchema } from "@/lib/validators";

export async function registerAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  marketingConsent?: boolean;
}) {
  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    const errorMsg = validation.error.issues[0]?.message || "Lütfen form alanlarını doğru doldurunuz.";
    return { success: false, error: errorMsg };
  }

  const result = await AuthService.register({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    password: data.password,
    marketingConsent: data.marketingConsent,
  });

  return result;
}

export async function loginWithCredentialsAction(data: { email: string; password: string }) {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: "E-posta veya parola hatalı." };
  }
}

export async function loginWithGoogleAction() {
  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    return {
      success: false,
      error:
        "Google Girişi için Google Client ID ve Secret henüz ayarlanmamış. Lütfen .env dosyasında AUTH_GOOGLE_ID ve AUTH_GOOGLE_SECRET değerlerini girin.",
    };
  }

  await signIn("google", { redirectTo: "/" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
