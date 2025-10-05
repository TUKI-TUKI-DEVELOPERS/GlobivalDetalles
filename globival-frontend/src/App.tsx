import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider as CustomThemeProvider } from "./contexts/ThemeContext"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

// Layouts
import PublicLayout from "./layouts/PublicLayout"
import AdminLayout from "./layouts/AdminLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Páginas públicas
import Home from "./pages/public/Home"

import Catalogo from "./pages/public/Catalogo"
import DetalleProducto from "./pages/public/DetalleProducto"
import Social from "./pages/public/Social"
import LibroReclamaciones from "./pages/public/LibroReclamaciones"
import AcercaDe from "./pages/public/AcercaDe"
import Login from "./pages/public/Login"
import Contacto from "./pages/public/Contacto"

// Páginas admin
import Dashboard from "./pages/admin/Dashboard"
import ProductosAdmin from "./pages/admin/ProductosAdmin"
import CategoriasAdmin from "./pages/admin/CategoriasAdmin"
import SubcategoriasAdmin from "./pages/admin/SubcategoriasAdmin"
import ReclamacionesAdmin from "./pages/admin/ReclamacionesAdmin"
import TestimoniosAdmin from "./pages/admin/TestimoniosAdmin"
import BannersAdmin from "./pages/admin/BannersAdmin"
import ContactosAdmin from "./pages/admin/ContactosAdmin"
import ScrollToTop from "./components/ScrollToTop"

// Definición del tema para styled-components
const theme = {
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
  },
  borderRadius: {
    small: "8px",
    medium: "12px",
    large: "16px",
    round: "9999px",
  },
  transitions: {
    fast: "0.2s ease",
    medium: "0.3s ease",
  },
  colors: {
    darkGray: "#1e1e1e",
    mediumGray: "#2a2a2a",
    border: "var(--color-border)",
    textPrimary: "var(--color-foreground)",
    textSecondary: "var(--color-muted-foreground)",
    primary: "var(--color-primary)",
    brand500: "var(--color-primary)",
    neutral900: "#0f172a",
    dark: "#121212",
    danger: "#ef4444",
  },
}

function App() {
  return (
    <CustomThemeProvider>
      <StyledThemeProvider theme={theme}>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />

              <Route path="catalogo" element={<Catalogo />} />
              <Route path="producto/:id" element={<DetalleProducto />} />
              <Route path="social" element={<Social />} />
              <Route path="libro-reclamaciones" element={<LibroReclamaciones />} />
              <Route path="acerca-de" element={<AcercaDe />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Rutas admin (protegidas) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="productos"
                element={
                  <ProtectedRoute>
                    <ProductosAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="categorias"
                element={
                  <ProtectedRoute>
                    <CategoriasAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subcategorias"
                element={
                  <ProtectedRoute>
                    <SubcategoriasAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reclamaciones"
                element={
                  <ProtectedRoute>
                    <ReclamacionesAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="testimonios"
                element={
                  <ProtectedRoute>
                    <TestimoniosAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="banners"
                element={
                  <ProtectedRoute>
                    <BannersAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="contactos"
                element={
                  <ProtectedRoute>
                    <ContactosAdmin />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
        <ToastContainer position="bottom-right" theme="colored" />
      </StyledThemeProvider>
    </CustomThemeProvider>
  )
}

export default App

