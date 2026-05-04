import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Shrine", description: "Play. Swap. Mint." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-8rem)] max-w-6xl mx-auto px-6 py-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}