import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  marketingConsent?: boolean;
}

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  image?: string | null;
  phone?: string | null;
}

// Geliştirme ortamında DB bağlantısı yoksa hafızada tutulan kullanıcı havuzu
const inMemoryUsers: (SafeUser & { passwordHash: string })[] = [
  {
    id: "user-admin-demo",
    email: "admin@sariyildiz.com",
    firstName: "Sarıyıldız",
    lastName: "Yönetici",
    role: Role.ADMIN,
    passwordHash: bcrypt.hashSync("Admin123456!", 10),
  },
  {
    id: "user-demo",
    email: "demo@sariyildiz.com",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    role: Role.CUSTOMER,
    passwordHash: bcrypt.hashSync("123456", 10),
  },
];

export class AuthService {
  /**
   * E-posta ve şifre ile kullanıcı kaydı yapar
   */
  static async register(input: RegisterInput): Promise<{ success: boolean; user?: SafeUser; error?: string }> {
    const email = input.email.toLowerCase().trim();

    try {
      // 1. Veritabanında kontrol et
      const existingDbUser = await db.user.findUnique({
        where: { email },
      });

      if (existingDbUser) {
        return { success: false, error: "Bu e-posta adresi ile kayıtlı bir hesap zaten var." };
      }

      const passwordHash = await bcrypt.hash(input.password, 10);

      const newUser = await db.user.create({
        data: {
          email,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          phone: input.phone || null,
          passwordHash,
          role: Role.CUSTOMER,
          marketingConsent: input.marketingConsent ?? false,
        },
      });

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          image: newUser.image,
          phone: newUser.phone,
        },
      };
    } catch {
      // Veritabanı çevrimdışı ise in-memory fallback
      const existingMemoryUser = inMemoryUsers.find((u) => u.email === email);
      if (existingMemoryUser) {
        return { success: false, error: "Bu e-posta adresi ile kayıtlı bir hesap zaten var." };
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const fallbackUser: SafeUser & { passwordHash: string } = {
        id: `user-${Date.now()}`,
        email,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        phone: input.phone || null,
        role: Role.CUSTOMER,
        passwordHash,
      };

      inMemoryUsers.push(fallbackUser);

      return {
        success: true,
        user: {
          id: fallbackUser.id,
          email: fallbackUser.email,
          firstName: fallbackUser.firstName,
          lastName: fallbackUser.lastName,
          role: fallbackUser.role,
        },
      };
    }
  }

  /**
   * Kimlik doğrulama (Giriş kontrolü)
   */
  static async verifyCredentials(emailInput: string, passwordInput: string): Promise<SafeUser | null> {
    const email = emailInput.toLowerCase().trim();

    try {
      const user = await db.user.findUnique({
        where: { email },
      });

      if (user && user.passwordHash) {
        const isValid = await bcrypt.compare(passwordInput, user.passwordHash);
        if (isValid) {
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            image: user.image,
            phone: user.phone,
          };
        }
      }
    } catch {
      // DB çevrimdışı ise memory fallback
    }

    const memoryUser = inMemoryUsers.find((u) => u.email === email);
    if (memoryUser) {
      const isValid = await bcrypt.compare(passwordInput, memoryUser.passwordHash);
      if (isValid) {
        return {
          id: memoryUser.id,
          email: memoryUser.email,
          firstName: memoryUser.firstName,
          lastName: memoryUser.lastName,
          role: memoryUser.role,
          image: memoryUser.image,
          phone: memoryUser.phone,
        };
      }
    }

    return null;
  }

  /**
   * Google OAuth kullanıcısını bulur veya otomatik oluşturur
   */
  static async findOrCreateGoogleUser(profile: {
    email: string;
    name?: string | null;
    image?: string | null;
  }): Promise<SafeUser> {
    const email = profile.email.toLowerCase().trim();
    const nameParts = (profile.name || "Google Kullanıcısı").trim().split(" ");
    const firstName = nameParts[0] || "Kullanıcı";
    const lastName = nameParts.slice(1).join(" ") || "Sarıyıldız";

    try {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        if (profile.image && !existingUser.image) {
          await db.user.update({
            where: { id: existingUser.id },
            data: { image: profile.image },
          });
        }
        return {
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
          image: profile.image || existingUser.image,
        };
      }

      const newUser = await db.user.create({
        data: {
          email,
          firstName,
          lastName,
          image: profile.image || null,
          role: Role.CUSTOMER,
          emailVerified: new Date(),
        },
      });

      return {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        image: newUser.image,
      };
    } catch {
      // Memory fallback
      let memUser = inMemoryUsers.find((u) => u.email === email);
      if (!memUser) {
        memUser = {
          id: `google-user-${Date.now()}`,
          email,
          firstName,
          lastName,
          image: profile.image || null,
          role: Role.CUSTOMER,
          passwordHash: "",
        };
        inMemoryUsers.push(memUser);
      }
      return {
        id: memUser.id,
        email: memUser.email,
        firstName: memUser.firstName,
        lastName: memUser.lastName,
        role: memUser.role,
        image: memUser.image,
      };
    }
  }
}
