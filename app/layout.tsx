import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FavoritesProvider } from "@/components/favorites-provider";
import { TripProvider } from "@/components/trip-provider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Triply — Discover More. Plan Better. Travel Further.",
  description:
    "Find the places that move you, then bring every detail of your next journey together with Triply.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
      <body>
        <FavoritesProvider>
          <TripProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </TripProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
