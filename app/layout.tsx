import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import ConditionalLayoutClient from "./components/ConditionalLayoutClient";

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
  icons: {
    icon: '/image/logo-oficial.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${poppins.variable} antialiased`}>
        <ConditionalLayoutClient>
          {children}
        </ConditionalLayoutClient>
      </body>
    </html>
  );
}
