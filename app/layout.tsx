import { EB_Garamond } from "next/font/google";
import { headers } from "next/headers";
import { Metadata } from "next";
import "./globals.css";
import GlobalAlert from "@/components/global-alert";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import CookieBannerWrapper from "@/components/CookieBannerWrapper";
import { getActiveAlert } from "@/actions/alert-actions";
import { fetchWeatherByLocation } from "@/lib/weather";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nordic Express | Premium Nordic News",
    template: "%s | Nordic Express"
  },
  description: "Nordic Express delivers premium, forward-looking news and analysis from the heart of the Nordics. Stay ahead with the latest in politics, tech, and world events.",
  keywords: ["Nordic News", "Scandinavian News", "Nordic Express", "Top Stories", "Nordic Politics"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeAlert = await getActiveAlert();

  // Detect User Location from Headers (e.g., Vercel Geo)
  const headerList = await headers();
  const detectedCity = headerList.get("x-vercel-ip-city");
  const weatherCity = detectedCity ? decodeURIComponent(detectedCity) : "Stockholm";

  // Fetch initial weather for Header
  let initialWeather = null;
  try {
    const weatherData = await fetchWeatherByLocation(weatherCity, {
      next: { revalidate: 10800 } // 3 hours
    });
    if (weatherData?.timeseries?.[0]) {
      initialWeather = {
        city: weatherCity,
        temp: Math.round(weatherData.timeseries[0].temp),
        summary: weatherData.timeseries[0].summary
      };
    }
  } catch (e) {
    console.error(`Failed to fetch initial weather for ${weatherCity}`, e);
  }
  return (
    <html lang="sv" suppressHydrationWarning className={garamond.variable}>
      <body className={`${garamond.className} min-h-screen flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold shadow-xl"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalAlert initialAlert={activeAlert} />
          <Header initialWeather={initialWeather} />
          <main id="main-content" className="flex-1 container mx-auto px-4 outline-none" tabIndex={-1}>
            {children}
          </main>
          <Footer />

          {/* UI Feedback och Consent */}
          <Toaster position="top-center" richColors />
          <CookieBannerWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
