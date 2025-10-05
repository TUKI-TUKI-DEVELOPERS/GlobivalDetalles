import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md"
import { NavLink } from "react-router-dom"
import logoGlobival from "../../assets/logo_globival.png"

const Footer = () => {
  return (
    <footer className="section-dark text-foreground border-t border-border mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <div className="h-20 w-20 md:h-24 md:w-24 flex items-center justify-center overflow-hidden">
              <img
                src={logoGlobival}
                alt="Globival & Detalles"
                className="w-full h-full object-contain object-center filter drop-shadow-md"
              />
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Especialistas en productos de calidad para el hogar y la vida diaria. Comprometidos con la excelencia y la
            satisfacción del cliente.
          </p>
          <div className="flex gap-6 mt-6">
            <a
              href="https://www.instagram.com/globival.detalles/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-2xl transition-colors duration-200 hover:text-primary"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61572916207328"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-2xl transition-colors duration-200 hover:text-primary"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@globival.detalles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-2xl transition-colors duration-200 hover:text-primary"
            >
              <FaTiktok />
            </a>
            <a
              href="https://wa.me/51997745679?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              title="Me gustaría obtener más información"
              className="text-muted-foreground text-2xl transition-colors duration-200 hover:text-primary"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-foreground">Enlaces Rápidos</h3>
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/catalogo"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Catálogo
            </NavLink>
            <NavLink
              to="/acerca-de"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Acerca de
            </NavLink>
            <NavLink
              to="/libro-reclamaciones"
              aria-label="Libro de reclamaciones"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Libro de reclamaciones
            </NavLink>
            <NavLink
              to="/social"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Testimonios
            </NavLink>
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-foreground">Categorías</h3>
          <nav className="space-y-2">
            <NavLink
              to="/catalogo?categoria=detalles"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Detalles Especiales
            </NavLink>
            <NavLink
              to="/catalogo?categoria=regalos"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Regalos
            </NavLink>
            <NavLink
              to="/catalogo?categoria=decoracion"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Decoración
            </NavLink>
            <NavLink
              to="/catalogo?categoria=personalizados"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
            >
              Personalizados
            </NavLink>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-foreground">Contacto</h3>
          <div className="flex items-center mb-2">
            <MdPhone className="mr-2 text-amber-400 dark:text-amber-300" />
            <a href="tel:+51997745679" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              +51 997745679
            </a>
          </div>
          <div className="flex items-center mb-2">
            <MdEmail className="mr-2 text-amber-400 dark:text-amber-300" />
            <a href="mailto:support@globivaldetalles.com" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              support@globivaldetalles.com
            </a>
          </div>
          <div className="flex items-center mb-2">
            <MdLocationOn className="mr-2 text-amber-400 dark:text-amber-300" />
            <span className="text-muted-foreground">Envios a todo Arequipa</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-border px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p className="m-0 text-muted-foreground">
          &copy; {new Date().getFullYear()} Globival & Detalles. Todos los derechos reservados.
        </p>
        <p className="mt-2 m-0 text-muted-foreground">Desarrollado por Tukituki Solutions sac</p>
      </div>
    </footer>
  )
}

export default Footer
