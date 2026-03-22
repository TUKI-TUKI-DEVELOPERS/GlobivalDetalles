"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { X, Upload, ImagePlus, Trash2, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { buildImageUrl, validateImageFile } from "@/config/constants";
import { productService } from "@/services/api";
import type { Product, SubCategory, Category } from "@/types";

interface ProductoFormValues {
  name: string;
  price: string;
  description: string;
  sub_category_id: number | "";
  precio_de_oferta: string;
  stock: number | "";
  SKU: string;
  imagen: File | null;
}

interface ProductoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
  initialData?: Product | null;
  subcategories: SubCategory[];
}

function generateSKU(name: string): string {
  const clean = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .toUpperCase();
  const words = clean.split(/\s+/).filter(Boolean);
  const prefix =
    words.length >= 2
      ? words
          .slice(0, 3)
          .map((w) => w.slice(0, 3))
          .join("-")
      : clean.slice(0, 8);
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}-${num}`;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es requerido")
    .max(255, "Máximo 255 caracteres"),
  price: Yup.number()
    .required("El precio es requerido")
    .min(0, "El precio no puede ser negativo")
    .typeError("Ingrese un número válido"),
  description: Yup.string(),
  sub_category_id: Yup.number()
    .required("La subcategoría es requerida")
    .min(1, "Seleccione una subcategoría"),
  precio_de_oferta: Yup.number()
    .nullable()
    .min(0, "No puede ser negativo")
    .transform((v, orig) => (orig === "" ? undefined : v)),
  stock: Yup.number()
    .required("El stock es requerido")
    .min(0, "No puede ser negativo")
    .integer("Debe ser un número entero"),
  SKU: Yup.string().max(50, "Máximo 50 caracteres"),
});

export default function ProductoForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  subcategories,
}: ProductoFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFilesRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extraImages, setExtraImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  // Group subcategories by category for the select
  const groupedSubcategories = useMemo(() => {
    const groups: Record<string, { category: Category; subs: SubCategory[] }> =
      {};
    for (const sub of subcategories) {
      const catName = sub.category?.name || "Sin categoría";
      const catId = sub.category?.id || 0;
      if (!groups[catName]) {
        groups[catName] = {
          category: sub.category || { id: catId, name: catName, created_at: "", updated_at: "" },
          subs: [],
        };
      }
      groups[catName].subs.push(sub);
    }
    return Object.values(groups).sort((a, b) =>
      a.category.name.localeCompare(b.category.name),
    );
  }, [subcategories]);

  const formik = useFormik<ProductoFormValues>({
    initialValues: {
      name: initialData?.name || "",
      price: String(initialData?.price ?? ""),
      description: initialData?.description || "",
      sub_category_id: initialData?.sub_category_id || "",
      precio_de_oferta: initialData?.precio_de_oferta
        ? String(initialData.precio_de_oferta)
        : "",
      stock: initialData?.stock ?? 1,
      SKU: initialData?.SKU || "",
      imagen: null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      // Delete marked images first (only in edit mode)
      if (initialData && imagesToDelete.length > 0) {
        await Promise.allSettled(
          imagesToDelete.map((imgId) =>
            productService.deleteImage(initialData.id, imgId),
          ),
        );
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      if (values.description) formData.append("description", values.description);
      formData.append("sub_category_id", String(values.sub_category_id));
      if (values.precio_de_oferta) {
        formData.append("precio_de_oferta", values.precio_de_oferta);
      }
      formData.append("stock", String(values.stock));
      if (values.SKU) formData.append("SKU", values.SKU);
      if (values.imagen) {
        formData.append("imagen", values.imagen);
      }
      // Extra images
      for (const extra of extraImages) {
        formData.append("images[]", extra.file);
      }
      try {
        await onSubmit(formData);
        resetForm();
        setImagePreview(null);
        setExtraImages([]);
        setImagesToDelete([]);
        onClose();
      } catch (error) {
        console.error("Error saving:", error);
      }
    },
  });

  // Auto-generate SKU when name changes and SKU is empty
  const handleGenerateSKU = () => {
    if (formik.values.name.trim()) {
      formik.setFieldValue("SKU", generateSKU(formik.values.name));
    } else {
      toast.warning("Escribe el nombre del producto primero");
    }
  };

  useEffect(() => {
    if (isOpen && initialData?.imagen) {
      setImagePreview(buildImageUrl(initialData.imagen));
    } else if (!isOpen) {
      setImagePreview(null);
      setExtraImages([]);
      setImagesToDelete([]);
    }
  }, [isOpen, initialData]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        e.target.value = "";
        return;
      }
      formik.setFieldValue("imagen", file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: { file: File; preview: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateImageFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        continue;
      }
      newImages.push({ file, preview: URL.createObjectURL(file) });
    }
    setExtraImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeExtraImage = (index: number) => {
    setExtraImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <h2 className="mb-6 text-xl font-bold text-foreground">
          {initialData ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Nombre del producto *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ej: Ramo Hot Wheels Duo"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-destructive">{formik.errors.name}</p>
            )}
          </div>

          {/* Subcategory grouped */}
          <div>
            <label
              htmlFor="sub_category_id"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Categoría / Subcategoría *
            </label>
            <select
              id="sub_category_id"
              name="sub_category_id"
              value={formik.values.sub_category_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Seleccionar categoría y subcategoría</option>
              {groupedSubcategories.map((group) => (
                <optgroup key={group.category.id} label={group.category.name}>
                  {group.subs.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {formik.touched.sub_category_id &&
              formik.errors.sub_category_id && (
                <p className="mt-1 text-xs text-destructive">
                  {formik.errors.sub_category_id}
                </p>
              )}
          </div>

          {/* Price + Offer price row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Precio (S/) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="0.00"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="mt-1 text-xs text-destructive">
                  {formik.errors.price}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="precio_de_oferta"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Precio de Oferta (S/)
                <span className="ml-1 text-xs text-muted-foreground">
                  opcional
                </span>
              </label>
              <input
                id="precio_de_oferta"
                name="precio_de_oferta"
                type="number"
                step="0.01"
                min="0"
                value={formik.values.precio_de_oferta}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Dejar vacío si no hay oferta"
              />
            </div>
          </div>

          {/* Stock + SKU row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="stock"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Stock *
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="1"
              />
              {formik.touched.stock && formik.errors.stock && (
                <p className="mt-1 text-xs text-destructive">
                  {formik.errors.stock}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="SKU"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                SKU
                <span className="ml-1 text-xs text-muted-foreground">
                  opcional
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  id="SKU"
                  name="SKU"
                  type="text"
                  value={formik.values.SKU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Se genera automáticamente"
                />
                <button
                  type="button"
                  onClick={handleGenerateSKU}
                  className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-accent px-3 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  title="Generar SKU automáticamente"
                >
                  <Sparkles size={14} />
                  Generar
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Descripción
              <span className="ml-1 text-xs text-muted-foreground">
                opcional
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Describe el producto, materiales, contenido..."
            />
          </div>

          {/* Main image */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Imagen principal
              {!initialData && (
                <span className="ml-1 text-xs text-muted-foreground">
                  recomendado
                </span>
              )}
            </label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      formik.setFieldValue("imagen", null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 size={18} className="text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Upload size={22} />
                  <span className="text-xs">Subir</span>
                </button>
              )}
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-foreground/70 transition-colors hover:border-primary hover:bg-accent"
                >
                  <Upload size={16} />
                  Cambiar
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Extra images */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Imágenes adicionales
                <span className="ml-1 text-xs text-muted-foreground">
                  opcional — galería del producto
                </span>
              </label>
              {imagesToDelete.length > 0 && (
                <span className="text-xs font-medium text-destructive">
                  {imagesToDelete.length} imagen{imagesToDelete.length !== 1 ? "es" : ""} se eliminará{imagesToDelete.length !== 1 ? "n" : ""} al guardar
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Existing extra images (edit mode) */}
              {initialData?.images?.map((img, i) => {
                const imgId = typeof img === "string" ? null : img.id;
                const imgPath = typeof img === "string" ? img : img.image_path;
                const markedForDelete = imgId !== null && imagesToDelete.includes(imgId);
                return (
                  <div
                    key={`existing-${i}`}
                    className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-opacity ${
                      markedForDelete
                        ? "border-destructive opacity-40"
                        : "border-border"
                    }`}
                  >
                    <Image
                      src={buildImageUrl(imgPath)}
                      alt={`Imagen ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {markedForDelete ? (
                      /* Undo button */
                      <button
                        type="button"
                        onClick={() =>
                          imgId !== null &&
                          setImagesToDelete((prev) =>
                            prev.filter((id) => id !== imgId),
                          )
                        }
                        className="absolute inset-0 flex items-center justify-center bg-destructive/30"
                        title="Deshacer eliminación"
                      >
                        <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                          DESHACER
                        </span>
                      </button>
                    ) : (
                      /* Delete button */
                      <button
                        type="button"
                        onClick={() =>
                          imgId !== null &&
                          setImagesToDelete((prev) => [...prev, imgId])
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                        title="Eliminar imagen"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                );
              })}
              {/* New extra images */}
              {extraImages.map((img, i) => (
                <div
                  key={`new-${i}`}
                  className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <Image
                    src={img.preview}
                    alt={`Nueva imagen ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraImage(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
              {/* Add button */}
              <button
                type="button"
                onClick={() => extraFilesRef.current?.click()}
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ImagePlus size={20} />
                <span className="text-[10px]">Agregar</span>
              </button>
              <input
                ref={extraFilesRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                multiple
                onChange={handleExtraImages}
                className="hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {initialData ? "Actualizar Producto" : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
