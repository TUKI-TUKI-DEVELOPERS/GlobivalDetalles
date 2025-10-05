import { Outlet } from "react-router-dom"
import { useState } from "react"
import AdminHeader from "../components/admin/AdminHeader"
import AdminSidebar from "../components/admin/AdminSidebar"
import { FaBars, FaTimes } from "react-icons/fa"
import styled from "styled-components"

// Define AdminThemeVars at module scope to avoid dynamic styled-components creation
const AdminThemeVars = styled.div`
  /* Mapear variables usadas en el panel admin a las variables globales */
  --bg-card: var(--card);
  --bg-secondary: var(--muted);
  --text-primary: var(--foreground);
  --text-secondary: var(--muted-foreground);
  --border-color: var(--border);
  --accent-primary: var(--primary);
  --accent-secondary: var(--secondary);
  --accent-glow: var(--primary);
  /* Sombra coherente para modo claro/oscuro */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.12);
`

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <AdminThemeVars>
      <div className="flex min-h-screen bg-background text-foreground relative">
        <button 
          className="md:hidden fixed top-4 left-4 z-[1001] bg-primary hover:bg-primary/90 rounded-md text-white p-2.5 cursor-pointer shadow-md flex items-center justify-center transition-colors"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {sidebarOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>

        <div 
          className={`w-64 bg-card fixed h-screen overflow-y-auto z-[1000] transition-transform duration-300 border-r border-border
                     ${sidebarOpen ? 'translate-x-0 shadow-lg md:shadow-none' : '-translate-x-full md:translate-x-0'}`}
        >
          <AdminSidebar onClose={closeSidebar} />
        </div>

        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] md:hidden transition-all duration-300
                     ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          onClick={closeSidebar}
        ></div>

        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 pt-0 bg-background min-h-screen">
          <AdminHeader onMenuClick={toggleSidebar} />
          {/* Spacer to account for fixed AdminHeader height */}
          <div className="h-16 md:h-14" aria-hidden="true" />
          <div className="mt-2 md:mt-4">
            <Outlet />
          </div>
        </main>
      </div>
    </AdminThemeVars>
  )
}

export default AdminLayout
