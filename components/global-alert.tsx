"use client";

import { usePathname } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getActiveAlert } from "@/actions/alert-actions";

export default function GlobalAlert() {
    const [alert, setAlert] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchAlert() {
            const activeAlert = await getActiveAlert();
            if (activeAlert) {
                setAlert(activeAlert);
            } else {
                setAlert(null);
            }
        }
        fetchAlert();
    }, [pathname]);

    if (!alert || !isVisible) return null;

    return (
        <div className="relative z-100 bg-rose-600 text-white selection:bg-white selection:text-rose-600">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex-1 flex items-center min-w-0">
                        <span className="flex p-2 rounded-lg bg-rose-700">
                            <AlertTriangle className="h-5 w-5 animate-pulse" aria-hidden="true" />
                        </span>
                        <div className="ml-3 font-medium truncate">
                            <span className="md:hidden text-sm uppercase font-black tracking-tighter mr-2">Severe Alert:</span>
                            <span className="hidden md:inline text-xs font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded mr-3">Emergency Alert</span>
                            <span className="text-sm font-bold">
                                {alert.title} &mdash;
                                <span className="hidden lg:inline ml-1 font-medium text-rose-100">
                                    {alert.message}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="whitespace-nowrap inline-flex items-center px-4 py-1.5 border border-transparent rounded-full shadow-sm text-xs font-black uppercase tracking-widest text-rose-600 bg-white hover:bg-rose-50 transition-colors">
                            Safety Info
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 rounded-md hover:bg-rose-700 focus:outline-hidden transition-colors"
                        >
                            <span className="sr-only">Dismiss</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom decorative line for premium feel */}
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />
        </div>
    );
}
