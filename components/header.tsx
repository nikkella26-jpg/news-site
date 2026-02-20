"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import WeatherWidget from "./weatherWidget";
import { authClient } from "@/lib/auth-client";
import { LayoutDashboard, LogOut, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import AccountAccessButton from "@/components/AccountAccessButton";
import { useEffect, useState } from "react";

const categories = ["World", "Politics", "Tech", "Sports"];

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  const [hasActiveSub, setHasActiveSub] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!session) {
        setHasActiveSub(false);
        return;
      }

      const { data } = await authClient.subscription.list();

      const active = data?.some(
        (s) => s?.status === "active" || s?.status === "trialing",
      );

      setHasActiveSub(!!active);
    };

    load();
  }, [session]);

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const isEditor = session?.user?.role?.toLowerCase() === "editor";

  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Left side: Logo + categories */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Home
          </Link>

          {/* Newsfeed Button */}
          <Link
            href="/articles"
            className="font-semibold text-blue-600 hover:underline"
          >
            Newsfeed
          </Link>

          {categories.map((cat) => (
            <Link key={cat} href={`/category/${cat.toLowerCase()}`}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Center: Weather */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <WeatherWidget />
        </div>

        {/* Right side: Auth, Subscribe + Theme toggle */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}

          {isEditor && !isAdmin && (
            <Link href="/admin/articles">
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Editor
              </Button>
            </Link>
          )}

          {!isPending && !session ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm"
            >
              Login
            </Link>
          ) : (
            !isPending && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )
          )}

          {(!session || !hasActiveSub) && (
            <AccountAccessButton
              labelOverride={{
                noSub: "Subscribe",
                noSession: "Subscribe",
              }}
              subscribePath="/subscribe"
              accountPath="/account/subscription"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            />
          )}

          {session && (
            <AccountAccessButton
              labelOverride={{
                noSub: "Account",
                withSub: "Account",
              }}
              subscribePath="/subscribe"
              accountPath="/account/subscription"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                 forceAccountRedirect={true}
            />
          )}

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
