"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Gift,
  Cake,
  Heart,
  Ribbon,
  Eye,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { motion } from "framer-motion";
import { bannerService, productService, extractArray } from "@/services/api";
import { buildImageUrl, BLUR_DATA_URL, BUSINESS } from "@/config/constants";
import type { Banner, Product } from "@/types";
import { getSubCategory } from "@/types";
import ProductModal from "@/components/ui/ProductModal";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    document.title = "Inicio | Globival Detalles";
  }, []);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getAll();
        const items = extractArray<Banner>(res).filter(
          (b) => b.image && b.active
        );
        setBanners(items);
        setCurrentSlide(0);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Fetch featured products from /products/featured endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getFeatured();
        const products = extractArray<Product>(response);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchProducts();
  }, []);

  const displayBanners = banners.length > 0 ? banners : [];

  // Auto-advance carousel
  useEffect(() => {
    if (displayBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === displayBanners.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === displayBanners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? displayBanners.length - 1 : prev - 1
    );
  };

  const getBannerImageUrl = (banner: Banner) => buildImageUrl(banner.image);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/80 overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80" />
        <div className="absolute inset-0 opacity-60 dark:opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.3),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.3),transparent_40%)]" />
        </div>
      </div>

      {/* Hero Section - Banner Carousel */}
      {displayBanners.length > 0 && (
        <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[80vh] max-h-[720px] overflow-hidden">
          {/* Slides */}
          {displayBanners.map((banner, index) => (
            <motion.div
              key={banner.id || index}
              initial={false}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
              aria-hidden={index !== currentSlide}
            >
              <Image
                src={getBannerImageUrl(banner)}
                alt={banner.title || `Banner ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
                {...(index !== 0 && { placeholder: "blur" as const, blurDataURL: BLUR_DATA_URL })}
              />
            </motion.div>
          ))}

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />

          {/* WhatsApp CTA */}
          <motion.a
            href={BUSINESS.whatsappUrl(
              "Deseo adquirir la promocion " +
                (displayBanners[currentSlide]?.title ?? "")
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-30 px-5 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full shadow-xl font-semibold flex items-center gap-2.5 hover:from-primary/90 hover:to-primary/70 transition-all max-w-[90vw]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            <span className="text-sm sm:text-base truncate">
              Adquiere la promocion{" "}
              {displayBanners[currentSlide]?.title ?? ""}
            </span>
          </motion.a>

          {/* Navigation arrows */}
          <button
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 transition-all hover:bg-white/40 cursor-pointer"
            onClick={prevSlide}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 transition-all hover:bg-white/40 cursor-pointer"
            onClick={nextSlide}
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                className={`rounded-full transition-all cursor-pointer ${
                  index === currentSlide
                    ? "w-8 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="pt-8 pb-16 bg-gradient-to-b from-background to-background/80 overflow-x-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 relative z-10 text-foreground"
        >
          Por que elegir{" "}
          <span className="text-primary relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
            nuestros detalles artesanales
          </span>
        </motion.h2>

        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            {
              icon: <Gift className="w-10 h-10" />,
              title: "Calidad Premium",
              desc: "Productos seleccionados con los mas altos estandares de calidad para garantizar durabilidad y satisfaccion.",
            },
            {
              icon: <Cake className="w-10 h-10" />,
              title: "Envio especial",
              desc: "Envolvemos y entregamos tus sorpresas con cuidado, puntuales y listas para emocionar.",
            },
            {
              icon: <Heart className="w-10 h-10" />,
              title: "Atencion personalizada",
              desc: "Te ayudamos a elegir el detalle perfecto para cada ocasion especial.",
            },
            {
              icon: <Ribbon className="w-10 h-10" />,
              title: "Compra Segura",
              desc: "Transacciones seguras y protegidas para que sorprendas con total confianza.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              className="bg-card p-8 rounded-lg text-center shadow-md border border-border hover:-translate-y-2 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-primary mb-6 flex justify-center relative">
                {feature.icon}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="pt-16 pb-10 relative bg-card overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 relative z-10 text-foreground"
        >
          Productos{" "}
          <span className="text-primary relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
            Destacados
          </span>
        </motion.h2>

        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {featuredProducts.length > 0
            ? featuredProducts.map((product) => {
                const hasOffer =
                  product.precio_de_oferta !== null &&
                  product.precio_de_oferta !== "";
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-card rounded-lg overflow-hidden shadow-md border border-border hover:-translate-y-2 hover:shadow-xl transition-all group relative"
                  >
                    <Link href={`/producto/${product.id}`} className="block">
                      <div className="relative h-64 bg-muted overflow-hidden">
                        <Image
                          src={buildImageUrl(product.imagen)}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                        />
                        {hasOffer && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-sm font-semibold px-2 py-1 rounded shadow-md z-10">
                            Oferta
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-4 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white mx-1 hover:bg-primary transition-colors"
                            aria-label="Vista rápida"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-5 relative">
                        <div className="text-sm text-primary font-medium mb-2">
                          {getSubCategory(product)?.name || "General"}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors text-foreground">
                          {product.name}
                        </h3>
                        <div className="flex items-center">
                          {hasOffer ? (
                            <>
                              <span className="text-muted-foreground line-through mr-2">
                                S/ {product.price}
                              </span>
                              <span className="text-primary font-semibold text-lg">
                                S/ {product.precio_de_oferta}
                              </span>
                            </>
                          ) : (
                            <span className="text-primary font-semibold text-lg">
                              S/ {product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            : Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-lg overflow-hidden shadow-md border border-border"
                  >
                    <div className="h-64 bg-muted animate-pulse" />
                    <div className="p-5">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2 animate-pulse" />
                      <div className="h-6 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                      <div className="h-5 bg-muted rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-8 mb-0 relative z-10"
        >
          <Link
            href="/catalogo"
            className="inline-block px-8 py-3 border border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary/80 hover:text-white rounded-md font-semibold transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              Ver Todos los Productos{" "}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
