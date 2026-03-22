"use client";

import { MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";
import { BUSINESS } from "@/config/constants";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido principal
        </a>
        <Header />

        <main id="main-content" className="flex-1">{children}</main>

        <Footer />

        {/* WhatsApp floating button */}
        <a
          href={BUSINESS.whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-110 hover:bg-whatsapp/90"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle size={28} />
        </a>

        {/* Cart drawer */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
