"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Rutas donde no mostrar Header y Footer
  const adminRoutes = ['/login/admin', '/login/afiliados/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname?.startsWith(route));

  return (
    <>
      {!isAdminRoute && <Header />}
      <div className={!isAdminRoute ? "pt-16" : ""}>{children}</div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <StickyBar />}
      {!isAdminRoute && <WhatsAppFloatingButton />}
    </>
  );
}


















