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
import MobileNav from "./mobile-nav";

const categories = ["World", "Politics", "Tech", "Sports"];

export default function Header({ initialWeather }: { initialWeather?: any }) {
  const { data: session, isPending } = authClient.useSession();
  const [hasActiveSub, setHasActiveSub] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

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

    setHasMounted(true);
    load();
  }, [session]);

  const router = useRouter();

  if (!hasMounted) {
    // Return a stable skeleton/loading version for SSR to prevent hydration errors
    return (
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-40 h-24">
        <nav className="container mx-auto flex items-center justify-between py-4 px-6 md:px-10 h-full relative">
          <div className="flex items-center gap-8">
            <div className="w-10 h-10 rounded-lg bg-muted" />
            <div className="font-bold text-2xl tracking-tight uppercase text-slate-900 dark:text-slate-100">
              Nordic <span className="text-cyan-600">Express</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-10 rounded-full bg-muted animate-pulse" />
            <div className="w-10 h-10 rounded-md bg-muted animate-pulse" />
          </div>
        </nav>
      </header>
    );
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const isEditor = session?.user?.role?.toLowerCase() === "editor";

  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-40">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6 md:px-10 h-24 relative">
        {/* LEFT GROUP: Mobile Trigger + Logo + Desktop Links */}
        <div className="flex items-center gap-8">
          <MobileNav
            categories={categories}
            session={session}
            hasActiveSub={hasActiveSub}
            handleLogout={handleLogout}
            initialWeather={initialWeather}
          />

          <Link
            href="/"
            aria-label="Nordic Express Home"
            className="group flex items-center gap-2 font-bold text-2xl shrink-0 tracking-tight uppercase"
          >
            <span className="hidden sm:flex items-center gap-2">
              <span className="text-slate-900 dark:text-slate-100">Nordic</span>
              <span className="text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </span>
              <span className="text-cyan-700 dark:text-cyan-300 font-extrabold">Express</span>
            </span>
            <span className="sm:hidden flex items-center gap-1 text-3xl font-black">
              <span className="text-slate-900 dark:text-slate-100">N</span>
              <span className="text-cyan-500 text-xl rotate-0 group-hover:rotate-12 transition-transform" aria-hidden="true">↗</span>
              <span className="text-cyan-600 dark:text-cyan-300">E</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 ml-6 border-l pl-10 border-border">
            <Link
              href="/articles"
              className="font-semibold text-blue-600 hover:underline"
            >
              Newsfeed
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="hover:text-blue-600 transition-colors hidden lg:inline-block font-medium"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT GROUP: Weather + Auth + Theme */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Weather - Desktop only, moved to actions for safety */}
          <div className="hidden lg:block">
            <WeatherWidget initialData={initialWeather} />
          </div>


          {!isPending && !session ? (
            <Link
              href="/login"
              aria-label="Login to your account"
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm shadow-md"
            >
              Login
            </Link>
          ) : (
            !isPending && (
              <button
                onClick={handleLogout}
                aria-label="Logout from your account"
                className="px-4 py-2.5 sm:px-6 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm flex items-center gap-2 shadow-md"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full hidden sm:flex shadow-md"
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full hidden sm:flex shadow-md"
              forceAccountRedirect={true}
            />
          )}

          <div className="border-l pl-6 border-border ml-2 flex items-center gap-4">
            <ModeToggle />

            <div className="hidden md:flex items-center gap-4 border-l pl-4 border-border/50">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2 px-4 border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500 hover:text-white transition-all duration-300 font-bold group shadow-sm">
                    <LayoutDashboard className="h-4 w-4 text-cyan-600 dark:text-cyan-400 group-hover:text-white transition-colors" />
                    <span className="hidden xl:inline">Admin Dashboard</span>
                  </Button>
                </Link>
              )}

              {isEditor && !isAdmin && (
                <Link href="/admin/articles">
                  <Button variant="outline" size="sm" className="gap-2 px-4 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold group shadow-sm">
                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                    <span className="hidden xl:inline">Editor Workspace</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
