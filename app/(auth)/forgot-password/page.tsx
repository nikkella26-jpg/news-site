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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate email
    if (!email?.includes("@")) {
      toast.error("Please enter a valid email");
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

      toast.success("Check your email for the reset link");
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        {/* Back to login link */}
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/login" className="underline text-blue-600">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
