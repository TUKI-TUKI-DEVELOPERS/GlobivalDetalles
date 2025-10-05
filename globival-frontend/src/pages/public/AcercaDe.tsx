import { motion } from "framer-motion"
import { FaMapMarkerAlt, FaWhatsapp, FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"
import acercaImage from "../../assets/acerca2.jpeg"

// (constantes de variantes no utilizadas eliminadas)

const AcercaDe = () => {
  return (
    <>
      {/* Fondo con animaciones */}
      <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-[var(--bg-primary)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_30%,var(--accent-glow)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,var(--accent-glow)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,var(--accent-glow)_0%,transparent_50%)] opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(45deg,transparent_30%,var(--accent-glow)_50%,transparent_70%)] opacity-30"></div>
      </div>
      
      {/* Contenedor principal */}
      <div className="relative z-10 py-8 bg-[var(--bg-secondary)] min-h-[calc(100vh-160px)] backdrop-blur-xl rounded-xl mt-4 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--accent-glow)] before:to-transparent before:opacity-10 before:pointer-events-none before:rounded-inherit">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="bg-[var(--bg-card)] p-8 md:p-10 mb-6 md:mb-8 rounded-lg shadow-lg border border-[var(--border-color)] relative overflow-hidden text-center backdrop-blur-xl before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--accent-glow)] before:to-transparent before:opacity-10 before:pointer-events-none after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:w-[200%] after:h-[200%] after:bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-5 after:pointer-events-none">
            <motion.h1 
              className="mb-3 md:mb-4 relative z-10 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Acerca de <span className="text-[var(--accent-primary)] relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[var(--accent-primary)] after:to-transparent">Globival & Detalles</span>
            </motion.h1>
            <motion.p
              className="text-[var(--text-secondary)] max-w-3xl mx-auto relative z-10 text-base md:text-lg leading-relaxed"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Descubre nuestra historia, valores y misión para ayudarte a alcanzar tus metas fitness
            </motion.p>
          </div>
          
          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            <motion.div
              className="bg-[var(--bg-card)] rounded-xl p-6 md:p-8 shadow-md border border-[var(--border-color)] relative backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--accent-glow)] before:to-transparent before:opacity-5 before:pointer-events-none before:rounded-inherit"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-[var(--text-primary)] text-2xl md:text-3xl font-semibold tracking-tight relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-[50px] after:h-0.5 after:bg-gradient-to-r after:from-[var(--accent-primary)] after:to-transparent">Nuestra Historia</h2>
              <p className="mb-6 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
                Globival – Sorpresas y Detalles que crean momentos inolvidables.
              </p>
              <p className="mb-6 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
                En Globival, creemos que cada detalle cuenta. Nos especializamos en la creación de sorpresas y regalos únicos para cualquier ocasión: cumpleaños, aniversarios, fechas especiales y momentos espontáneos que merecen ser recordados.
              </p>
              <p className="mb-6 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
                Nuestro objetivo es ayudarte a emocionar y sorprender a tus seres queridos con detalles personalizados, creativos y llenos de amor. Desde arreglos con globos hasta cajas sorpresa, cada producto está diseñado con pasión para transmitir alegría y felicidad.
              </p>
              <p className="mb-0 md:mb-6 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
                ¡Déjanos ser parte de tus momentos especiales!
              </p>
            </motion.div>
            
            <motion.div
              className="bg-[var(--bg-card)] rounded-lg overflow-hidden shadow-md border border-[var(--border-color)] relative backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/70 before:z-10 before:pointer-events-none lg:h-auto h-[300px]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={acercaImage} 
                alt="Equipo de Rooster Fit" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </motion.div>
          </div>
          
          {/* Sección de valores */}
          <section className="py-12 md:py-16 bg-[var(--bg-secondary)] my-12 relative overflow-hidden rounded-xl before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,var(--accent-glow)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,var(--accent-glow)_0%,transparent_50%)] before:opacity-10 before:pointer-events-none after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:w-[300%] after:h-[300%] after:bg-[conic-gradient(from_0deg,transparent,var(--accent-glow),transparent)] after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-3 after:pointer-events-none">
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-center mb-8 relative text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Nuestros <span className="text-[var(--accent-primary)] relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[var(--accent-primary)] after:to-transparent">Valores</span>
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
                <motion.div
                  className="bg-[var(--bg-card)] p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-[var(--border-color)] relative overflow-hidden backdrop-blur-lg hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-xl before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,var(--accent-glow)_0%,transparent_70%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none hover:before:opacity-10 after:content-[''] after:absolute after:top-[-50%] after:left-[-50%] after:w-[200%] after:h-[200%] after:bg-[linear-gradient(45deg,transparent,var(--accent-glow),transparent)] after:rotate-0 after:transition-all after:duration-300 after:opacity-0 after:pointer-events-none hover:after:opacity-5 hover:after:rotate-180"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-[var(--text-primary)] text-lg md:text-xl font-semibold mb-3 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[var(--accent-primary)] after:to-transparent">Personalización</h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                    Diseñamos cada sorpresa pensando en la persona, cuidando gustos y detalles únicos.
                  </p>
                </motion.div>
                
                <motion.div
                  className="bg-[var(--bg-card)] p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-[var(--border-color)] relative overflow-hidden backdrop-blur-lg hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-xl before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,var(--accent-glow)_0%,transparent_70%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none hover:before:opacity-10 after:content-[''] after:absolute after:top-[-50%] after:left-[-50%] after:w-[200%] after:h-[200%] after:bg-[linear-gradient(45deg,transparent,var(--accent-glow),transparent)] after:rotate-0 after:transition-all after:duration-300 after:opacity-0 after:pointer-events-none hover:after:opacity-5 hover:after:rotate-180"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-[var(--text-primary)] text-lg md:text-xl font-semibold mb-3 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[var(--accent-primary)] after:to-transparent">Creatividad</h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                    Exploramos ideas frescas para armar arreglos con globos, cajas sorpresa y presentaciones memorables.
                  </p>
                </motion.div>
                
                <motion.div
                  className="bg-[var(--bg-card)] p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-[var(--border-color)] relative overflow-hidden backdrop-blur-lg hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-xl before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,var(--accent-glow)_0%,transparent_70%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none hover:before:opacity-10 after:content-[''] after:absolute after:top-[-50%] after:left-[-50%] after:w-[200%] after:h-[200%] after:bg-[linear-gradient(45deg,transparent,var(--accent-glow),transparent)] after:rotate-0 after:transition-all after:duration-300 after:opacity-0 after:pointer-events-none hover:after:opacity-5 hover:after:rotate-180"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-[var(--text-primary)] text-lg md:text-xl font-semibold mb-3 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[var(--accent-primary)] after:to-transparent">Calidad y detalle</h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                    Seleccionamos materiales de alta calidad y acabados cuidados para que cada entrega sea perfecta.
                  </p>
                </motion.div>
                
                <motion.div
                  className="bg-[var(--bg-card)] p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-[var(--border-color)] relative overflow-hidden backdrop-blur-lg hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-xl before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,var(--accent-glow)_0%,transparent_70%)] before:opacity-0 before:transition-opacity before:duration-300 before:pointer-events-none hover:before:opacity-10 after:content-[''] after:absolute after:top-[-50%] after:left-[-50%] after:w-[200%] after:h-[200%] after:bg-[linear-gradient(45deg,transparent,var(--accent-glow),transparent)] after:rotate-0 after:transition-all after:duration-300 after:opacity-0 after:pointer-events-none hover:after:opacity-5 hover:after:rotate-180"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-[var(--text-primary)] text-lg md:text-xl font-semibold mb-3 relative inline-block after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[var(--accent-primary)] after:to-transparent">Alegría y emoción</h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                    Buscamos generar sonrisas y momentos inolvidables en cada ocasión.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Sección de contacto */}
          <section className="py-12 md:py-16 bg-[var(--bg-secondary)] relative overflow-hidden rounded-xl mt-12">
            <div className="container mx-auto px-4">
              <motion.h2
                className="text-center mb-8 relative text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-[var(--accent-primary)] relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[var(--accent-primary)] after:to-transparent">Contáctanos</span>
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div
                  className="bg-[var(--bg-card)] p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-[var(--border-color)] relative backdrop-blur-lg hover:-translate-y-1 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <FaMapMarkerAlt className="text-[var(--accent-primary)] text-3xl mx-auto mb-4" />
                  <h3 className="mb-2 text-[var(--text-primary)] text-base md:text-lg font-medium">Envíos</h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base">Envios a todo Arequipa</p>
                </motion.div>
                
                <motion.a
                  href={`https://wa.me/51997745679?text=${encodeURIComponent('Hola, estoy interesado en sus productos y quiero más información.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--bg-card)] p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-[var(--border-color)] relative backdrop-blur-lg hover:-translate-y-1 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FaWhatsapp className="text-[var(--accent-primary)] text-3xl mx-auto mb-4" />
                  <h3 className="mb-2 text-[var(--text-primary)] text-base md:text-lg font-medium">WhatsApp</h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base">997745679</p>
                </motion.a>
                
                <motion.a
                  href={`mailto:support@globivaldetalles.com?subject=${encodeURIComponent('Consulta Globival Detalles')}&body=${encodeURIComponent('Hola, estoy interesado en sus productos y quiero más información.')}`}
                  className="bg-[var(--bg-card)] p-6 rounded-lg text-center transition-all duration-300 shadow-md border border-[var(--border-color)] relative backdrop-blur-lg hover:-translate-y-1 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <FaEnvelope className="text-[var(--accent-primary)] text-3xl mx-auto mb-4" />
                  <h3 className="mb-2 text-[var(--text-primary)] text-base md:text-lg font-medium">Email</h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base">support@globivaldetalles.com</p>
                </motion.a>
              </div>
              
              {/* Redes sociales */}
              <div className="flex justify-center mt-8 space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61572916207328" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--accent-primary)] border border-[var(--border-color)] transition-all duration-300 hover:bg-[var(--accent-primary)] hover:text-white hover:scale-110">
                  <FaFacebook />
                </a>
                <a href="https://www.instagram.com/globival.detalles/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--accent-primary)] border border-[var(--border-color)] transition-all duration-300 hover:bg-[var(--accent-primary)] hover:text-white hover:scale-110">
                  <FaInstagram />
                </a>
                <a href="https://www.tiktok.com/@globival.detalles" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--accent-primary)] border border-[var(--border-color)] transition-all duration-300 hover:bg-[var(--accent-primary)] hover:text-white hover:scale-110">
                  <FaTiktok />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default AcercaDe
