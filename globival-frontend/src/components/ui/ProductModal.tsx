"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildImageUrl, BLUR_DATA_URL, BUSINESS } from "@/config/constants";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";
import { getSubCategory } from "@/types";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const cart = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    cart.addProduct(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) return null;

  const hasOffer =
    product.precio_de_oferta !== null && product.precio_de_oferta !== "";
  const whatsappUrl = BUSINESS.whatsappUrl(
    `Hola, me interesa el producto: ${product.name} (SKU: ${product.SKU}). Precio: S/${hasOffer ? product.precio_de_oferta : product.price}`,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-background shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 rounded-full bg-background/80 p-2 text-foreground/60 backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative aspect-square w-full bg-muted md:w-1/2">
                <Image
                  src={buildImageUrl(product.imagen)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
                {hasOffer && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                    OFERTA
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {product.name}
                  </h2>

                  {getSubCategory(product) && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {getSubCategory(product)?.category?.name} /{" "}
                      {getSubCategory(product)?.name}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-3">
                    {hasOffer ? (
                      <>
                        <span className="text-2xl font-bold text-primary">
                          S/{product.precio_de_oferta}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          S/{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-foreground">
                        S/{product.price}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>SKU: {product.SKU}</span>
                    <span>
                      Stock:{" "}
                      <span
                        className={
                          product.stock > 0 ? "text-success" : "text-destructive"
                        }
                      >
                        {product.stock > 0
                          ? `${product.stock} disponibles`
                          : "Agotado"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex flex-col gap-2.5">
                  {product.stock > 0 && (
                    <button
                      onClick={handleAddToCart}
                      className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
                        addedToCart
                          ? "bg-success text-success-foreground"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
                      }`}
                    >
                      {addedToCart ? (
                        <>
                          <Check size={20} />
                          Agregado al carrito
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          Agregar al carrito
                        </>
                      )}
                    </button>
                  )}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3 font-semibold text-white transition-colors hover:bg-whatsapp/90 active:scale-[0.98]"
                  >
                    <MessageCircle size={20} />
                    Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
