import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { FaUser, FaLock } from "react-icons/fa"
import { useAuth } from "../../hooks/useAuth"
import { motion } from "framer-motion"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("El email es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
})

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin")
    }
  }, [isAuthenticated, navigate, location.state])

  const handleSubmit = async (values: Record<string, unknown>, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const success = await login(values.email as string, values.password as string)
      if (success) {
        navigate("/admin")
      }
    } catch {
      console.error("Error de login")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Fondo con animaciones */}
      <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent opacity-70 blur-md animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-20"></div>
      </div>

      {/* Contenedor principal */}
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] p-4 md:p-8 relative z-10 bg-background/80 backdrop-blur-xl w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-xl shadow-lg w-full max-w-md p-6 md:p-8 border border-white/10 relative overflow-hidden backdrop-blur-3xl"
        >
          {/* Efectos de fondo para la tarjeta */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-5 pointer-events-none animate-pulse"></div>
          
          {/* Encabezado */}
          <div className="text-center mb-6 md:mb-8 relative z-10 flex flex-col items-center gap-3">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              Globival <span className="text-primary">&</span> Detalles
            </div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-3xl md:text-4xl mb-3 bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent font-bold"
            >
              Admin <span className="relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">Login</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground text-base md:text-lg max-w-[80%]"
            >
              Ingresa tus credenciales para acceder al panel de administración
            </motion.p>
          </div>

          {/* Formulario */}
          <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <motion.div variants={itemVariants} className="mb-6">
                  <label htmlFor="email" className="block mb-2 font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl transition-colors peer-focus:text-primary">
                      <FaUser />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="admin@example.com"
                      className="peer w-full py-3 pl-12 pr-4 bg-card border border-border rounded-md text-foreground text-base transition-all h-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 focus:bg-background/50 focus:-translate-y-0.5 placeholder:text-muted-foreground/70 backdrop-blur-md"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6">
                  <label htmlFor="password" className="block mb-2 font-medium text-foreground">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl transition-colors peer-focus:text-primary">
                      <FaLock />
                    </div>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="peer w-full py-3 pl-12 pr-4 bg-card border border-border rounded-md text-foreground text-base transition-all h-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 focus:bg-background/50 focus:-translate-y-0.5 placeholder:text-muted-foreground/70 backdrop-blur-md"
                    />
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary to-red-500 text-white rounded-md font-semibold cursor-pointer transition-all shadow-md flex items-center justify-center h-12 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg active:translate-y-0 disabled:bg-muted-foreground disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none group"
                >
                  {isSubmitting ? (
                    "Iniciando sesión..."
                  ) : (
                    <>
                      <FaUser className="mr-2 transition-transform duration-300 group-hover:scale-125" /> Iniciar Sesión
                    </>
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </>
  )
}

export default Login
