"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  FaBoxOpen, 
  FaLayerGroup, 
  FaUsers, 
  FaComments, 
  FaChartLine, 
  FaExclamationTriangle,
  FaTachometerAlt,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaEye,
  FaEdit,
  FaBell,
  FaCalendarAlt,
  FaShoppingCart,
  FaStar
} from "react-icons/fa"
import { categoryService, subcategoryService, productService, claimService, testimonialService } from "../../services/api"

const Dashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    subcategories: 0,
    products: 0,
    claims: 0,
    testimonials: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        const [categories, subcategories, products, claims, testimonials] = await Promise.all([
          categoryService.getAll(),
          subcategoryService.getAll(),
          productService.getAll(),
          claimService.getAll(),
          testimonialService.getAll()
        ])
        
        setStats({
          categories: categories.data.length,
          subcategories: subcategories.data.length,
          products: products.data.length,
          claims: claims.data.length,
          testimonials: testimonials.data.length
        })
        
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
        setError("No se pudieron cargar las estadísticas del dashboard")
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-background transition-theme">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <FaTachometerAlt className="text-primary" />
                Dashboard Administrativo
              </h1>
              <p className="text-muted-foreground mt-2">
                Bienvenido al panel de control de Globival
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendarAlt className="text-primary" />
                  <span className="text-muted-foreground">
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-3 shadow-sm">
            <FaExclamationTriangle className="text-lg" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="w-8 h-4 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-16 h-8 bg-muted rounded"></div>
                  <div className="w-20 h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              <StatCard 
                icon={<FaLayerGroup />} 
                title="Categorías" 
                value={stats.categories}
                change={+12}
                color="from-blue-500 to-blue-600"
                link="/admin/categorias"
              />
              <StatCard 
                icon={<FaBoxOpen />} 
                title="Subcategorías" 
                value={stats.subcategories}
                change={+8}
                color="from-purple-500 to-purple-600"
                link="/admin/subcategorias"
              />
              <StatCard 
                icon={<FaShoppingCart />} 
                title="Productos" 
                value={stats.products}
                change={+25}
                color="from-green-500 to-green-600"
                link="/admin/productos"
              />
              <StatCard 
                icon={<FaExclamationTriangle />} 
                title="Reclamaciones" 
                value={stats.claims}
                change={-5}
                color="from-amber-500 to-amber-600"
                link="/admin/reclamaciones"
              />
              <StatCard 
                icon={<FaStar />} 
                title="Testimonios" 
                value={stats.testimonials}
                change={+18}
                color="from-rose-500 to-rose-600"
                link="/admin/testimonios"
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FaArrowUp className="text-primary" />
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <QuickActionButton 
                  title="Crear Producto" 
                  description="Añadir nuevo producto al catálogo"
                  icon={<FaPlus />} 
                  link="/admin/productos/nuevo"
                  color="bg-green-500"
                />
                <QuickActionButton 
                  title="Nueva Categoría" 
                  description="Organizar productos por categorías"
                  icon={<FaLayerGroup />} 
                  link="/admin/categorias/nueva"
                  color="bg-blue-500"
                />
                <QuickActionButton 
                  title="Ver Reclamaciones" 
                  description="Gestionar quejas y sugerencias"
                  icon={<FaEye />} 
                  link="/admin/reclamaciones"
                  color="bg-amber-500"
                />
                <QuickActionButton 
                  title="Gestionar Banners" 
                  description="Actualizar promociones visuales"
                  icon={<FaEdit />} 
                  link="/admin/banners"
                  color="bg-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaBell className="text-primary" />
                  Actividad Reciente
                </h2>
                <Link 
                  to="/admin/actividad" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Ver todo
                </Link>
              </div>
              <div className="space-y-4">
                <ActivityItem 
                  title="Nuevo producto añadido" 
                  description="Se ha añadido 'Camiseta RoosterFit Premium' al catálogo" 
                  time="Hace 2 horas"
                  type="success"
                  icon={<FaBoxOpen />}
                />
                <ActivityItem 
                  title="Reclamación recibida" 
                  description="Cliente reportó problema con envío #RF-2024-001" 
                  time="Hace 4 horas"
                  type="warning"
                  icon={<FaExclamationTriangle />}
                />
                <ActivityItem 
                  title="Nuevo testimonio" 
                  description="María González dejó una reseña de 5 estrellas" 
                  time="Hace 6 horas"
                  type="info"
                  icon={<FaStar />}
                />
                <ActivityItem 
                  title="Categoría actualizada" 
                  description="Se modificó la categoría 'Ropa Deportiva'" 
                  time="Hace 1 día"
                  type="neutral"
                  icon={<FaLayerGroup />}
                />
                <ActivityItem 
                  title="Banner promocional activado" 
                  description="Nueva promoción 'Descuento Verano 2024' publicada" 
                  time="Hace 2 días"
                  type="success"
                  icon={<FaEdit />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaChartLine className="text-primary" />
              Resumen de Rendimiento
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Productos más vendidos</span>
                <span className="text-sm text-muted-foreground">Ver reporte</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Categorías populares</span>
                <span className="text-sm text-muted-foreground">Analizar</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Satisfacción del cliente</span>
                <span className="text-sm text-green-600 font-medium">94.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-primary" />
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Servidor</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Operativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Base de datos</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Conectada</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Última copia de seguridad</span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Hace 2h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: number
  change: number
  color: string
  link: string
}

const StatCard = ({ icon, title, value, change, color, link }: StatCardProps) => (
  <Link to={link} className="group">
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          change >= 0 
            ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
            : 'text-red-600 bg-red-50 dark:bg-red-900/20'
        }`}>
          {change >= 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  </Link>
)

interface ActivityItemProps {
  title: string
  description: string
  time: string
  type: 'success' | 'warning' | 'info' | 'neutral'
  icon: React.ReactNode
}

const ActivityItem = ({ title, description, time, type, icon }: ActivityItemProps) => {
  const typeStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-600',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600',
    neutral: 'bg-muted/30 border-border text-muted-foreground'
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${typeStyles[type]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        <span className="text-xs text-muted-foreground mt-2 block">{time}</span>
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  color: string
}

const QuickActionButton = ({ title, description, icon, link, color }: QuickActionButtonProps) => (
  <Link to={link} className="group">
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-all duration-200 group-hover:shadow-md">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{description}</p>
      </div>
    </div>
  </Link>
)

export default Dashboard

