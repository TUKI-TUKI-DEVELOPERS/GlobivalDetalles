"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import type { Category } from "@/types";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string }) => void | Promise<void>;
  initialData?: Category | null;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres"),
});

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CategoryFormProps) {
  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit(values);
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error saving:", error);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-background p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <h2 className="mb-6 text-xl font-bold text-foreground">
          {initialData ? "Editar Categoria" : "Nueva Categoria"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nombre de la categoria"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-destructive">{formik.errors.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {initialData ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
