"use client";

import Image from "next/image";
import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { motion, AnimatePresence } from "framer-motion";
import { buildImageUrl } from "@/config/constants";
import { useCart } from "@/contexts/CartContext";

export default function CartDrawer() {
  const {
    items,
    count,
    total,
    isOpen,
    close,
    removeItem,
    updateQuantity,
    clearCart,
    getWhatsAppCartLink,
    formatCurrency,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Drawer panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Mi Carrito
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "producto" : "productos"}
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag
                      size={36}
                      className="text-muted-foreground/50"
                    />
                  </div>
                  <p className="mb-2 text-base font-medium text-foreground/80">
                    Tu carrito esta vacio
                  </p>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Explora nuestro catalogo y agrega productos
                  </p>
                  <Link
                    href="/catalogo"
                    onClick={close}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Ver Catalogo <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((ci) => (
                    <li
                      key={ci.productId}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/producto/${ci.productId}`}
                        onClick={close}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                      >
                        <Image
                          src={buildImageUrl(ci.imagen)}
                          alt={ci.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </Link>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/producto/${ci.productId}`}
                          onClick={close}
                          className="block truncate text-sm font-medium text-foreground hover:text-primary"
                        >
                          {ci.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(ci.price)} c/u
                        </p>

                        {/* Quantity controls */}
                        <div className="mt-1.5 flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(ci.productId, -1)}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
                            aria-label={`Reducir cantidad de ${ci.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-[28px] text-center text-sm font-medium">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(ci.productId, 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
                            aria-label={`Aumentar cantidad de ${ci.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal + remove */}
                      <div className="flex flex-col items-end gap-1.5">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(ci.price * ci.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(ci.productId)}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Eliminar ${ci.name} del carrito`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4">
                {/* Summary */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {count} {count === 1 ? "articulo" : "articulos"}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {formatCurrency(total)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5">
                  <a
                    href={getWhatsAppCartLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-whatsapp/80"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Pedir por WhatsApp
                  </a>
                  <button
                    onClick={clearCart}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
