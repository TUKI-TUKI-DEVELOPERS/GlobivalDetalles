"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BookOpen, Check, Send } from "lucide-react";
import { toast } from "react-toastify";
import { claimService } from "@/services/api";
import { motion } from "framer-motion";

const ReclamacionSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  email: Yup.string()
    .email("Email invalido")
    .required("El email es requerido"),
  telefono: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten numeros")
    .min(9, "El telefono debe tener al menos 9 digitos"),
  mensaje: Yup.string()
    .required("El mensaje es requerido")
    .min(10, "El mensaje debe tener al menos 10 caracteres"),
});

export default function LibroReclamacionesPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Libro de Reclamaciones | Globival Detalles";
  }, []);

  const handleSubmit = async (
    values: {
      nombre: string;
      email: string;
      telefono: string;
      mensaje: string;
    },
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    }
  ) => {
    try {
      await claimService.create(values);
      setSubmitted(true);
      resetForm();
      toast.success("Reclamacion enviada correctamente");
    } catch {
      console.error("Error al enviar reclamacion");
      toast.error(
        "Error al enviar la reclamacion. Por favor, intentalo de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.1),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.1),transparent_40%)] opacity-60" />
      </div>

      <div className="container mx-auto py-8 relative z-10 bg-background/80 min-h-[calc(100vh-160px)] backdrop-blur-xl">
        {/* Header */}
        <div className="bg-card p-8 mb-8 rounded-md shadow-lg border border-border relative overflow-hidden text-center backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent -z-10" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 relative z-10 text-2xl font-bold"
          >
            Libro de{" "}
            <span className="text-primary relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
              Reclamaciones
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-3xl mx-auto relative z-10"
          >
            Tu opinion es importante para nosotros. Completa el formulario para
            registrar tu reclamo o sugerencia.
          </motion.p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-md p-6 h-fit shadow-md border border-border relative backdrop-blur-md"
          >
            <h2 className="mb-6 flex items-center text-xl font-semibold">
              <BookOpen className="text-primary mr-3 w-5 h-5" />
              Informacion Importante
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              El Libro de Reclamaciones es una herramienta que permite a los
              consumidores presentar sus quejas o reclamos sobre los productos o
              servicios ofrecidos.
            </p>

            <ul className="list-none p-0 mb-6 space-y-4">
              {[
                {
                  title: "Reclamo:",
                  desc: "Disconformidad relacionada a los productos o servicios.",
                },
                {
                  title: "Queja:",
                  desc: "Disconformidad no relacionada a los productos o servicios, o malestar o descontento respecto a la atencion al publico.",
                },
                {
                  title: "Tiempo de respuesta:",
                  desc: "Nos comprometemos a responder en un plazo maximo de 30 dias calendario.",
                },
              ].map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start"
                >
                  <Check className="text-primary mr-3 mt-1 w-4 h-4 flex-shrink-0" />
                  <div>
                    <strong>{item.title}</strong> {item.desc}
                  </div>
                </motion.li>
              ))}
            </ul>

            <p className="text-muted-foreground leading-relaxed">
              Tambien puedes presentar tu reclamo de manera presencial en
              cualquiera de nuestras tiendas.
            </p>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-md p-6 shadow-md border border-border relative backdrop-blur-md"
          >
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-success/10 border border-success text-success p-4 rounded-md mb-6 flex items-center"
              >
                <Check className="mr-3 w-5 h-5" />
                <div>
                  <strong>Reclamacion enviada!</strong>
                  <p>
                    Hemos recibido tu reclamacion y te responderemos a la
                    brevedad.
                  </p>
                </div>
              </motion.div>
            )}

            <Formik
              initialValues={{
                nombre: "",
                email: "",
                telefono: "",
                mensaje: "",
              }}
              validationSchema={ReclamacionSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-6">
                    <label
                      htmlFor="nombre"
                      className="block mb-2 font-medium"
                    >
                      Nombre completo *
                    </label>
                    <Field
                      type="text"
                      name="nombre"
                      id="nombre"
                      placeholder="Ingresa tu nombre completo"
                      className="w-full p-3 bg-card border border-border rounded-md text-foreground text-base transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <ErrorMessage
                      name="nombre"
                      component="div"
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 font-medium">
                      Correo electronico *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Ingresa tu correo electronico"
                      className="w-full p-3 bg-card border border-border rounded-md text-foreground text-base transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="telefono"
                      className="block mb-2 font-medium"
                    >
                      Telefono
                    </label>
                    <Field
                      type="text"
                      name="telefono"
                      id="telefono"
                      placeholder="Ingresa tu numero de telefono"
                      className="w-full p-3 bg-card border border-border rounded-md text-foreground text-base transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <ErrorMessage
                      name="telefono"
                      component="div"
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="mensaje"
                      className="block mb-2 font-medium"
                    >
                      Detalle de la reclamacion *
                    </label>
                    <Field
                      as="textarea"
                      name="mensaje"
                      id="mensaje"
                      placeholder="Describe detalladamente tu reclamo o queja"
                      className="w-full p-3 bg-card border border-border rounded-md text-foreground text-base transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground min-h-[150px] resize-y"
                    />
                    <ErrorMessage
                      name="mensaje"
                      component="div"
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 bg-gradient-to-r from-primary to-primary/70 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" /> Enviar Reclamacion
                      </>
                    )}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
