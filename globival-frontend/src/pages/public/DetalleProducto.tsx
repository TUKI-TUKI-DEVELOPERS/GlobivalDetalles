"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { FaArrowLeft, FaCheck, FaWhatsapp } from "react-icons/fa"
import { productService } from "../../services/api"
import { motion } from "framer-motion"
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

function DetalleProducto() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(Number(id))
        setProduct(response.data)

        // Obtener productos relacionados (misma subcategoría)
        const allProductsRes = await productService.getAll()
        const related = allProductsRes.data
          .filter((p: Product) => p.subCategory?.id === response.data.subCategory?.id && p.id !== response.data.id)
          .slice(0, 4)

        setRelatedProducts(related)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar producto:", error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Función para generar el enlace de WhatsApp con el mensaje predefinido
  const getWhatsAppLink = (product: Product) => {
    if (!product) return "#"
    const message = `Hola, estoy interesado en el producto "${product.name}" con precio ${product.precio_de_oferta ? `S/ ${product.precio_de_oferta}` : `S/ ${product.price}`}. ¿Podrías darme más información?`
    return `https://wa.me/51997745679?text=${encodeURIComponent(message)}`
  }

  // Estructura del carrito para evitar 'any'
  interface CartItem {
    id: number;
    name: string;
    price: number;
    imagen?: string;
    quantity: number;
  }

  const addToCart = (product: Product) => {
    const saved = localStorage.getItem('catalogo_cart_items')
    let cart: CartItem[] = []
    try {
      cart = saved ? (JSON.parse(saved) as CartItem[]) : []
    } catch {
      cart = []
    }

    const index = cart.findIndex((it) => it.id === product.id)
    if (index >= 0) {
      cart[index].quantity = (Number(cart[index].quantity) || 0) + 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.precio_de_oferta ?? product.price,
        imagen: product.imagen,
        quantity: 1,
      })
    }

    localStorage.setItem('catalogo_cart_items', JSON.stringify(cart))
    // Notificar al header en esta misma pestaña
    window.dispatchEvent(new Event('catalogo_cart_items_updated'))

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <>
        {/* Fondo con animación sutil */}
        <div className="fixed inset-0 -z-10 bg-background"></div>
        
        <div className="container mx-auto py-8 relative z-10 bg-background min-h-[calc(100vh-160px)] backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-12"
          >
            Cargando producto...
          </motion.div>
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        {/* Fondo con animación sutil */}
        <div className="fixed inset-0 -z-10 bg-background"></div>
        
        <div className="container mx-auto py-8 relative z-10 bg-background min-h-[calc(100vh-160px)] backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Producto no encontrado</h2>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Link 
                to="/catalogo"
                className="inline-flex items-center text-muted-foreground py-2 px-4 rounded bg-card shadow-sm border border-border transition-all duration-200 hover:text-primary hover:-translate-x-1 hover:shadow-md"
              >
                <FaArrowLeft className="mr-2" /> Volver al catálogo
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Fondo con animación sutil */}
      <div className="fixed inset-0 -z-10 bg-background"></div>
      
      <div className="container mx-auto py-8 relative z-10 bg-background min-h-[calc(100vh-160px)] backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link 
            to="/catalogo"
            className="inline-flex items-center text-muted-foreground py-2 px-4 rounded bg-card shadow-sm border border-border transition-all duration-200 hover:text-primary hover:-translate-x-1 hover:shadow-md"
          >
            <FaArrowLeft className="mr-2" /> Volver al catálogo
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          className="bg-card rounded-md overflow-hidden shadow-md border border-border relative"
        >
            <img
              src={buildImageUrl(product.imagen) || "/images/product-placeholder.jpg"}
              alt={product.name}
              className="w-full h-auto object-contain aspect-square transition-transform duration-300 hover:scale-105"
            />
          </motion.div>

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
              className="text-primary text-sm font-medium mb-2 relative z-10"
            >
              {product.subCategory?.name || "Categoría"}
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
              {product.precio_de_oferta ? (
                <>
                  <span className="text-muted-foreground line-through mr-4 text-lg">S/ {product.price}</span>
                  <span className="text-primary font-semibold text-2xl">S/ {product.precio_de_oferta}</span>
                </>
              ) : (
                <span className="text-primary font-semibold text-2xl">S/ {product.price}</span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8 text-muted-foreground leading-relaxed"
            >
              <p>{product.description || "Sin descripción disponible."}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8 bg-card/80 p-4 rounded-md shadow-sm"
            >
              <p className="flex items-center mb-2 text-foreground">
                <FaCheck className="text-primary mr-2" /> ID: {product.id}
              </p>
              <p className="flex items-center text-foreground">
                <FaCheck className="text-primary mr-2" /> Disponibilidad: {product.stock > 0 ? "En stock" : "Agotado"}
              </p>
            </motion.div>

            {/* Acciones: Agregar al carrito + WhatsApp */}
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
                className="inline-flex items-center gap-2 bg-primary text-white py-3 px-6 rounded-md font-semibold text-lg shadow-md border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {addedToCart ? 'Agregado!' : 'Agregar al Carrito'}
              </motion.button>
              <motion.a
                href={getWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-[#25d366] text-white py-3 px-6 rounded-md font-semibold text-lg shadow-md border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <FaWhatsapp className="w-6 h-6" /> Contactar por WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 text-xl font-bold"
            >
              Productos <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-primary">Relacionados</span>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  className="bg-card rounded-md overflow-hidden shadow-md border border-border relative after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-[3px] after:bg-primary after:scale-x-0 after:transition-transform after:duration-500 after:origin-left hover:after:scale-x-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/producto/${relatedProduct.id}`}>
                    <div className="h-[200px] bg-card/50 relative overflow-hidden">
                      <img
                        src={
                          buildImageUrl(relatedProduct.imagen) || "/images/product-placeholder.jpg"
                        }
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {relatedProduct.precio_de_oferta && (
                        <div className="absolute top-2 left-2 bg-primary text-white py-1 px-2 rounded text-xs font-semibold shadow-sm z-10">
                          Oferta
                        </div>
                      )}
                    </div>
                    <div className="p-4 relative after:content-[''] after:absolute after:top-0 after:left-[10%] after:right-[10%] after:h-[1px] after:bg-primary/30">
                      <div className="text-primary text-sm mb-1">
                        {relatedProduct.subCategory?.name || "Categoría"}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center">
                        {relatedProduct.precio_de_oferta ? (
                          <>
                            <span className="text-muted-foreground line-through mr-2 text-sm">S/ {relatedProduct.price}</span>
                            <span className="text-primary font-semibold text-lg">S/ {relatedProduct.precio_de_oferta}</span>
                          </>
                        ) : (
                          <span className="text-primary font-semibold text-lg">S/ {relatedProduct.price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DetalleProducto
