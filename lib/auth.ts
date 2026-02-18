import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, roles } from "./permissions";
import { sendMail } from "./mail";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
// If your Prisma file is located elsewhere, you can change the path
import { prisma }  from "./prisma";
import { nextCookies } from "better-auth/next-js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is missing");
}

const stripeClient = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover", // Latest API version as of Stripe SDK v20.0.0
});

const APP_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL: APP_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    sendResetPassword: async ({ user, url }) => {
      // Transform better-auth URL (/api/auth/reset-password/TOKEN?callbackURL=...)
      // to our custom reset-password page (/reset-password?token=TOKEN&callbackURL=...)
      const match = url.match(/\/api\/auth\/reset-password\/([^?]+)/);
      const token = match ? match[1] : "";

      if (!token) {
        console.error("Failed to extract token from reset URL:", url);
        throw new Error("Invalid reset password URL");
      }

      const resetUrl = `${APP_URL}/reset-password?token=${token}&callbackURL=${encodeURIComponent("/login")}`;
      const html = `Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`;
      await sendMail(user.email, "Reset your password", html);
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const html = `Click the link to verify your email: <a href="${url}">${url}</a>`;
      await sendMail(user.email, "Verify your email address", html);
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles,
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [],
      },
    }),
    nextCookies(),
  ],
});