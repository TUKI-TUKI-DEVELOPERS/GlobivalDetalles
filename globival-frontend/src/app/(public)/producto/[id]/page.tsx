"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { productService, extractArray, extractObject } from "@/services/api";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { motion } from "framer-motion";
import { buildImageUrl, BLUR_DATA_URL, BUSINESS } from "@/config/constants";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";
import { getSubCategory } from "@/types";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function DetalleProductoPage() {
  const params = useParams();
  const id = params.id as string;
  const cart = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(Number(id));
        const productData = extractObject<Product>(response);
        setProduct(productData);

        // Related products (same subcategory)
        const allProductsRes = await productService.getAll();
        const related = extractArray<Product>(allProductsRes)
          .filter(
            (p) =>
              getSubCategory(p)?.id === getSubCategory(productData)?.id &&
              p.id !== productData.id
          )
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getWhatsAppLink = (p: Product) => {
    if (!p) return "#";
    const hasOffer = p.precio_de_oferta && p.precio_de_oferta !== "";
    const priceText = hasOffer
      ? `S/ ${p.precio_de_oferta}`
      : `S/ ${p.price}`;
    const message = `Hola, estoy interesado en el producto "${p.name}" con precio ${priceText}. Podrias darme mas informacion?`;
    return BUSINESS.whatsappUrl(message);
  };

  const addToCart = (p: Product) => {
    cart.addProduct(p);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 min-h-[calc(100vh-160px)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-12 text-muted-foreground"
        >
          Cargando producto...
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 min-h-[calc(100vh-160px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            Producto no encontrado
          </h2>
          <Link
            href="/catalogo"
            className="inline-flex items-center text-muted-foreground py-2 px-4 rounded bg-card shadow-sm border border-border transition-all duration-200 hover:text-primary hover:-translate-x-1 hover:shadow-md"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Volver al catalogo
          </Link>
        </motion.div>
      </div>
    );
  }

  const hasOffer =
    product.precio_de_oferta !== null && product.precio_de_oferta !== "";

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-background" />

      <div className="container mx-auto py-8 relative z-10 bg-background min-h-[calc(100vh-160px)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            href="/catalogo"
            className="inline-flex items-center text-muted-foreground py-2 px-4 rounded bg-card shadow-sm border border-border transition-all duration-200 hover:text-primary hover:-translate-x-1 hover:shadow-md"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Volver al catalogo
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-md overflow-hidden shadow-md border border-border relative aspect-square"
          >
            <Image
              src={buildImageUrl(product.imagen)}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-md p-6 shadow-md border border-border relative"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-primary text-sm font-medium mb-2"
            >
              {getSubCategory(product)?.name || "Categoria"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl font-bold mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-12 after:h-0.5 after:bg-primary"
            >
              {product.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center mb-6"
            >
              {hasOffer ? (
                <>
                  <span className="text-muted-foreground line-through mr-4 text-lg">
                    S/ {product.price}
                  </span>
                  <span className="text-primary font-semibold text-2xl">
                    S/ {product.precio_de_oferta}
                  </span>
                </>
              ) : (
                <span className="text-primary font-semibold text-2xl">
                  S/ {product.price}
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8 text-muted-foreground leading-relaxed"
            >
              <p>{product.description || "Sin descripcion disponible."}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8 bg-card/80 p-4 rounded-md shadow-sm"
            >
              <p className="flex items-center mb-2 text-foreground">
                <Check className="text-primary mr-2 w-4 h-4" /> ID:{" "}
                {product.id}
              </p>
              <p className="flex items-center text-foreground">
                <Check className="text-primary mr-2 w-4 h-4" /> Disponibilidad:{" "}
                {product.stock > 0 ? "En stock" : "Agotado"}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product)}
                className="inline-flex items-center gap-2 bg-primary text-white py-3 px-6 rounded-md font-semibold text-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {addedToCart ? "Agregado!" : "Agregar al Carrito"}
              </motion.button>
              <motion.a
                href={getWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-whatsapp text-white py-3 px-6 rounded-md font-semibold text-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <WhatsAppIcon className="w-6 h-6" /> Contactar por WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 text-xl font-bold"
            >
              Productos{" "}
              <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-primary">
                Relacionados
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related, index) => {
                const relHasOffer =
                  related.precio_de_oferta !== null &&
                  related.precio_de_oferta !== "";
                return (
                  <motion.div
                    key={related.id}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={cardVariants}
                    whileHover={{ scale: 1.03 }}
                    className="bg-card rounded-md overflow-hidden shadow-md border border-border relative hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/producto/${related.id}`}>
                      <div className="h-[200px] bg-card/50 relative overflow-hidden">
                        <Image
                          src={buildImageUrl(related.imagen)}
                          alt={related.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                        />
                        {relHasOffer && (
                          <div className="absolute top-2 left-2 bg-primary text-white py-1 px-2 rounded text-xs font-semibold shadow-sm z-10">
                            Oferta
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-primary text-sm mb-1">
                          {getSubCategory(related)?.name || "Categoria"}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          {related.name}
                        </h3>
                        <div className="flex items-center">
                          {relHasOffer ? (
                            <>
                              <span className="text-muted-foreground line-through mr-2 text-sm">
                                S/ {related.price}
                              </span>
                              <span className="text-primary font-semibold text-lg">
                                S/ {related.precio_de_oferta}
                              </span>
                            </>
                          ) : (
                            <span className="text-primary font-semibold text-lg">
                              S/ {related.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
