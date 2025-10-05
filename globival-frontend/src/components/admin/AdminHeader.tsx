import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaBell, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaSearch, 
  FaMoon, 
  FaSun,
  FaChevronDown,
  FaUserCircle,
  FaShieldAlt
} from 'react-icons/fa'
import { useTheme } from '../../contexts/ThemeContext'

const AdminHeader = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  const notifications = [
    { id: 1, title: 'Nueva reclamación', message: 'Cliente reportó problema con envío', time: '5 min', type: 'warning' },
    { id: 2, title: 'Producto añadido', message: 'Camiseta RoosterFit Premium agregada', time: '1 h', type: 'success' },
    { id: 3, title: 'Nuevo testimonio', message: 'María González dejó 5 estrellas', time: '2 h', type: 'info' }
  ]

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">Globival Admin</h1>
                <p className="text-xs text-muted-foreground">Panel de Control</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm" />
              <input
                type="text"
                placeholder="Buscar productos, categorías..."
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200 relative"
                title="Notificaciones"
              >
                <FaBell className="text-lg" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Notificaciones</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'warning' ? 'bg-amber-500' :
                            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border">
                    <Link 
                      to="/admin/notificaciones" 
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      Ver todas las notificaciones
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200"
              >
                <FaUserCircle className="text-2xl text-muted-foreground" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">Administrador</p>
                  <p className="text-xs text-muted-foreground">admin@globival.com</p>
                </div>
                <FaChevronDown className={`text-xs text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-3xl text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Administrador</p>
                        <p className="text-sm text-muted-foreground">admin@globival.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/admin/perfil"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser className="text-muted-foreground" />
                      Mi Perfil
                    </Link>
                    <Link
                      to="/admin/configuracion"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaCog className="text-muted-foreground" />
                      Configuración
                    </Link>
                  </div>
                  <div className="border-t border-border py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                    >
                      <FaSignOutAlt />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
    </header>
  )
}

export default AdminHeader

