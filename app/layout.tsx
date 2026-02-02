import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex gap-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/weather">Weather</Link>
              </li>
            </ul>
          </nav>

          <Header />
          <main className="flex-1 container mx-auto px-4">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
