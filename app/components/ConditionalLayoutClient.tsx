"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton";
import NotificationSystem from "./NotificationSystem";

export default function ConditionalLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Rutas donde no mostrar Header y Footer
  const adminRoutes = ['/login/admin', '/login/afiliados/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname?.startsWith(route));
  
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
      <Footer />
      <StickyBar />
      <WhatsAppFloatingButton />
      <NotificationSystem />
    </>
  );
}

