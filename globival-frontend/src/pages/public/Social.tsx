// Reemplazar todo el componente con esta versión mejorada

"use client"

import { FaQuoteLeft, FaStar, FaInstagram, FaFacebook } from "react-icons/fa"
import { FaTiktok as FaTiktokIcon } from "react-icons/fa6"
import { motion } from "framer-motion"

// Importar las imágenes de testimonios
import testimonio1 from "../../assets/testimonio1.jpeg"
// (imports de imágenes locales no utilizadas eliminadas)

import api from "../../services/api"
import { IMAGE_BASE_URL } from "../../config/constants"
import { useEffect, useState } from "react"
import React from "react"

// Helper para construir URLs de imagen evitando dobles "/storage" y barras
const buildImageUrl = (path?: string) => {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  const clean = path.replace(/^\/+/, "")
  return clean.startsWith("storage/")
    ? `${IMAGE_BASE_URL}/${clean}`
    : `${IMAGE_BASE_URL}/storage/${clean}`
}

// Definimos la interfaz para los testimonios
interface Testimonial {
  id: number;
  name: string;
  message: string;
  image: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Componente para testimonios
const TestimoniosSection = () => {
  const [testimonios, setTestimonios] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/testimonials?active=true`);
        setTestimonios(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar testimonios:", err);
        setError("No se pudieron cargar los testimonios");
        setLoading(false);
      }
    };

    fetchTestimonios();
  }, []);

  if (loading) return <p className="text-center text-muted-foreground">Cargando testimonios...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (testimonios.length === 0) return <p className="text-center text-muted-foreground">No hay testimonios disponibles</p>;

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
};

// Datos de respaldo en caso de que la API no esté disponible
// (datos de testimonios estáticos no utilizados eliminados)

// Sección de Testimonios de Clientes
const TestimoniosClientesSection = () => {
  return (
    <section className="py-8 px-2 bg-card rounded-2xl backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] max-w-[1200px] mx-auto my-4">
      <h2 className="text-center font-bold mb-6 text-3xl bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
        Testimonios de Nuestros Clientes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center items-stretch">
        <TestimoniosSection />
      </div>
    </section>
  );
};

// (keyframes no utilizados eliminados)

// (constantes no utilizadas eliminadas)

// Simple reusable Error Boundary to catch rendering errors in this page
class ErrorBoundary extends React.Component<React.PropsWithChildren<Record<string, never>>, { hasError: boolean }> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, info: unknown) {
    console.error("ErrorBoundary captured an error in Social page:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 my-6 rounded-md bg-red-100">
          <h5 className="font-bold mb-1 text-xl">
            Algo salió mal
          </h5>
          <p className="text-muted-foreground">
            Hubo un problema al cargar esta sección. Por favor, recarga la página o intenta más tarde.
          </p>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

// Functional card component to render testimonials
interface TestimonioCardProps {
  nombre: string;
  cargo: string;
  comentario: string;
  rating: number;
  imagen: string;
}

const TestimonioCard: React.FC<TestimonioCardProps> = ({ nombre, cargo, comentario, rating, imagen }) => {
  return (
    <div className="col-span-1">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-md p-4 relative transition-transform duration-300 flex flex-col h-full shadow-md border border-border overflow-hidden backdrop-blur-md hover:translate-y-[-15px] hover:scale-[1.02] hover:shadow-xl"
      >
        <div className="absolute top-4 right-4 text-primary opacity-20 text-2xl">
          <FaQuoteLeft />
        </div>

        <div className="w-full h-[400px] rounded-md overflow-hidden mb-4 bg-muted order-first relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-black/70 pointer-events-none z-10"></div>
          <img
            src={imagen}
            alt={`Foto de ${nombre}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback si la imagen no carga
              (e.currentTarget as HTMLImageElement).src = String(testimonio1);
            }}
          />
        </div>

        <div className="mb-4 text-center">
          <h4 className="m-0 mb-1 text-primary">{nombre}</h4>
          <p className="text-muted-foreground text-sm m-0">{cargo}</p>
        </div>

        <div className="mb-4 text-muted-foreground leading-relaxed relative z-[1]">
          {comentario}
        </div>

        <div className="flex mb-4 justify-center">
          {Array.from({ length: Math.max(0, Math.min(5, rating)) }).map((_, i) => (
            <FaStar key={i} className="text-gift-rose mr-1" />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Instagram section implementation
const InstagramFeedSection = () => {
  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        Síguenos en <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">Redes Sociales</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        <motion.a
          href="https://www.instagram.com/globival.detalles/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-card rounded-md p-8 flex flex-col items-center text-center shadow-md border border-border no-underline relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:translate-y-[-15px] hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="text-gift-rose text-5xl mb-6">
            <FaInstagram />
          </div>
          <h3 className="mb-2 text-foreground">Instagram</h3>
          <p className="text-muted-foreground mb-6">
            Descubre nuestro contenido, novedades y momentos especiales.
          </p>
          <span className="inline-block bg-gradient-to-r from-primary to-primary text-white py-2 px-6 rounded-md font-semibold transition-all duration-200 hover:scale-105 hover:shadow-[0_5px_15px_rgba(237,125,160,0.3)]">
            Visitar perfil
          </span>
        </motion.a>

        <motion.a
          href="https://www.tiktok.com/@globival.detalles"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-card rounded-md p-8 flex flex-col items-center text-center shadow-md border border-border no-underline relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:translate-y-[-15px] hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="text-gift-rose text-5xl mb-6">
            <FaTiktokIcon />
          </div>
          <h3 className="mb-2 text-foreground">TikTok</h3>
          <p className="text-muted-foreground mb-6">
            Videos, tendencias y demostraciones de nuestros productos.
          </p>
          <span className="inline-block bg-gradient-to-r from-primary to-primary text-white py-2 px-6 rounded-md font-semibold transition-all duration-200 hover:scale-105 hover:shadow-[0_5px_15px_rgba(237,125,160,0.3)]">
            Visitar perfil
          </span>
        </motion.a>

        <motion.a
          href="https://www.facebook.com/profile.php?id=61572916207328"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-card rounded-md p-8 flex flex-col items-center text-center shadow-md border border-border no-underline relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:translate-y-[-15px] hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="text-gift-rose text-5xl mb-6">
            <FaFacebook />
          </div>
          <h3 className="mb-2 text-foreground">Facebook</h3>
          <p className="text-muted-foreground mb-6">
            Sigue nuestras publicaciones y eventos especiales.
          </p>
          <span className="inline-block bg-gradient-to-r from-primary to-primary text-white py-2 px-6 rounded-md font-semibold transition-all duration-200 hover:scale-105 hover:shadow-[0_5px_15px_rgba(237,125,160,0.3)]">
            Visitar perfil
          </span>
        </motion.a>
      </div>
    </section>
  );
}

// Simple call-to-action section
const CallToAction = () => {
  return (
    <div className="text-center my-8">
      <h5 className="font-bold mb-1 text-xl text-gift-rose">
        ¿Listo para crear momentos especiales?
      </h5>
      <p className="text-muted-foreground mb-3">
        Explora nuestros productos y encuentra el regalo perfecto.
      </p>
      <a
        href="/products"
        className="inline-block py-3 px-5 rounded-lg text-white no-underline bg-gradient-to-r from-primary to-primary hover:shadow-lg transition-shadow duration-300"
      >
        Ver productos
      </a>
    </div>
  );
}

const Social = () => {
  return (
    <ErrorBoundary>
      <>
        {/* Fondo con animaciones */}
        <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--primary),transparent_40%),radial-gradient(circle_at_80%_70%,var(--primary),transparent_40%),radial-gradient(circle_at_40%_80%,var(--primary),transparent_30%)] animate-[floatingOrbs_20s_ease-in-out_infinite_alternate] opacity-60"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,var(--primary)_50%,transparent_100%),linear-gradient(-45deg,transparent_0%,var(--primary)_50%,transparent_100%)] bg-[length:200%_200%] animate-[gradientShift_15s_ease-in-out_infinite] opacity-10"></div>
        </div>
        
        <div className="container mx-auto relative z-10 py-4">
          <div className="mb-6">
            <h1 className="text-center font-bold text-2xl md:text-3xl lg:text-4xl mb-2 bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              Nuestra Comunidad Social
            </h1>
            <p className="text-center text-muted-foreground text-lg max-w-[800px] mx-auto mb-4">
              Conecta con nosotros en redes sociales y descubre cómo nuestros
              productos crean momentos especiales para nuestros clientes.
            </p>
          </div>

          {/* Testimonios de Clientes */}
          <TestimoniosClientesSection />

          {/* Instagram Feed Section */}
          <InstagramFeedSection />

          {/* Call to Action */}
          <CallToAction />
        </div>
      </>
    </ErrorBoundary>
  );
}

export default Social
