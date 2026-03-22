"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, FolderTree, Layers } from "lucide-react";
import type { Category, SubCategory } from "@/types";

interface SubcategoryFormValues {
  name: string;
  categoryId: number | "";
}

interface SubcategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; categoryId: number }) => void | Promise<void>;
  initialData?: SubCategory | null;
  categories: Category[];
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es requerido")
    .max(255, "Máximo 255 caracteres"),
  categoryId: Yup.number()
    .required("La categoría padre es requerida")
    .min(1, "Selecciona una categoría"),
});

export default function SubcategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}: SubcategoryFormProps) {
  const formik = useFormik<SubcategoryFormValues>({
    initialValues: {
      name: initialData?.name || "",
      categoryId: initialData?.category_id || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit({
          name: values.name.trim(),
          categoryId: Number(values.categoryId),
        });
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

  const selectedCategory = categories.find(
    (c) => c.id === Number(formik.values.categoryId),
  );
  const siblingCount = selectedCategory?.subcategories?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <FolderTree size={16} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {initialData ? "Editar Subcategoría" : "Nueva Subcategoría"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-5 space-y-5">
          {/* Category select */}
          <div>
            <label
              htmlFor="categoryId"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <Layers size={14} className="text-muted-foreground" />
              Categoría padre *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                  {cat.subcategories
                    ? ` (${cat.subcategories.length} subcategorías)`
                    : ""}
                </option>
              ))}
            </select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="mt-1 text-xs text-destructive">
                {formik.errors.categoryId}
              </p>
            )}
            {selectedCategory && siblingCount > 0 && !initialData && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Ya tiene {siblingCount} subcategoría
                {siblingCount !== 1 ? "s" : ""}:{" "}
                {selectedCategory.subcategories
                  ?.slice(0, 3)
                  .map((s) => s.name)
                  .join(", ")}
                {siblingCount > 3 ? "..." : ""}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <FolderTree size={14} className="text-muted-foreground" />
              Nombre de la subcategoría *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={255}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ej: Ramos de Girasol"
              autoFocus
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="mt-1 text-xs text-destructive">{formik.errors.name}</p>
            ) : (
              formik.values.name.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground text-right">
                  {formik.values.name.length}/255
                </p>
              )
            )}
          </div>

          {/* Preview */}
          {formik.values.name && formik.values.categoryId && (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Vista previa</p>
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">
                  {selectedCategory?.name || "Categoría"}
                </span>
                <span className="text-muted-foreground mx-1.5">→</span>
                <span className="font-medium">{formik.values.name}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {initialData ? "Actualizar Subcategoría" : "Crear Subcategoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
