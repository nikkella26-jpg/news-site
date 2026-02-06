"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email?.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.requestPasswordReset({ email });

      if (res?.error) {
        toast.error(res.error.message ?? "Failed to send reset link");
        setLoading(false);
        return;
      }

      toast.success("Reset link sent! Check your email inbox");
      setSent(true);
      setEmail("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset link";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Forgot Password?</h1>
        <p className="text-center text-sm text-gray-600">Enter your email address and we&apos;ll send you a link to reset your password.</p>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">✓ Reset link sent successfully!</p>
              <p className="text-xs text-green-700 mt-2">Check your email for instructions to reset your password.</p>
            </div>
            <Link href="/login" className="block w-full mt-4">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        {!sent && (
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="underline text-blue-600 hover:text-blue-800">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
