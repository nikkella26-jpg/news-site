"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter} from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackURL = searchParams.get("callbackURL");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate token on mount
/* useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link - missing token");
    }
  }, [token]); */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link - missing token");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.resetPassword({
        token,
        newPassword: password,
      });

      if (res?.error) {
        toast.error(res.error.message ?? "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully!");
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      // Redirect to login or callback URL after a short delay
      setTimeout(() => {
 const safeCallback =
  callbackURL &&
  callbackURL.startsWith("/") &&
  !callbackURL.startsWith("//") &&
  !callbackURL.includes("://");

router.push(safeCallback ? callbackURL : "/login");
}, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center">Invalid Link</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              The password reset link is invalid or has expired.
            </p>
          </div>
          <Link href="/forgot-password" className="block w-full">
            <Button className="w-full">Request New Reset Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center">Success!</h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">✓ Password reset successfully!</p>
            <p className="text-xs text-green-700 mt-2">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <p className="text-center text-sm text-gray-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/login" className="underline text-blue-600 hover:text-blue-800">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
