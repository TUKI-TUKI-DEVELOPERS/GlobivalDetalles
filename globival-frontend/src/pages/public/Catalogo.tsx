"use client"

import { useState, useEffect, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { FaFilter, FaTimes, FaSearch, FaChevronDown, FaChevronRight, FaEye, FaExpand, FaWhatsapp, FaMoon, FaSun, FaTag, FaCheckCircle, FaDollarSign, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaThLarge, FaListUl } from "react-icons/fa"
import { categoryService, subcategoryService, productService } from "../../services/api"
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
import styled from "styled-components"

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Subcategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  precio_de_oferta?: number;
  stock: number;
  imagen?: string;
  subCategoryId: number;
  subCategory?: {
    id: number;
    name: string;
  };
}

// Items del carrito
interface CartItem {
  productId: number;
  name: string;
  price: number; // precio unitario (usa oferta si existe)
  imagen?: string;
  quantity: number;
}

// Variantes para animaciones
// (variantes de animación no utilizadas eliminadas)


const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const FilterSectionHeader = styled.div<{ $isActive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.mediumGray)};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  h4 {
    margin: 0;
    font-size: 1.1rem;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.textPrimary)};
  }

  svg {
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.textSecondary)};
    transition: transform ${({ theme }) => theme.transitions.fast};
    transform: ${({ $isActive }) => ($isActive ? "rotate(180deg)" : "rotate(0)")};
  }

  &:hover {
    h4, svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const FilterList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
`

const FilterItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

// (styled components no utilizados eliminados)

// (styled components no utilizados eliminados)

const FilterCheckbox = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  input {
    margin-right: ${({ theme }) => theme.spacing.sm};
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }

  label {
    cursor: pointer;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.textSecondary)};
    transition: color ${({ theme }) => theme.transitions.fast};
    font-weight: ${({ $isActive }) => ($isActive ? "500" : "normal")};
    flex: 1;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  .toggle-icon {
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.textSecondary)};
    margin-left: ${({ theme }) => theme.spacing.sm};
    font-size: 0.8rem;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

// (styled components no utilizados eliminados)

// Componentes de producto con Tailwind CSS
// Los estilos de ProductCard ahora se aplican directamente en las clases de Tailwind
// en el JSX del componente, eliminando la necesidad de styled-components

// Componentes de encabezado con Tailwind CSS

// Componentes de UI con Tailwind CSS

// Componentes de UI con Tailwind CSS

// Componentes de UI con Tailwind CSS

// Componentes de UI con Tailwind CSS

// Modal components with styled-components (will be migrated to Tailwind later)
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
`

const ModalContent = styled.div`
  background: var(--bg-card);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 1001;
  box-shadow: var(--shadow-xl);
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(30px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--accent-glow), transparent 70%);
    opacity: 0.1;
    border-radius: inherit;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`

const ModalImage = styled.div`
  height: 350px;
  background-color: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme }) => theme.spacing.lg};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 100%;
  }
`

const ModalDetails = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`

const ModalCategory = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9rem;
`

const ModalPrice = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  .original {
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: line-through;
    margin-right: ${({ theme }) => theme.spacing.md};
    font-size: 1.2rem;
  }
  
  .sale {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    font-size: 2rem;
  }
`

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const ModalButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.danger});
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

const WhatsAppButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #25D366;
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
  }
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

// Botón de acción para el modal (para "Agregar al carrito")
const ModalActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.danger});
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }

  svg {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`

const CloseModalButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1002;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
}

