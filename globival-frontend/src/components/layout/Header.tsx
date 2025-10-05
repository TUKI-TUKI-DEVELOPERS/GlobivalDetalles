"use client"

import { useState, useEffect, useRef } from "react"
import { Search, User, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import logo from "../../assets/logo_globival.png"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { productService } from "../../services/api"
import { IMAGE_BASE_URL } from "../../config/constants"
import { useTheme } from "../../contexts/ThemeContext"

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
  imagen?: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [adminClickCount, setAdminClickCount] = useState(0)
  const [showAdminNotification, setShowAdminNotification] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  
  // Cargar productos para autocompletado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    
    fetchProducts();
  }, [])
  
  // Filtrar productos según la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered.slice(0, 5)); // Limitar a 5 resultados
      setShowSuggestions(true);
    } else {
      setFilteredProducts([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products])
  
  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  // Disponible fuera del efecto para reutilizarlo en distintos eventos
  const computeCartCount = () => {
    try {
      const saved = localStorage.getItem('catalogo_cart_items')
      if (!saved) {
        setCartCount(0)
        return
      }
      const arr = JSON.parse(saved) as Array<{ quantity: number }>
      const total = arr.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
      setCartCount(total)
    } catch {
      setCartCount(0)
    }
  }

  // Sync con storage, focus y evento personalizado (misma pestaña)
  useEffect(() => {
    computeCartCount()
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === 'catalogo_cart_items') computeCartCount()
    }
    const onFocus = () => computeCartCount()
    const onCustom = () => computeCartCount()

    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    window.addEventListener('catalogo_cart_items_updated', onCustom as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('catalogo_cart_items_updated', onCustom as EventListener)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const navigationItems = [
    { name: "Inicio", to: "/" },
    { name: "Acerca de nosotros", to: "/acerca-de" },
    { name: "Catálogo", to: "/catalogo" },
    { name: "Social", to: "/social" },
    { name: "Contacto", to: "/contacto" },
  ]

  return (
    <>
      {/* Main Header */}
      <header className="bg-white dark:bg-black dark:bg-opacity-95 border-b border-border dark:border-gray-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile: Cart Icon (Left) */}
            <div className="flex items-center md:hidden">
              <Link to="/catalogo?cart=open" className="relative">
                <Button variant="ghost" className="relative p-2">
                  <ShoppingCart className="h-6 w-6 text-gift-rose dark:filter dark:brightness-0 dark:invert" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gift-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Link to="/">
                  <img src={logo} alt="Globival & Detalles" className="h-12 lg:h-16 w-auto dark:filter dark:brightness-0 dark:invert" />
                </Link>
              </div>
            </div>

            {/* Desktop: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full" ref={searchRef}>
                <Input
                  type="text"
                  placeholder="Busca productos, marcas, o más"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/catalogo?search=${encodeURIComponent(searchQuery.trim())}`;
                      setShowSuggestions(false);
                    }
                  }}
                  className="w-full pl-4 pr-12 py-2 border border-border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gift-rose dark:bg-blue-600 hover:brightness-95 rounded-full p-2"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = `/catalogo?search=${encodeURIComponent(searchQuery.trim())}`;
                      setShowSuggestions(false);
                    }
                  }}
                >
                  <Search className="h-4 w-4 text-white" />
                </Button>
                
                {/* Lista de sugerencias */}
                {showSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 card-dark border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/producto/${product.id}`}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSearchQuery(product.name);
                          setShowSuggestions(false);
                        }}
                      >
                        {product.imagen && (
                          <div className="w-10 h-10 mr-3 flex-shrink-0">
                            <img 
                              src={buildImageUrl(product.imagen)} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg"
                              }}
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium">{product.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: User & Cart Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="p-2"
                  onClick={() => {
                    if (adminClickCount === 0) {
                      setShowAdminNotification(true);
                      setAdminClickCount(1);
                      
                      // Ocultar la notificación después de 3 segundos
                      setTimeout(() => {
                        setShowAdminNotification(false);
                      }, 3000);
                    } else {
                      // Verificar si el usuario está autenticado como admin
                      const token = localStorage.getItem('auth_token');
                      if (token) {
                        navigate('/admin');
                      } else {
                        navigate('/login');
                      }
                    }
                  }}
                >
                  <div className="bg-gift-rose dark:bg-blue-600 rounded-full p-2">
                    <User className="h-5 w-5 text-white dark:filter dark:brightness-0 dark:invert" />
                  </div>
                </Button>
                {showAdminNotification && (
                  <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 w-40 text-center">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Solo para admin</p>
                  </div>
                )}
              </div>
              <Link to="/catalogo?cart=open" className="relative">
                <Button variant="ghost" className="relative p-2">
                  <ShoppingCart className="h-6 w-6 text-gift-rose dark:filter dark:brightness-0 dark:invert" />
                   {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gift-rose dark:bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                       {cartCount}
                     </span>
                   )}
                </Button>
              </Link>
            </div>

            {/* Mobile: Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                <div className="bg-gift-rose dark:bg-blue-600 rounded p-1">
                  {isMenuOpen ? <X className="h-5 w-5 text-white dark:filter dark:brightness-0 dark:invert" /> : <Menu className="h-5 w-5 text-white dark:filter dark:brightness-0 dark:invert" />}
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center space-x-8 py-4">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary dark:text-gray-300 dark:hover:text-primary"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 right-0 section-dark border-b border-border">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Globival & Detalles" className="h-10 w-auto dark:filter dark:brightness-0 dark:invert" />
              </div>
              <Button variant="ghost" onClick={() => setIsMenuOpen(false)} className="p-2">
                  <X className="h-6 w-6 dark:filter dark:brightness-0 dark:invert" />
                </Button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-border">
              <div className="relative" ref={searchRef}>
                <Input
                  type="text"
                  placeholder="Busca productos, marcas, o más"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/catalogo?search=${encodeURIComponent(searchQuery.trim())}`;
                      setIsMenuOpen(false);
                      setShowSuggestions(false);
                    }
                  }}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full"
                />
                <Button
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gift-rose dark:bg-blue-600 hover:brightness-95 rounded-full p-2"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      setIsMenuOpen(false);
                      window.location.href = `/catalogo?search=${encodeURIComponent(searchQuery.trim())}`;
                      setShowSuggestions(false);
                    }
                  }}
                >
                  <Search className="h-4 w-4 text-white dark:filter dark:brightness-0 dark:invert" />
                </Button>
                
                {/* Lista de sugerencias móvil */}
                {showSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 card-dark border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/producto/${product.id}`}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSearchQuery(product.name);
                          setShowSuggestions(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {product.imagen && (
                          <div className="w-10 h-10 mr-3 flex-shrink-0">
                            <img 
                              src={buildImageUrl(product.imagen)} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg"
                              }}
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium">{product.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3 px-4 rounded-lg transition-colors duration-200 ${isActive ? "bg-gift-accent text-gift-rose" : "text-gray-700 hover:bg-gift-accent"}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Mobile User Actions */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6">
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 bg-transparent"
                    onClick={() => {
                      if (adminClickCount === 0) {
                        setShowAdminNotification(true);
                        setAdminClickCount(1);
                        
                        // Ocultar la notificación después de 3 segundos
                        setTimeout(() => {
                          setShowAdminNotification(false);
                        }, 3000);
                      } else {
                        // Verificar si el usuario está autenticado como admin
                        const token = localStorage.getItem('auth_token');
                        if (token) {
                          navigate('/admin');
                        } else {
                          navigate('/login');
                        }
                      }
                    }}
                  >
                    <User className="h-4 w-4 dark:filter dark:brightness-0 dark:invert" />
                    <span>Mi Cuenta</span>
                  </Button>
                  {showAdminNotification && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 w-40 text-center">
                      <p className="text-sm text-gray-700">Solo para admin</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
