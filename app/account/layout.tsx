import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">My Account</h2>

        <nav className="flex flex-col space-y-3">
          <Link href="/account">Overview</Link>
          <Link href="/account/subscription">Subscription</Link>
          <Link href="/account/newsletter">Newsletter</Link>
          <Link href="/account/cookies">Cookie Settings</Link>
          <Link href="/account/reset-password">Change Password</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