const Catalogo = () => {
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([])
  const [sortOption, setSortOption] = useState("default")
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({})
  const [showFilters, setShowFilters] = useState(true)
const [showAvailability, setShowAvailability] = useState(true)
const [showPrice, setShowPrice] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12 // Número de productos por página
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Carrito de compras
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("catalogo_cart_items")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState<boolean>(true)
  
  // Tema día/noche
  const { theme, toggleTheme } = useTheme()

  // Filtros avanzados
  const [offerOnly, setOfferOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])

  // Helpers de carrito y persistencia
  const getUnitPrice = (product: Product) => product.precio_de_oferta ?? product.price
  const addToCart = (product: Product) => {
    const unitPrice = getUnitPrice(product)
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.productId === product.id)
      if (existing) {
        return prev.map((ci) =>
          ci.productId === product.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: unitPrice,
          imagen: product.imagen,
          quantity: 1,
        },
      ]
    })
  }
  const removeFromCart = (productId: number) => setCartItems((prev) => prev.filter((ci) => ci.productId !== productId))
  const updateQuantity = (productId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => ci.productId === productId ? { ...ci, quantity: Math.max(0, ci.quantity + delta) } : ci)
        .filter((ci) => ci.quantity > 0)
    )
  }
  const cartTotal = useMemo(() => cartItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0), [cartItems])
  const formatCurrency = (n: number) => n.toLocaleString("es-PE", { style: "currency", currency: "PEN" })

  useEffect(() => {
    try {
      localStorage.setItem("catalogo_cart_items", JSON.stringify(cartItems))
    } catch {
      // evitar bloque vacío
    }
  }, [cartItems])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "catalogo_cart_items") {
        const saved = localStorage.getItem("catalogo_cart_items")
        if (!saved) setCartItems([])
      }
    }
    const checkOnFocus = () => {
      const saved = localStorage.getItem("catalogo_cart_items")
      if (!saved) setCartItems([])
    }
    window.addEventListener("storage", handleStorage)
    window.addEventListener("focus", checkOnFocus)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("focus", checkOnFocus)
    }
  }, [])

  // Abrir carrito si viene desde el header con query ?cart=open
  // Y procesar parámetro de búsqueda si existe
  useEffect(() => {
    try {
      const q = searchParams.get("cart")
      if (q === "open") setIsCartOpen(true)
      
      const searchParam = searchParams.get("search")
      if (searchParam) {
        setSearchTerm(searchParam)
      }
    } catch {
      // evitar bloque vacío
    }
  }, [searchParams])

  const getWhatsAppCartLink = () => {
    if (cartItems.length === 0) return "https://wa.me/51997745679"
    const lines = cartItems.map(
      (ci) => `• ${ci.name} x${ci.quantity} — ${formatCurrency(ci.price)} c/u = ${formatCurrency(ci.price * ci.quantity)}`
    )
    const totalLine = `\nTotal: ${formatCurrency(cartTotal)}`
    const header = "Hola, quiero solicitar estos productos de Globival & Detalles:\n\n"
    const message = `${header}${lines.join("\n")}${totalLine}`
    return `https://wa.me/51997745679?text=${encodeURIComponent(message)}`
  }

  // Cargar datos iniciales: categorías, subcategorías y productos
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [catRes, subRes, prodRes] = await Promise.all([
          categoryService.getAll(),
          subcategoryService.getAll(),
          productService.getAll(),
        ])

        setCategories(catRes.data)
        setSubcategories(subRes.data)
        const normalizedProducts = (prodRes.data || []).map((p: unknown) => {
          const proto = p as Partial<Product> & {
            subCategoryId?: number;
            subCategory?: { id?: number };
            subCategory_id?: number;
            subcategoryId?: number;
          };
          return {
            ...(p as Product),
            // Asegurar que subCategoryId exista para la lógica de filtrado sin usar 'any'
            subCategoryId:
              proto.subCategoryId ??
              proto.subCategory?.id ??
              proto.subCategory_id ??
              proto.subcategoryId ??
              (p as Product).subCategoryId,
          } as Product
        })
        setProducts(normalizedProducts)
      } catch (error) {
        console.error("Error al cargar catálogo:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])
  // Cálculo de límites de precio disponibles
  const [computedMinPrice, computedMaxPrice] = useMemo(() => {
    if (products.length === 0) return [0, 0]
    const prices = products.map(p => p.precio_de_oferta ?? p.price)
    return [Math.min(...prices), Math.max(...prices)]
  }, [products])

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange(([min, max]) => {
        if (min === 0 && max === 0) {
          return [computedMinPrice, computedMaxPrice]
        }
        return [min, max]
      })
    }
  }, [products, computedMinPrice, computedMaxPrice])

  useEffect(() => {
    let filtered = [...products]

    // Aplicar filtros de categoría y subcategoría en una sola pasada
    if (selectedCategories.length > 0 || selectedSubcategories.length > 0) {
      const subCatsOfSelectedCats = selectedCategories.length > 0
        ? subcategories
            .filter((subcat) => selectedCategories.includes(subcat.categoryId))
            .map((subcat) => subcat.id)
        : []

      filtered = filtered.filter((product) => 
        (selectedSubcategories.length > 0 
          ? selectedSubcategories.includes(product.subCategoryId)
          : subCatsOfSelectedCats.includes(product.subCategoryId))
      )
    }

    // Aplicar búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      )
    }

    // Filtros avanzados: oferta, stock y rango de precio
    if (offerOnly) {
      filtered = filtered.filter(p => !!p.precio_de_oferta)
    }
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0)
    }
    if (priceRange[0] !== 0 || priceRange[1] !== 0) {
      filtered = filtered.filter(p => {
        const price = p.precio_de_oferta ?? p.price
        return price >= priceRange[0] && price <= priceRange[1]
      })
    }

    // Aplicar ordenamiento
    switch (sortOption) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, selectedCategories, selectedSubcategories, searchTerm, sortOption, subcategories, offerOnly, inStockOnly, priceRange])

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })

    if (selectedCategories.includes(categoryId)) {
      const subCatsToRemove = subcategories
        .filter((subcat) => subcat.categoryId === categoryId)
        .map((subcat) => subcat.id)

      setSelectedSubcategories((prev) => prev.filter((id) => !subCatsToRemove.includes(id)))
    }
  }

  const handleSubcategoryChange = (subcategoryId: number) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subcategoryId)) {
        return prev.filter((id) => id !== subcategoryId)
      } else {
        return [...prev, subcategoryId]
      }
    })
  }

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId],
    })
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSubcategories([])
    setSearchTerm("")
    setSortOption("default")
    setCurrentPage(1)
    setOfferOnly(false)
    setInStockOnly(false)
    setPriceRange([computedMinPrice, computedMaxPrice])
  }

  const toggleFiltersVisibility = () => {
    setShowFilters(!showFilters)
  }

  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter((subcat) => subcat.categoryId === categoryId)
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || !!searchTerm || offerOnly || inStockOnly || (priceRange[0] > computedMinPrice || priceRange[1] < computedMaxPrice)

  const openModal = (product: Product) => {
    setSelectedProduct(product)
    setShowModal(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setShowModal(false)
    document.body.style.overflow = "auto"
  }

  const getWhatsAppLink = (product: Product) => {
    const message = `Hola, me gustaría obtener más información sobre el producto "${product.name}" de Globival & Detalles.`
    return `https://wa.me/51997745679?text=${encodeURIComponent(message)}`
  }

  return (
    <>
      {/* Fondo con animaciones */}
      <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-60 blur-md animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-20"></div>
      </div>
      
      {/* Contenedor principal */}
      <div className="relative z-10 py-8 bg-background/80 backdrop-blur-md min-h-[calc(100vh-160px)] mt-6 rounded-t-2xl">
        <div className="container mx-auto px-4">
          {/* Encabezado */}
          <div className="bg-card p-8 mb-8 rounded-lg shadow-lg border border-border relative overflow-hidden backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 relative z-10 text-2xl md:text-3xl font-bold"
            >
              Nuestro <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">Catálogo</span> de Productos
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground max-w-3xl relative z-10"
            >
              Explora nuestra amplia selección de productos para gimnasio, suplementos y ropa deportiva de alta calidad.
            </motion.p>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Overlay para móviles */}
            <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden ${isFilterOpen ? 'block' : 'hidden'}`} onClick={toggleFilter}></div>
            
            {/* Sidebar de filtros */}
            <aside className={`bg-card rounded-lg p-6 h-fit shadow-lg border border-border relative backdrop-blur-xl ${isFilterOpen ? 'fixed top-0 left-0 right-0 bottom-0 z-50 lg:static lg:z-auto' : 'hidden lg:block'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-5 rounded-lg pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaFilter className="text-primary" />
                  Filtros
                </h2>
                <button 
                  className="lg:hidden text-muted-foreground hover:text-primary transition-colors"
                  onClick={toggleFilter}
                >
                  <FaTimes size={20} />
                </button>
              </div>

            <div className="mb-6">
              <div 
                className="flex justify-between items-center mb-3 pb-2 border-b border-border cursor-pointer"
                onClick={toggleFiltersVisibility}
              >
                <h4 className={`font-medium ${showFilters ? 'text-primary' : ''}`}>Categorías</h4>
                <FaChevronDown className={`transition-transform ${showFilters ? 'text-primary rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="list-none p-0 m-0"
                  >
                    {categories.map((category) => {
                      const hasSubcategories = getSubcategoriesForCategory(category.id).length > 0
                      return (
                        <li key={category.id} className="mb-2">
                          <div className={`flex items-center py-2 cursor-pointer ${selectedCategories.includes(category.id) ? 'text-primary font-medium' : ''}`}>
                            <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleCategoryChange(category.id)
                              }}
                              className="mr-2 accent-primary cursor-pointer"
                            />
                            <label
                              onClick={(e) => {
                                e.preventDefault()
                                if (hasSubcategories) {
                                  toggleCategoryExpand(category.id)
                                }
                              }}
                              className="cursor-pointer flex-1"
                            >
                              {category.name}
                            </label>

                            {hasSubcategories && (
                              <span
                                className={`ml-2 text-sm ${selectedCategories.includes(category.id) ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleCategoryExpand(category.id)
                                }}
                              >
                                {expandedCategories[category.id] ? <FaChevronDown /> : <FaChevronRight />}
                              </span>
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedCategories[category.id] && hasSubcategories && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="list-none pl-6 my-1 overflow-hidden"
                              >
                                {getSubcategoriesForCategory(category.id).map((subcategory) => (
                                  <li key={subcategory.id} className="mb-1">
                                    <div className={`flex items-center py-1 cursor-pointer ${selectedSubcategories.includes(subcategory.id) ? 'text-primary font-medium' : ''}`}>
                                      <input
                                        type="checkbox"
                                        id={`subcategory-${subcategory.id}`}
                                        checked={selectedSubcategories.includes(subcategory.id)}
                                        onChange={(e) => {
                                          e.stopPropagation()
                                          handleSubcategoryChange(subcategory.id)
                                        }}
                                        className="mr-2 accent-primary cursor-pointer"
                                      />
                                      <label
                                        onClick={(e) => {
                                          e.preventDefault()
                                          handleSubcategoryChange(subcategory.id)
                                        }}
                                        className="cursor-pointer"
                                      >
                                        {subcategory.name}
                                      </label>
                                    </div>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </li>
                      )
                    })}

                    {hasActiveFilters && (
                      <ClearFiltersButton onClick={clearFilters}>Limpiar filtros</ClearFiltersButton>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Disponibilidad */}
            <FilterSection>
              <FilterSectionHeader $isActive={showAvailability} onClick={() => setShowAvailability(!showAvailability)}>
                <h4>Disponibilidad</h4>
                <FaChevronDown />
              </FilterSectionHeader>
              <AnimatePresence>
                {showAvailability && (
                  <FilterList
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FilterItem>
                      <FilterCheckbox $isActive={offerOnly} onClick={() => setOfferOnly(!offerOnly)}>
                        <input
                          type="checkbox"
                          checked={offerOnly}
                          onChange={(e) => setOfferOnly(e.target.checked)}
                        />
                        <label>
                          <span className="inline-flex items-center gap-2"><FaTag /> Solo en oferta</span>
                        </label>
                      </FilterCheckbox>
                    </FilterItem>
                    <FilterItem>
                      <FilterCheckbox $isActive={inStockOnly} onClick={() => setInStockOnly(!inStockOnly)}>
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                        <label>
                          <span className="inline-flex items-center gap-2"><FaCheckCircle /> Solo con stock</span>
                        </label>
                      </FilterCheckbox>
                    </FilterItem>
                  </FilterList>
                )}
              </AnimatePresence>
            </FilterSection>

            {/* Precio */}
            <FilterSection>
              <FilterSectionHeader $isActive={showPrice} onClick={() => setShowPrice(!showPrice)}>
                <h4>Precio</h4>
                <FaChevronDown />
              </FilterSectionHeader>
              <AnimatePresence>
                {showPrice && (
                  <FilterList
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FilterItem>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">Mínimo</label>
                          <input
                            type="number"
                            min={computedMinPrice}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => {
                              const newMin = Number(e.target.value)
                              setPriceRange([Math.max(computedMinPrice, Math.min(newMin, priceRange[1])), priceRange[1]])
                            }}
                            className="w-full px-3 py-2 rounded-md border border-border bg-card"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">Máximo</label>
                          <input
                            type="number"
                            min={priceRange[0]}
                            max={computedMaxPrice}
                            value={priceRange[1]}
                            onChange={(e) => {
                              const newMax = Number(e.target.value)
                              setPriceRange([priceRange[0], Math.min(computedMaxPrice, Math.max(newMax, priceRange[0]))])
                            }}
                            className="w-full px-3 py-2 rounded-md border border-border bg-card"
                          />
                        </div>
                      </div>
                    </FilterItem>
                    <FilterItem>
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted transition-colors"
                        onClick={() => setPriceRange([computedMinPrice, computedMaxPrice])}
                      >
                        <FaDollarSign /> Restablecer precio
                      </button>
                    </FilterItem>
                  </FilterList>
                )}
              </AnimatePresence>
            </FilterSection>

            {/* Cierre del aside */}
          </aside>

          <div>
            <ProductsHeader>
              <MobileFilterButton onClick={toggleFilter}>
                <FaFilter />
                Filtros
              </MobileFilterButton>

              <SearchBar>
                <FaSearch className="text-primary" />
                <input
                  type="text"
                  placeholder="Buscar productos por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Buscar productos"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Limpiar búsqueda"
                  >
                    <FaTimes />
                  </button>
                )}
              </SearchBar>

              <SortSelect value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="default">Ordenar por</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="name_asc">Nombre: A-Z</option>
                <option value="name_desc">Nombre: Z-A</option>
              </SortSelect>

              {/* Botón de tema día/noche */}
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card hover:bg-muted transition-colors"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
                <span className="hidden sm:inline">{theme === 'dark' ? 'Modo día' : 'Modo noche'}</span>
              </button>
            </ProductsHeader>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm"><FaSearch /> Búsqueda: "{searchTerm}"</span>
                )}
                {selectedCategories.length > 0 && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm">Categorías: {selectedCategories.length}</span>
                )}
                {selectedSubcategories.length > 0 && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm">Subcategorías: {selectedSubcategories.length}</span>
                )}
                {offerOnly && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm"><FaTag /> Oferta</span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm"><FaCheckCircle /> Con stock</span>
                )}
                {(priceRange[0] > computedMinPrice || priceRange[1] < computedMaxPrice) && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm"><FaDollarSign /> {priceRange[0]} - {priceRange[1]}</span>
                )}
                <ClearFiltersButton onClick={clearFilters}>Limpiar</ClearFiltersButton>
              </div>
            )}

            {/* Panel de carrito */}
            <div className="bg-card rounded-lg p-6 mb-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaShoppingCart className="text-primary" /> Carrito de compras
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm"
                  >
                    {isCartOpen ? "Ocultar" : "Mostrar"}
                  </button>
                  <a
                    href={getWhatsAppCartLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-white hover:opacity-90 text-sm"
                    aria-label="Enviar carrito por WhatsApp"
                  >
                    <FaWhatsapp /> Enviar por WhatsApp
                  </a>
                </div>
              </div>

              {isCartOpen && (
                cartItems.length > 0 ? (
                  <div className="space-y-4">
                    {cartItems.map((ci) => (
                      <div key={ci.productId} className="flex items-center gap-4 p-3 rounded-md border border-border bg-card/70">
                        <img
                          src={buildImageUrl(ci.imagen) || "/images/product-placeholder.jpg"}
                          alt={ci.name}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{ci.name}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(ci.price)} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(ci.productId, -1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted" aria-label="Disminuir">
                            <FaMinus />
                          </button>
                          <span className="min-w-[32px] text-center">{ci.quantity}</span>
                          <button onClick={() => updateQuantity(ci.productId, 1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted" aria-label="Aumentar">
                            <FaPlus />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(ci.price * ci.quantity)}</p>
                        </div>
                        <button onClick={() => removeFromCart(ci.productId)} className="w-8 h-8 flex items-center justify-center rounded-full border border-danger/30 text-danger hover:bg-danger/10" aria-label="Eliminar">
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">Artículos: {cartItems.reduce((a, b) => a + b.quantity, 0)}</p>
                      <p className="text-lg font-semibold">Total: {formatCurrency(cartTotal)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Tu carrito está vacío. Agrega productos desde el catálogo.</p>
                )
              )}
            </div>

            <ResultCount>
              Mostrando <span>
                {Math.min(productsPerPage * (currentPage - 1) + 1, filteredProducts.length)} - {Math.min(currentPage * productsPerPage, filteredProducts.length)}
              </span> de <span>{filteredProducts.length}</span> productos
              {hasActiveFilters ? " con los filtros aplicados" : ""}
            </ResultCount>
            <div className="flex justify-end items-center gap-2 mb-4">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${
                  viewMode === "grid" ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
                aria-pressed={viewMode === "grid"}
                aria-label="Vista mosaico"
                title="Vista mosaico"
              >
                <FaThLarge /> Mosaico
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${
                  viewMode === "list" ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
                aria-pressed={viewMode === "list"}
                aria-label="Vista lista"
                title="Vista lista"
              >
                <FaListUl /> Lista
              </button>
            </div>

            {loading ? (
              <p>Cargando productos...</p>
            ) : filteredProducts.length > 0 ? (
              <>
                {viewMode === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts
                    .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                    .map((product) => (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="bg-card/80 backdrop-blur-md rounded-lg overflow-hidden border border-border shadow-md transition-all duration-300 h-full hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 group relative"
                  >
                    <Link to={`/producto/${product.id}`} className="block pointer-events-none md:pointer-events-auto">
                      <div className="h-[250px] bg-muted relative overflow-hidden flex items-center justify-center">
                        <img
                          src={buildImageUrl(product.imagen) || "/images/product-placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.precio_de_oferta && (
                          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold py-1 px-2 rounded">
                            Oferta
                          </div>
                        )}
                      </div>
                      <div className="p-6 relative">
                        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                        <div className="text-primary/80 text-sm font-medium mb-2">{product.subCategory?.name || "Categoría"}</div>
                        <h3 className="text-lg font-medium mb-2 transition-colors group-hover:text-primary">{product.name}</h3>
                        <div className="flex items-center">
                          {product.precio_de_oferta ? (
                            <>
                              <span className="text-muted-foreground line-through mr-2 text-sm">S/ {product.price}</span>
                              <span className="text-primary font-semibold text-lg">S/ {product.precio_de_oferta}</span>
                            </>
                          ) : (
                            <span className="text-primary font-semibold text-lg">S/ {product.price}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="bg-black/70 py-3 flex justify-center gap-3 md:absolute md:bottom-0 md:left-0 md:right-0 md:transform md:translate-y-full transition-transform duration-300 md:group-hover:translate-y-0 z-10">
                      <Link 
                        to={`/producto/${product.id}`}
                        className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-background/20 flex items-center justify-center text-white hover:bg-primary hover:-translate-y-1 transition-all"
                        title="Ver detalle"
                      >
                        <FaEye />
                      </Link>
                      <button
                        className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-background/20 flex items-center justify-center text-white hover:bg-primary hover:-translate-y-1 transition-all"
                        title="Vista previa"
                        onClick={(e) => {
                          e.preventDefault()
                          openModal(product)
                        }}
                      >
                        <FaExpand />
                      </button>
                      <a
                        className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-background/20 flex items-center justify-center text-white hover:bg-primary hover:-translate-y-1 transition-all"
                        title="Contactar por WhatsApp"
                        href={getWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp />
                      </a>
                      <button
                        className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-background/20 flex items-center justify-center text-white hover:bg-primary hover:-translate-y-1 transition-all"
                        title="Agregar al carrito"
                        onClick={(e) => { e.preventDefault(); addToCart(product) }}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
                )}
                {viewMode === "list" && (
                  <div className="space-y-4">
                    {filteredProducts
                      .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                      .map((product) => (
                        <motion.div
                          key={product.id}
                          initial="hidden"
                          animate="visible"
                          variants={cardVariants}
                          className="bg-card/80 backdrop-blur-md rounded-lg border border-border shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50 p-4 flex gap-4 items-start"
                        >
                          <div className="w-24 h-24 flex-shrink-0 bg-muted rounded overflow-hidden flex items-center justify-center">
                            <img
                              src={buildImageUrl(product.imagen) || "/images/product-placeholder.jpg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-primary/80 text-sm font-medium mb-1">{product.subCategory?.name || "Categoría"}</div>
                            <h3 className="text-base font-medium mb-1">{product.name}</h3>
                            <div className="flex items-center">
                              {product.precio_de_oferta ? (
                                <>
                                  <span className="text-muted-foreground line-through mr-2 text-sm">S/ {product.price}</span>
                                  <span className="text-primary font-semibold text-lg">S/ {product.precio_de_oferta}</span>
                                </>
                              ) : (
                                <span className="text-primary font-semibold text-lg">S/ {product.price}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center justify-end">
                            <Link
                              to={`/producto/${product.id}`}
                              className="px-3 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
                              title="Ver detalle"
                            >
                              <FaEye />
                              <span className="ml-2">Ver</span>
                            </Link>
                            <button
                              className="px-3 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
                              title="Vista previa"
                              onClick={() => openModal(product)}
                            >
                              <FaExpand />
                              <span className="ml-2">Vista previa</span>
                            </button>
                            <a
                              className="px-3 py-2 rounded-md border border-border bg-card text-sm hover:bg-muted"
                              title="WhatsApp"
                              href={getWhatsAppLink(product)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaWhatsapp />
                              <span className="ml-2">WhatsApp</span>
                            </a>
                            <button
                              className="px-3 py-2 rounded-md bg-primary text-white text-sm hover:opacity-90"
                              title="Agregar al carrito"
                              onClick={() => addToCart(product)}
                            >
                              <FaShoppingCart />
                              <span className="ml-2">Agregar</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
                {/* Paginación */}
                {filteredProducts.length > productsPerPage && (
                  <div className="flex justify-center items-center mt-12 gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                      Anterior
                    </button>
                    
                    {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                          currentPage === index + 1
                            ? 'bg-primary text-white border-primary'
                            : 'border border-border bg-card hover:bg-muted'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NoResults>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros filtros o términos de búsqueda</p>
                {hasActiveFilters && (
                  <ClearFiltersButton onClick={clearFilters}>Limpiar todos los filtros</ClearFiltersButton>
                )}
              </NoResults>
            )}
          </div>
          </div> {/* grid */}
          </div> {/* container */}
          </div> {/* main wrapper */}

      <AnimatePresence>
        {showModal && selectedProduct && (
          <Modal>
            <ModalOverlay onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ModalContent>
                <CloseModalButton onClick={closeModal}>×</CloseModalButton>
                <ModalImage>
                  <img
                    src={buildImageUrl(selectedProduct.imagen) || "/images/product-placeholder.jpg"}
                    alt={selectedProduct.name}
                  />
                </ModalImage>
                <ModalDetails>
                  <ModalCategory>{selectedProduct.subCategory?.name || "Categoría"}</ModalCategory>
                  <h2>{selectedProduct.name}</h2>
                  <ModalPrice>
                    {selectedProduct.precio_de_oferta ? (
                      <>
                        <span className="original">S/ {selectedProduct.price}</span>
                        <span className="sale">S/ {selectedProduct.precio_de_oferta}</span>
                      </>
                    ) : (
                      <span className="sale">S/ {selectedProduct.price}</span>
                    )}
                  </ModalPrice>
                  <p>{selectedProduct.description || "No hay descripción disponible para este producto."}</p>
                  <ModalActions>
                    <ModalButton to={`/producto/${selectedProduct.id}`}>
                      <FaEye /> Ver detalle completo
                    </ModalButton>
                    <ModalActionButton onClick={() => addToCart(selectedProduct!)} aria-label="Agregar al carrito">
                      <FaShoppingCart /> Agregar al carrito
                    </ModalActionButton>
                    <WhatsAppButton href={getWhatsAppLink(selectedProduct)} target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp /> Contactar
                    </WhatsAppButton>
                  </ModalActions>
                </ModalDetails>
              </ModalContent>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

export default Catalogo

const ProductsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`
const MobileFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  flex: 1;
  max-width: 420px;

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`
const SortSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: ${({ theme }) => theme.colors.textSecondary};
`
const ResultCount = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`
const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`
const ClearFiltersButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`
