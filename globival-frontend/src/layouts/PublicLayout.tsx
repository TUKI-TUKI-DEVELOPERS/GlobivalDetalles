import { Outlet } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import styled from "styled-components"
import ThemeToggle from "../components/ThemeToggle"
import { FaWhatsapp } from "react-icons/fa"

const PublicThemeVars = styled.div`
  /* Mapear variables usadas en el sitio público a las variables globales */
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

const PublicLayout = () => {
  return (
    <PublicThemeVars>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow pb-8 w-full">
          <Outlet />
        </main>
        <div className="h-auto lg:h-[300px]">
          <Footer />
        </div>
        {/* Botón fijo de cambio de tema visible en todas las páginas públicas */}
        <div className="fixed bottom-4 left-4 z-[1100]">
          <ThemeToggle />
        </div>
        
        {/* Botón fijo de WhatsApp visible en todas las páginas públicas */}
        <div className="fixed bottom-4 right-4 z-[1100]">
          <a 
            href="https://wa.me/51997745679?text=Hola,%20me%20gustaría%20obtener%20más%20información" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110"
            aria-label="Contactar por WhatsApp"
            title="Me gustaría obtener más información"
          >
            <FaWhatsapp className="text-white text-2xl" />
          </a>
        </div>
      </div>
    </PublicThemeVars>
  )
}

export default PublicLayout
