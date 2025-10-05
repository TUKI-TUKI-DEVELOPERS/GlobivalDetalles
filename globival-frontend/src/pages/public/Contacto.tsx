"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { FaEnvelope, FaPhone, FaUser, FaTag, FaList } from "react-icons/fa"
import { toast } from "react-toastify"
import api from "../../services/api"

// Esquema de validación para el formulario
const ContactSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, "Nombre demasiado corto")
    .max(50, "Nombre demasiado largo")
    .required("El nombre es obligatorio"),
  telefono: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .min(9, "El número debe tener al menos 9 dígitos")
    .required("El teléfono es obligatorio"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  titulo: Yup.string()
    .min(5, "Título demasiado corto")
    .max(100, "Título demasiado largo")
    .required("El título es obligatorio"),
  mensaje: Yup.string()
    .min(10, "Mensaje demasiado corto")
    .max(500, "Mensaje demasiado largo")
    .required("El mensaje es obligatorio"),
  categoria: Yup.string()
    .required("Selecciona una categoría")
})

// Categorías para el formulario
const categorias = [
  "Detalles para cumpleaños",
  "Sorpresas de aniversario",
  "Regalos corporativos",
  "Detalles para bodas",
  "Regalos personalizados",
  "Otros"
]

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

interface ContactFormValues {
  nombre: string;
  telefono: string;
  email: string;
  titulo: string;
  mensaje: string;
  categoria: string;
}

const Contacto = () => {
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (
    values: ContactFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    setEnviando(true)
    try {
      await api.post(`/contacts`, values)
      toast.success("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.")
      resetForm()
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      toast.error("Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="bg-background py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contáctanos</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Completa el formulario y nos pondremos en contacto contigo lo antes posible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg p-8 shadow-md border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Información de Contacto</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaEnvelope className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <a href="mailto:info@globivaldetalles.com" className="text-sm text-muted-foreground hover:text-primary">
                    info@globivaldetalles.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaPhone className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-foreground">Teléfono</p>
                  <a href="tel:+51997745679" className="text-sm text-muted-foreground hover:text-primary">
                    +51 997 745 679
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-lg font-medium mb-4 text-foreground">Horario de Atención</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Lunes a Viernes: 9:00 AM - 7:00 PM</p>
                <p className="text-sm text-muted-foreground">Sábados: 10:00 AM - 5:00 PM</p>
                <p className="text-sm text-muted-foreground">Domingos: Cerrado</p>
              </div>
            </div>
          </motion.div>

          {/* Formulario de contacto */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg p-8 shadow-md border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Envíanos un Mensaje</h2>
            
            <Formik
              initialValues={{
                nombre: "",
                telefono: "",
                email: "",
                titulo: "",
                mensaje: "",
                categoria: ""
              }}
              validationSchema={ContactSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Field
                        type="text"
                        name="nombre"
                        id="nombre"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.nombre && touched.nombre ? 'border-red-500' : 'border-border'
                        } bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <ErrorMessage name="nombre" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-foreground mb-1">
                      Número de teléfono
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Field
                        type="text"
                        name="telefono"
                        id="telefono"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.telefono && touched.telefono ? 'border-red-500' : 'border-border'
                        } bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        placeholder="Tu número de teléfono"
                      />
                    </div>
                    <ErrorMessage name="telefono" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.email && touched.email ? 'border-red-500' : 'border-border'
                        } bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        placeholder="Tu correo electrónico"
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-foreground mb-1">
                      Categoría
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaList className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Field
                        as="select"
                        name="categoria"
                        id="categoria"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.categoria && touched.categoria ? 'border-red-500' : 'border-border'
                        } bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="categoria" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-foreground mb-1">
                      Título del mensaje
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTag className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Field
                        type="text"
                        name="titulo"
                        id="titulo"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.titulo && touched.titulo ? 'border-red-500' : 'border-border'
                        } bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                        placeholder="Asunto de tu mensaje"
                      />
                    </div>
                    <ErrorMessage name="titulo" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-1">
                      Mensaje
                    </label>
                    <Field
                      as="textarea"
                      name="mensaje"
                      id="mensaje"
                      rows={4}
                      className={`block w-full px-3 py-2 rounded-md border ${
                        errors.mensaje && touched.mensaje ? 'border-red-500' : 'border-border'
                      } bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="Escribe tu mensaje aquí..."
                    />
                    <ErrorMessage name="mensaje" component="p" className="mt-1 text-sm text-red-500" />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting || enviando}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {enviando ? "Enviando..." : "Enviar mensaje"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Contacto