import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StickyBar from "./components/StickyBar";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Therapy Aqua Spa",
  description: "Respira. Relájate. Renueva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${poppins.variable} antialiased`}>
        <Header />
        <div className="pt-16">{children}</div>
        <Footer />
        <StickyBar />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
