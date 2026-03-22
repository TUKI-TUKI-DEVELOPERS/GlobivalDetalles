"use client";

import { useEffect } from "react";
import { MapPin, Mail, Instagram, Facebook, Gift, Heart, Star } from "lucide-react";
import { WhatsAppIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { motion } from "framer-motion";
import { BUSINESS } from "@/config/constants";

export default function AcercaDePage() {
  useEffect(() => {
    document.title = "Quiénes Somos | Globival Detalles";
  }, []);

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.1),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.1),transparent_50%)] opacity-60" />
      </div>

      <div className="relative z-10 py-8 bg-background min-h-[calc(100vh-160px)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-card p-8 md:p-10 mb-6 md:mb-8 rounded-lg shadow-lg border border-border relative overflow-hidden text-center backdrop-blur-xl">
            <motion.h1
              className="mb-3 md:mb-4 relative z-10 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Acerca de{" "}
              <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
                Globival &amp; Detalles
              </span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground max-w-3xl mx-auto relative z-10 text-base md:text-lg leading-relaxed"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Descubre nuestra historia, valores y mision para ayudarte a crear
              momentos inolvidables
            </motion.p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            <motion.div
              className="bg-card rounded-xl p-6 md:p-8 shadow-md border border-border relative backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-foreground text-2xl md:text-3xl font-semibold tracking-tight relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-transparent">
                Nuestra Historia
              </h2>
              <p className="mb-6 text-muted-foreground text-base md:text-lg leading-relaxed">
                Globival -- Sorpresas y Detalles que crean momentos inolvidables.
              </p>
              <p className="mb-6 text-muted-foreground text-base md:text-lg leading-relaxed">
                En Globival, creemos que cada detalle cuenta. Nos especializamos
                en la creacion de sorpresas y regalos unicos para cualquier
                ocasion: cumpleanos, aniversarios, fechas especiales y momentos
                espontaneos que merecen ser recordados.
              </p>
              <p className="mb-6 text-muted-foreground text-base md:text-lg leading-relaxed">
                Nuestro objetivo es ayudarte a emocionar y sorprender a tus
                seres queridos con detalles personalizados, creativos y llenos
                de amor. Desde arreglos con globos hasta cajas sorpresa, cada
                producto esta disenado con pasion para transmitir alegria y
                felicidad.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Dejanos ser parte de tus momentos especiales!
              </p>
            </motion.div>

            <motion.div
              className="bg-card rounded-lg overflow-hidden shadow-md border border-border relative backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:h-auto h-[300px]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-accent to-accent/80 dark:from-accent/20 dark:to-accent/10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-primary/60" />
                    <Gift className="w-16 h-16 text-primary" />
                    <Star className="w-8 h-8 text-primary/60" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Detalles con amor</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values section */}
          <section className="py-12 md:py-16 my-12 relative overflow-hidden rounded-xl">
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-center mb-8 relative text-2xl md:text-3xl font-bold tracking-tight text-foreground"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Nuestros{" "}
                <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
                  Valores
                </span>
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
                {[
                  {
                    title: "Personalizacion",
                    desc: "Disenamos cada sorpresa pensando en la persona, cuidando gustos y detalles unicos.",
                  },
                  {
                    title: "Creatividad",
                    desc: "Exploramos ideas frescas para armar arreglos con globos, cajas sorpresa y presentaciones memorables.",
                  },
                  {
                    title: "Calidad y detalle",
                    desc: "Seleccionamos materiales de alta calidad y acabados cuidados para que cada entrega sea perfecta.",
                  },
                  {
                    title: "Alegria y emocion",
                    desc: "Buscamos generar sonrisas y momentos inolvidables en cada ocasion.",
                  },
                ].map((value, i) => (
                  <motion.div
                    key={value.title}
                    className="bg-card p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-border relative overflow-hidden backdrop-blur-lg hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                  >
                    <h3 className="text-foreground text-lg md:text-xl font-semibold mb-3 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {value.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact section */}
          <section className="py-12 md:py-16 relative overflow-hidden rounded-xl mt-12">
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-center mb-8 relative text-2xl md:text-3xl font-bold tracking-tight text-foreground"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
                  Contactanos
                </span>
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div
                  className="bg-card p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-border relative backdrop-blur-lg hover:-translate-y-1 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <MapPin className="text-primary w-8 h-8 mx-auto mb-4" />
                  <h3 className="mb-2 text-foreground text-base md:text-lg font-medium">
                    Envios
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Envios a todo Arequipa
                  </p>
                </motion.div>

                <motion.a
                  href={BUSINESS.whatsappUrl("Hola, estoy interesado en sus productos y quiero mas informacion.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-border relative backdrop-blur-lg hover:-translate-y-1 hover:shadow-lg block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <WhatsAppIcon className="text-primary w-8 h-8 mx-auto mb-4" />
                  <h3 className="mb-2 text-foreground text-base md:text-lg font-medium">
                    WhatsApp
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {BUSINESS.phoneDisplay}
                  </p>
                </motion.a>

                <motion.a
                  href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent("Consulta Globival Detalles")}`}
                  className="bg-card p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-border relative backdrop-blur-lg hover:-translate-y-1 hover:shadow-lg block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Mail className="text-primary w-8 h-8 mx-auto mb-4" />
                  <h3 className="mb-2 text-foreground text-base md:text-lg font-medium">
                    Email
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {BUSINESS.email}
                  </p>
                </motion.a>
              </div>

              {/* Social links */}
              <div className="flex justify-center mt-8 space-x-4">
                {[
                  {
                    href: BUSINESS.social.facebook,
                    icon: <Facebook className="w-4 h-4" />,
                  },
                  {
                    href: BUSINESS.social.instagram,
                    icon: <Instagram className="w-4 h-4" />,
                  },
                  {
                    href: BUSINESS.social.tiktok,
                    icon: <TikTokIcon className="w-4 h-4" />,
                  },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-card text-primary border border-border transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
