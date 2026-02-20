import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Overview</h1>

      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {session?.user.email}
        </p>
      </div>

      <div className="space-y-3 flex flex-col">
        <Link href="/account/subscription" className="underline">
          Manage Subscription
        </Link>

        <Link href="/account/reset-password" className="underline">
          Change Password
        </Link>

        <Link href="/account/newsletter" className="underline">
          Newsletter Preferences
        </Link>

        <Link href="/account/cookies" className="underline">
          Cookie Settings
        </Link>
      </div>
    </div>
  );
}
