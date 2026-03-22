"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Quote, Star, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import { TikTokIcon } from "@/components/icons/SocialIcons";
import { testimonialService, extractArray } from "@/services/api";
import { buildImageUrl, BLUR_DATA_URL, BUSINESS } from "@/config/constants";
import type { Testimonial } from "@/types";

interface TestimonioCardProps {
  nombre: string;
  cargo: string;
  comentario: string;
  rating: number;
  imagen: string;
}

function TestimonioCard({
  nombre,
  cargo,
  comentario,
  rating,
  imagen,
}: TestimonioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-md p-4 relative transition-transform duration-300 flex flex-col h-full shadow-md border border-border overflow-hidden backdrop-blur-md hover:-translate-y-4 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="absolute top-4 right-4 text-primary opacity-20 text-2xl">
        <Quote className="w-6 h-6" />
      </div>

      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-[400px] rounded-md overflow-hidden mb-4 bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-black/70 pointer-events-none z-10" />
        <Image
          src={imagen}
          alt={`Foto de ${nombre}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>

      <div className="mb-4 text-center">
        <h4 className="m-0 mb-1 text-primary font-semibold">{nombre}</h4>
        <p className="text-muted-foreground text-sm m-0">{cargo}</p>
      </div>

      <div className="mb-4 text-muted-foreground leading-relaxed">
        {comentario}
      </div>

      <div className="flex mb-4 justify-center">
        {Array.from({ length: Math.max(0, Math.min(5, rating)) }).map(
          (_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-primary fill-primary mr-1"
            />
          )
        )}
      </div>
    </motion.div>
  );
}

function TestimoniosSection() {
  const [testimonios, setTestimonios] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        setLoading(true);
        const response = await testimonialService.getAll({ active: true });
        setTestimonios(extractArray<Testimonial>(response));
      } catch (err) {
        console.error("Error al cargar testimonios:", err);
        setError("No se pudieron cargar los testimonios");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonios();
  }, []);

  if (loading)
    return (
      <p className="text-center text-muted-foreground col-span-full">
        Cargando testimonios...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-destructive col-span-full">{error}</p>
    );
  if (testimonios.length === 0)
    return (
      <p className="text-center text-muted-foreground col-span-full">
        No hay testimonios disponibles
      </p>
    );

  return (
    <>
      {testimonios.map((testimonio) => (
        <TestimonioCard
          key={testimonio.id}
          nombre={testimonio.name}
          cargo="Cliente satisfecho"
          comentario={testimonio.message}
          rating={5}
          imagen={buildImageUrl(testimonio.image)}
        />
      ))}
    </>
  );
}

export default function SocialPage() {
  useEffect(() => {
    document.title = "Comunidad Social | Globival Detalles";
  }, []);

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.15),transparent_40%)] opacity-60" />
      </div>

      <div className="container mx-auto relative z-10 py-4">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl mb-2 text-primary">
            Nuestra Comunidad Social
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-[800px] mx-auto mb-4">
            Conecta con nosotros en redes sociales y descubre como nuestros
            productos crean momentos especiales para nuestros clientes.
          </p>
        </div>

        {/* Testimonials */}
        <section className="py-8 px-2 bg-card rounded-2xl backdrop-blur-md shadow-lg max-w-[1200px] mx-auto my-4">
          <h2 className="text-center font-bold mb-6 text-3xl text-primary">
            Testimonios de Nuestros Clientes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center items-stretch">
            <TestimoniosSection />
          </div>
        </section>

        {/* Social Media Links */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 text-2xl font-bold"
          >
            Siguenos en{" "}
            <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
              Redes Sociales
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
            {[
              {
                href: BUSINESS.social.instagram,
                icon: <Instagram className="w-12 h-12" />,
                name: "Instagram",
                desc: "Descubre nuestro contenido, novedades y momentos especiales.",
              },
              {
                href: BUSINESS.social.tiktok,
                icon: <TikTokIcon className="w-12 h-12" />,
                name: "TikTok",
                desc: "Videos, tendencias y demostraciones de nuestros productos.",
              },
              {
                href: BUSINESS.social.facebook,
                icon: <Facebook className="w-12 h-12" />,
                name: "Facebook",
                desc: "Sigue nuestras publicaciones y eventos especiales.",
              },
            ].map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card rounded-md p-8 flex flex-col items-center text-center shadow-md border border-border no-underline relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-4 hover:shadow-xl"
              >
                <div className="text-primary mb-6">{social.icon}</div>
                <h3 className="mb-2 text-foreground text-xl font-semibold">
                  {social.name}
                </h3>
                <p className="text-muted-foreground mb-6">{social.desc}</p>
                <span className="inline-block bg-primary text-white py-2 px-6 rounded-md font-semibold transition-all duration-200 hover:scale-105">
                  Visitar perfil
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center my-8">
          <h5 className="font-bold mb-1 text-xl text-primary">
            Listo para crear momentos especiales?
          </h5>
          <p className="text-muted-foreground mb-3">
            Explora nuestros productos y encuentra el regalo perfecto.
          </p>
          <Link
            href="/catalogo"
            className="inline-block py-3 px-5 rounded-lg text-white no-underline bg-primary hover:shadow-lg transition-shadow duration-300"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
