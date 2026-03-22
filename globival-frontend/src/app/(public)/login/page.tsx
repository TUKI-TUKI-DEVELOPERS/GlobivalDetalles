"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email invalido")
    .required("El email es requerido"),
  password: Yup.string().required("La contrasena es requerida"),
});

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
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "Iniciar Sesión | Globival Detalles";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const success = await login(values.email, values.password);
      if (success) {
        router.push("/admin");
      }
    } catch {
      console.error("Error de login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.15),transparent_60%)] opacity-70" />
      </div>

      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] p-4 md:p-8 relative z-10 bg-background/80 backdrop-blur-xl w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-xl shadow-lg w-full max-w-md p-6 md:p-8 border border-border relative overflow-hidden backdrop-blur-3xl"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-10 pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6 md:mb-8 relative z-10 flex flex-col items-center gap-3">
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              Globival <span className="text-primary">&amp;</span> Detalles
            </div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-bold"
            >
              Admin{" "}
              <span className="relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent">
                Login
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-muted-foreground text-base md:text-lg max-w-[80%]"
            >
              Ingresa tus credenciales para acceder al panel de administracion
            </motion.p>
          </div>

          {/* Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <motion.div variants={itemVariants} className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium text-foreground"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="w-5 h-5" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      placeholder="admin@example.com"
                      className="w-full py-3 pl-12 pr-4 bg-card border border-border rounded-md text-foreground text-base transition-all h-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/70"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-destructive text-sm mt-1"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6">
                  <label
                    htmlFor="password"
                    className="block mb-2 font-medium text-foreground"
                  >
                    Contrasena
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="--------"
                      className="w-full py-3 pl-12 pr-4 bg-card border border-border rounded-md text-foreground text-base transition-all h-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/70"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-destructive text-sm mt-1"
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary/70 text-white rounded-md font-semibold cursor-pointer transition-all shadow-md flex items-center justify-center h-12 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    "Iniciando sesion..."
                  ) : (
                    <>
                      <User className="mr-2 w-4 h-4 transition-transform duration-300 group-hover:scale-125" />{" "}
                      Iniciar Sesion
                    </>
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
}
