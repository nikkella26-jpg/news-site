import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
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
