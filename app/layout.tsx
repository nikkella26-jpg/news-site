import { EB_Garamond } from "next/font/google";
import "./globals.css";
import GlobalAlert from "@/components/global-alert";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning className={garamond.variable}>
      <body className={`${garamond.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalAlert />
          <Header />
          <main className="flex-1 container mx-auto px-4">
            {children}
          </main>
          <Footer />

          {/* UI Feedback och Consent */}
          <Toaster position="top-center" richColors />
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
