"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaArrowRight,
  FaGift,
  FaBirthdayCake,
  FaHeart,
  FaRibbon,
  FaEye,
  FaExpand,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import api, { productService } from "../../services/api"
import { motion, AnimatePresence } from "framer-motion"
import { IMAGE_BASE_URL } from "../../config/constants"

// Helper para construir URLs de imagen evitando dobles "/storage" y barras
const buildImageUrl = (path?: string) => {
  if (!path) return ""
  if (/^https?:\/\//.test(path)) return path
  const clean = path.replace(/^\/+/, "")
  return clean.startsWith("storage/")
    ? `${IMAGE_BASE_URL}/${clean}`
    : `${IMAGE_BASE_URL}/storage/${clean}`
}
import { useTheme } from "../../contexts/ThemeContext"

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  precio_de_oferta?: number;
  stock: number;
  imagen?: string;
  subCategory?: {
    id: number;
    name: string;
  };
}

// Import images for the carousel
import banner1 from "../../assets/acerca2.jpeg"
import testimonio1 from "../../assets/acerca.jpeg"
import testimonio2 from "../../assets/acerca.jpeg"
import testimonio3 from "../../assets/acerca.jpeg"
import testimonio4 from "../../assets/acerca.jpeg"


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
useTheme();

  interface Banner { image: string; title: string }
  
  const fallbackBanners: Banner[] = [
    { image: banner1, title: "Promoción Especial" },
    { image: testimonio1, title: "Detalles Artesanales" },
    { image: testimonio2, title: "Regalos con Amor" },
    { image: testimonio3, title: "Sorpresas Únicas" },
    { image: testimonio4, title: "Momentos Memorables" },
  ]
  
  const [banners, setBanners] = useState<Banner[]>([])
  
  // Normaliza los precios que vienen como string (DECIMAL en Sequelize) a number
  const normalizeProduct = (p: unknown): Product => {
    const obj = p as Record<string, unknown>

    const priceRaw = obj.price as number | string | undefined
    const price = typeof priceRaw === "string" ? Number(priceRaw) : typeof priceRaw === "number" ? priceRaw : 0

    const offerRaw = obj.precio_de_oferta as number | string | null | undefined
    const offer = offerRaw == null
      ? undefined
      : typeof offerRaw === "string" ? Number(offerRaw) : typeof offerRaw === "number" ? offerRaw : undefined

    const idRaw = obj.id as number | string | undefined
    const id = typeof idRaw === "string" ? Number(idRaw) : typeof idRaw === "number" ? idRaw : 0

    const name = String(obj.name ?? "")
    const description = String(obj.description ?? "")

    const stockRaw = obj.stock as number | string | undefined
    const stock = typeof stockRaw === "string" ? Number(stockRaw) : typeof stockRaw === "number" ? stockRaw : 0

    const imagen = obj.imagen as string | undefined

    const sc = obj.subCategory as { id?: number | string; name?: unknown } | undefined
    const subCategory = sc && typeof sc === "object"
      ? { id: typeof sc.id === "string" ? Number(sc.id) : typeof sc.id === "number" ? sc.id : 0, name: String(sc.name ?? "General") }
      : undefined

    return {
      id,
      name,
      description,
      price: isNaN(price) ? 0 : price,
      precio_de_oferta: offer !== undefined && isNaN(offer as number) ? undefined : (offer as number | undefined),
      stock,
      imagen,
      subCategory,
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        const normalized = (response?.data ?? []).map((item: unknown) => normalizeProduct(item));
        setFeaturedProducts(normalized.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch banners for hero carousel
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get(`/banners`);
        const raw = (res?.data ?? []) as Array<{ image?: string; active?: boolean; title?: string }>
        const items = raw
          .filter((b) => Boolean(b?.image) && Boolean(b?.active))
          .map((b) => ({
            image: buildImageUrl(b.image),
            title: b?.title ?? "Promoción Especial",
          })) as Banner[];
        setBanners(items);
        setCurrentSlide(0);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const displayBanners = banners.length > 0 ? banners : fallbackBanners;

  useEffect(() => {
    if (displayBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/80 overflow-x-hidden">
      {/* Background with animations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80"></div>
        <div className="absolute inset-0 opacity-60 dark:opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--gift-rose)/30%,transparent_40%),radial-gradient(circle_at_80%_70%,var(--gift-rose)/30%,transparent_40%),radial-gradient(circle_at_40%_80%,var(--gift-rose)/30%,transparent_30%)]"></div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gift-rose to-transparent bg-[length:200%_200%] animate-gradient"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center text-center text-foreground overflow-hidden">
        {/* Carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {displayBanners.map((banner, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${banner.image})` }}
            />
          ))}
          {/* Removed dark overlay over carousel */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/60 z-10"></div> */}
        </div>

        {/* Botón flotante de WhatsApp sobre el carrusel */}
        <motion.a
          href={`https://wa.me/51997745679?text=${encodeURIComponent('Deseo adquirir la promoción ' + (displayBanners[currentSlide]?.title ?? ''))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute z-40 px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-gift-rose to-pink-500 text-white rounded-full shadow-xl ring-2 ring-white/70 font-semibold flex items-center gap-3 hover:brightness-95 max-w-[90vw] whitespace-nowrap"
          initial={{ opacity: 0.98 }}
          animate={{ opacity: [1, 1, 0.94, 1] }}
          transition={{ duration: 80, repeat: Infinity, ease: "easeInOut", times: [0, 0.94, 0.95, 1] }}
          whileHover={{ opacity: 1 }}
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 28px)", left: "50%", transform: "translateX(-50%)" }}
        >
          {/* Glow suave bajo el botón, con el mismo parpadeo mínimo */}
          <motion.span
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 45%, transparent 70%)",
              filter: "blur(6px)",
            }}
            animate={{ opacity: [0.7, 0.7, 0.62, 0.7] }}
            transition={{ duration: 80, repeat: Infinity, ease: "easeInOut", times: [0, 0.94, 0.95, 1] }}
          />

          <FaWhatsapp className="text-white text-xl md:text-2xl drop-shadow-sm" />
          <span className="text-sm md:text-lg">
            Adquiere la promoción {displayBanners[currentSlide]?.title ?? ""}
          </span>
        </motion.a>

        {/* Carousel Controls */}
        <button 
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-gift-rose text-white p-4 rounded-full z-20 transition-all hover:brightness-95 shadow-lg"
          onClick={prevSlide}
        >
          <FaChevronLeft />
        </button>
        <button 
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-gift-rose text-white p-4 rounded-full z-20 transition-all hover:brightness-95 shadow-lg"
          onClick={nextSlide}
        >
          <FaChevronRight />
        </button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {displayBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "dot-neutral-active" : "dot-neutral hover:bg-gift-rose"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Hero Content removed per request: show banners only without any text */}
      </section>

      {/* Features Section */}
      <section className="pt-8 pb-16 bg-gradient-to-b from-background to-background/80 overflow-x-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(240,98,146,0.3)_0%,transparent_70%)] animate-pulse"></div>
        </div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 relative z-10 text-foreground"
        >
          Por qué elegir <span className="text-gift-rose relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gift-rose after:to-transparent">nuestros detalles artesanales</span>
        </motion.h2>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white card-dark p-8 rounded-lg text-center shadow-md border hover:-translate-y-2 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gift-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-4xl text-gift-rose mb-6 relative">
              <FaGift />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gift-rose to-transparent"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 dark:text-white">Calidad Premium</h3>
            <p className="text-gray-600 dark:text-gray-300">Productos seleccionados con los más altos estándares de calidad para garantizar durabilidad y satisfacción.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white card-dark p-8 rounded-lg text-center shadow-md border hover:-translate-y-2 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gift-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-4xl text-gift-rose mb-6 relative">
              <FaBirthdayCake />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gift-rose to-transparent"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 dark:text-white">Envío especial</h3>
            <p className="text-gray-600 dark:text-gray-300">Envolvemos y entregamos tus sorpresas con cuidado, puntuales y listas para emocionar.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white card-dark p-8 rounded-lg text-center shadow-md border hover:-translate-y-2 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gift-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-4xl text-gift-rose mb-6 relative">
              <FaHeart />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gift-rose to-transparent"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 dark:text-white">Atención personalizada</h3>
            <p className="text-gray-600 dark:text-gray-300">Te ayudamos a elegir el detalle perfecto para cada ocasión especial.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white card-dark p-8 rounded-lg text-center shadow-md border hover:-translate-y-2 hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gift-rose/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-4xl text-gift-rose mb-6 relative">
              <FaRibbon />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-gift-rose to-transparent"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 dark:text-white">Compra Segura</h3>
            <p className="text-gray-600 dark:text-gray-300">Transacciones seguras y protegidas para que sorprendas con total confianza.</p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="pt-16 pb-10 relative bg-white section-dark overflow-hidden">
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--gift-rose)/20%,transparent_20%),radial-gradient(circle_at_80%_70%,var(--gift-rose)/20%,transparent_20%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,var(--gift-rose)/10%_1px,transparent_1px,transparent_50px)] bg-[length:50px_50px] opacity-20"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,var(--gift-rose)/12,transparent)] opacity-10"></div>
        </div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 relative z-10 dark:text-white"
        >
          Productos <span className="text-gift-rose relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gift-rose after:to-transparent">Destacados</span>
        </motion.h2>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white card-dark rounded-lg overflow-hidden shadow-md border hover:-translate-y-2 hover:shadow-xl transition-all group relative"
              >
                <div className="relative h-64 bg-gray-200 overlay-soft overflow-hidden">
                  <img 
                    src={buildImageUrl(product.imagen) || 'https://via.placeholder.com/300'} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {product.precio_de_oferta && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-sm font-semibold px-2 py-1 rounded shadow-md z-10">
                      Oferta
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-4 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform">
                    <button 
                      onClick={() => openProductModal(product)}
                      className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center mx-1 hover:bg-primary transition-colors"
                    >
                      <FaEye />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center mx-1 hover:bg-primary transition-colors">
                      <FaExpand />
                    </button>
                  </div>
                </div>
                <div className="p-5 relative">
                  <div className="text-sm text-primary font-medium mb-2">
                    {product.subCategory?.name || "General"}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors dark:text-white">
                    {product.name}
                  </h3>
                  <div className="flex items-center">
                    {product.precio_de_oferta ? (
                      <>
                        <span className="text-gray-500 line-through mr-2 dark:text-gray-400">S/ {product.price.toFixed(2)}</span>
                        <span className="text-primary font-semibold text-lg">S/ {product.precio_de_oferta.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-primary font-semibold text-lg">S/ {product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white card-dark rounded-lg overflow-hidden shadow-md border">
                <div className="h-64 bg-gray-200 overlay-soft animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 overlay-soft rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 overlay-soft rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 overlay-soft rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-8 mb-0 relative z-10"
        >
          <Link 
            to="/catalogo" 
            className="inline-block px-8 py-3 border border-gift-rose text-gift-rose hover:bg-gradient-to-r hover:from-gift-rose hover:to-pink-500 hover:text-white rounded-md font-semibold transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              Ver Todos los Productos <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
          </Link>
        </motion.div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeProductModal}></div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative z-10 shadow-2xl grid grid-cols-1 md:grid-cols-2"
            >
              <div className="p-6 h-[300px] md:h-auto bg-gray-900 flex items-center justify-center">
                <img 
                  src={buildImageUrl(selectedProduct.imagen) || 'https://via.placeholder.com/300'} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-white">{selectedProduct.name}</h2>
                <div className="mb-4">
                  {selectedProduct.precio_de_oferta ? (
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through mr-3">S/ {selectedProduct.price.toFixed(2)}</span>
                      <span className="text-primary text-2xl font-bold">S/ {selectedProduct.precio_de_oferta.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-primary text-2xl font-bold">S/ {selectedProduct.price.toFixed(2)}</span>
                  )}
                </div>
                <p className="text-gray-300 mb-6">{selectedProduct.description}</p>
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProduct.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedProduct.stock > 0 ? `En stock (${selectedProduct.stock})` : 'Agotado'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md font-medium transition-colors">
                    Añadir al Carrito
                  </button>
                  <a 
                    href={`https://wa.me/51997745679?text=Hola, estoy interesado en: ${selectedProduct.name}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
                  >
                    <FaWhatsapp className="mr-2" /> Consultar
                  </a>
                </div>
                <button 
                  onClick={closeProductModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default Home;
