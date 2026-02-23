"use client";

import dynamic from "next/dynamic";

const Banner = dynamic(
    () => import("./cookie-consent-banner").then((mod) => mod.CookieConsentBanner),
    { ssr: false }
);

export default function CookieBannerWrapper() {
    return <Banner />;
}
