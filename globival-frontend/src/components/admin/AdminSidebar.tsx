import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaBoxOpen, 
  FaLayerGroup, 
  FaExclamationTriangle, 
  FaComments, 
  FaImages, 
  FaEnvelope,
  FaChevronDown,
  FaChevronRight,
  FaCog,
  FaChartBar,
  FaUsers,
  FaTags,
  FaShoppingCart,
  FaFileAlt
} from 'react-icons/fa'

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  path?: string
  children?: Array<{
    title: string
    path: string
    icon?: React.ReactNode
  }>
  isActive?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

const SidebarItem = ({ icon, title, path, children, isActive, isExpanded, onToggle }: SidebarItemProps) => {
  const hasChildren = children && children.length > 0

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
            isExpanded 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{icon}</span>
            <span className="font-medium">{title}</span>
          </div>
          {isExpanded ? <FaChevronDown className="text-sm" /> : <FaChevronRight className="text-sm" />}
        </button>
        
        {isExpanded && (
          <div className="ml-4 mt-2 space-y-1 border-l-2 border-border pl-4">
            {children.map((child, index) => (
              <Link
                key={index}
                to={child.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200"
              >
                {child.icon && <span className="text-base">{child.icon}</span>}
                <span>{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={path || '#'}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 group ${
        isActive 
          ? 'bg-primary text-white shadow-lg' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{title}</span>
    </Link>
  )
}

const AdminSidebar = () => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>(['productos', 'contenido'])

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    {
      icon: <FaTachometerAlt />,
      title: 'Dashboard',
      path: '/admin'
    },
    {
      icon: <FaShoppingCart />,
      title: 'Productos',
      key: 'productos',
      children: [
        { title: 'Todos los Productos', path: '/admin/productos', icon: <FaBoxOpen /> },
        { title: 'Categorías', path: '/admin/categorias', icon: <FaLayerGroup /> },
        { title: 'Subcategorías', path: '/admin/subcategorias', icon: <FaTags /> }
      ]
    },
    {
      icon: <FaFileAlt />,
      title: 'Contenido',
      key: 'contenido',
      children: [
        { title: 'Banners', path: '/admin/banners', icon: <FaImages /> },
        { title: 'Testimonios', path: '/admin/testimonios', icon: <FaComments /> },
        { title: 'Contactos', path: '/admin/contactos', icon: <FaEnvelope /> }
      ]
    },
    {
      icon: <FaExclamationTriangle />,
      title: 'Reclamaciones',
      path: '/admin/reclamaciones'
    },
    {
      icon: <FaChartBar />,
      title: 'Reportes',
      key: 'reportes',
      children: [
        { title: 'Ventas', path: '/admin/reportes/ventas', icon: <FaChartBar /> },
        { title: 'Productos', path: '/admin/reportes/productos', icon: <FaBoxOpen /> },
        { title: 'Usuarios', path: '/admin/reportes/usuarios', icon: <FaUsers /> }
      ]
    },
    {
      icon: <FaCog />,
      title: 'Configuración',
      path: '/admin/configuracion'
    }
  ]

  return (
    <aside className="w-64 bg-card border-r border-border shadow-sm h-screen sticky top-0 transition-theme">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <FaTachometerAlt className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Globival</h2>
              <p className="text-xs text-muted-foreground">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                title={item.title}
                path={item.path}
                children={item.children}
                isActive={item.path ? isActive(item.path) : false}
                isExpanded={item.key ? expandedItems.includes(item.key) : false}
                onToggle={item.key ? () => toggleExpanded(item.key!) : undefined}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Globival Admin</p>
                <p className="text-xs text-muted-foreground">v2.0.0</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Estado: Activo</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar

