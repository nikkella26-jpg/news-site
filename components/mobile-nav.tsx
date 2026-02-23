"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, LayoutDashboard, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import AccountAccessButton from "@/components/AccountAccessButton";
import WeatherWidget from "./weatherWidget";

interface MobileNavProps {
    categories: string[];
    session: any;
    hasActiveSub: boolean;
    handleLogout: () => Promise<void>;
    initialWeather?: any;
}

export default function MobileNav({
    categories,
    session,
    hasActiveSub,
    handleLogout,
    initialWeather,
}: MobileNavProps) {
    const [open, setOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const isAdmin = session?.user?.role?.toLowerCase() === "admin";
    const isEditor = session?.user?.role?.toLowerCase() === "editor";

    if (!hasMounted) {
        return (
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-6 font-garamond">
                    <div className="flex items-center justify-between px-2">
                        <WeatherWidget initialData={initialWeather} />
                        <ModeToggle />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="text-lg font-bold"
                        >
                            Home
                        </Link>
                        <Link
                            href="/articles"
                            onClick={() => setOpen(false)}
                            className="text-lg font-semibold text-blue-600"
                        >
                            Newsfeed
                        </Link>
                        <div className="h-px bg-border my-2" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">
                            Categories
                        </p>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/category/${cat.toLowerCase()}`}
                                onClick={() => setOpen(false)}
                                className="text-lg pl-2 hover:text-blue-600 transition-colors"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>

                    <div className="h-px bg-border my-2" />

                    <div className="flex flex-col gap-4">
                        {isAdmin && (
                            <Link href="/admin" onClick={() => setOpen(false)}>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Admin Dashboard
                                </Button>
                            </Link>
                        )}

                        {isEditor && !isAdmin && (
                            <Link href="/admin/articles" onClick={() => setOpen(false)}>
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <FileText className="h-4 w-4" />
                                    Editor Dashboard
                                </Button>
                            </Link>
                        )}

                        {session ? (
                            <>
                                <AccountAccessButton
                                    labelOverride={{
                                        noSub: "Account",
                                        withSub: "Account",
                                    }}
                                    subscribePath="/subscribe"
                                    accountPath="/account/subscription"
                                    variant="default"
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                                    forceAccountRedirect={true}
                                    onClickAction={() => setOpen(false)}
                                />
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        handleLogout();
                                        setOpen(false);
                                    }}
                                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setOpen(false)}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Login
                                    </Button>
                                </Link>
                                <AccountAccessButton
                                    labelOverride={{
                                        noSub: "Subscribe",
                                        noSession: "Subscribe",
                                    }}
                                    subscribePath="/subscribe"
                                    accountPath="/account/subscription"
                                    variant="outline"
                                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                                    onClickAction={() => setOpen(false)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
