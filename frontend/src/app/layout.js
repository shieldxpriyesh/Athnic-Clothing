import { Barlow_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import MobileNav from "@/components/MobileNav";
import Script from "next/script";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "ATHNIC CLOTHING — Catch the Vibe. Join the Tribe.",
  description:
    "Raw, unapologetic Indian streetwear. Oversized tees, hoodies, cargos & more. Not for everyone.",
  keywords: "streetwear, Indian fashion, Gen Z, oversized, hoodies, athnic",
  openGraph: {
    title: "ATHNIC CLOTHING",
    description: "Catch the Vibe. Join the Tribe. Indian streetwear that hits different.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${spaceMono.variable}`}>
      <body className="bg-athnic-black text-athnic-off-white font-mono antialiased">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
