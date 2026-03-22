"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Upload,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import { bannerService, extractArray, extractObject } from "@/services/api";
import { buildImageUrl, validateImageFile } from "@/config/constants";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import type { Banner } from "@/types";

const ITEMS_PER_PAGE = 6;

type FilterStatus = "all" | "active" | "inactive";

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{id: number; name: string} | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerService.getAll();
      setBanners(extractArray<Banner>(response));
    } catch {
      toast.error("Error al cargar los banners");
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const activeCount = banners.filter((b) => b.active).length;
  const inactiveCount = banners.length - activeCount;

  // Filtered
  const filteredBanners = useMemo(() => {
    let result = [...banners];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((b) =>
        b.title?.toLowerCase().includes(q),
      );
    }

    if (filterStatus === "active") {
      result = result.filter((b) => b.active);
    } else if (filterStatus === "inactive") {
      result = result.filter((b) => !b.active);
    }

    // newest first
    result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return result;
  }, [banners, searchTerm, filterStatus]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBanners.length / ITEMS_PER_PAGE),
  );
  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBanners.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBanners, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Handlers
  const openCreate = () => {
    setEditingBanner(null);
    setFormTitle("");
    setFormActive(true);
    setFormImage(null);
    setFormImagePreview("");
    setIsDragging(false);
    setIsModalOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormTitle(banner.title || "");
    setFormActive(banner.active);
    setFormImage(null);
    setFormImagePreview(buildImageUrl(banner.image));
    setIsDragging(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setFormTitle("");
    setFormActive(true);
    setFormImage(null);
    setFormImagePreview("");
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setFormImage(file);
    setFormImagePreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    } else {
      toast.error("Solo se permiten archivos de imagen");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner && !formImage) {
      toast.error("La imagen es requerida para crear un banner");
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (formTitle.trim()) formData.append("title", formTitle.trim());
      formData.append("active", formActive ? "1" : "0");
      if (formImage) formData.append("image", formImage);

      if (editingBanner) {
        const response = await bannerService.update(
          editingBanner.id,
          formData,
        );
        const updated = extractObject<Banner>(response);
        setBanners((prev) =>
          prev.map((b) => (b.id === editingBanner.id ? { ...b, ...updated } : b)),
        );
        toast.success("Banner actualizado");
      } else {
        const response = await bannerService.create(formData);
        const created = extractObject<Banner>(response);
        setBanners((prev) => [created, ...prev]);
        toast.success("Banner creado");
      }
      closeModal();
    } catch {
      toast.error(
        editingBanner
          ? "Error al actualizar el banner"
          : "Error al crear el banner",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await bannerService.toggleActive(banner.id);
      setBanners((prev) =>
        prev.map((b) =>
          b.id === banner.id ? { ...b, active: !b.active } : b,
        ),
      );
      toast.success(
        banner.active ? "Banner desactivado" : "Banner activado",
      );
    } catch {
      toast.error("Error al cambiar el estado");
    }
  };

  const confirmDeleteBanner = async () => {
    if (!deleteTarget) return;
    try {
      await bannerService.delete(deleteTarget.id);
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      toast.success("Banner eliminado");
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar el banner");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Banners
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {banners.length} banners ·{" "}
              <span className="text-success">{activeCount} activos</span>
              {inactiveCount > 0 && (
                <>
                  {" "}
                  · <span className="text-muted-foreground">{inactiveCount} inactivos</span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={18} />
            Nuevo Banner
          </button>
        </div>

        {/* Search + Status filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-card text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            {(
              [
                { value: "all", label: "Todos" },
                { value: "active", label: "Activos" },
                { value: "inactive", label: "Inactivos" },
              ] as { value: FilterStatus; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-4 py-2 font-medium transition-colors ${
                  filterStatus === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon
            className="mx-auto text-muted-foreground mb-4"
            size={64}
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron banners
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== "all"
              ? "Prueba con otros filtros"
              : "Agrega tu primer banner promocional"}
          </p>
        </div>
      ) : (
        <>
          {/* Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedBanners.map((banner) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl shadow-sm overflow-hidden group"
              >
                {/* Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <Image
                    src={buildImageUrl(banner.image) || "/placeholder.svg"}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  {/* Status badge */}
                  <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      banner.active
                        ? "bg-success text-success-foreground"
                        : "bg-foreground/70 text-muted"
                    }`}
                  >
                    {banner.active ? (
                      <>
                        <Eye size={12} /> Activo
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Inactivo
                      </>
                    )}
                  </span>
                </div>

                {/* Info + Actions */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate text-sm">
                        {banner.title || "Sin título"}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Calendar size={11} />
                        {new Date(banner.created_at).toLocaleDateString(
                          "es-PE",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        banner.active
                          ? "bg-muted text-muted-foreground hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                          : "bg-success/10 text-success hover:bg-success/20"
                      }`}
                    >
                      {banner.active ? (
                        <>
                          <EyeOff size={14} /> Desactivar
                        </>
                      ) : (
                        <>
                          <Eye size={14} /> Activar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(banner)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: banner.id, name: banner.title || "Sin título" })}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) =>
              e.target === e.currentTarget && closeModal()
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingBanner ? "Editar Banner" : "Nuevo Banner"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Image - prominent, first */}
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-foreground/80">
                    <span>
                      Imagen del banner{" "}
                      {!editingBanner && (
                        <span className="text-destructive">*</span>
                      )}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      Recomendado: 1920×680px
                    </span>
                  </label>

                  {formImagePreview ? (
                    <div className="relative aspect-[16/6] rounded-lg overflow-hidden border border-border group">
                      <Image
                        src={formImagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 512px) 100vw, 512px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3">
                        <label className="opacity-0 group-hover:opacity-100 cursor-pointer px-3 py-2 bg-white/90 rounded-lg text-sm font-medium text-foreground hover:bg-white transition-all flex items-center gap-1.5 shadow-sm">
                          <Upload size={14} />
                          Cambiar
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormImage(null);
                            setFormImagePreview("");
                          }}
                          className="opacity-0 group-hover:opacity-100 px-3 py-2 bg-destructive/90 rounded-lg text-sm font-medium text-white hover:bg-destructive transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Trash2 size={14} />
                          Quitar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`flex flex-col items-center justify-center w-full aspect-[16/6] border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[1.01]"
                          : "border-border hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <Upload
                        className={`mb-2 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                        size={36}
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        {isDragging
                          ? "Suelta la imagen aquí"
                          : "Arrastra una imagen o haz click para subir"}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, WebP, SVG, GIF · Máx 4MB
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                    Título{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      opcional — se muestra como texto en el carrusel
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    maxLength={255}
                    className="w-full h-10 px-3 border border-border rounded-lg bg-card text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Promoción Día de la Madre"
                  />
                  {formTitle.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground text-right">
                      {formTitle.length}/255
                    </p>
                  )}
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground/80">
                      Visible en la tienda
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formActive
                        ? "El banner se mostrará en el carrusel de inicio"
                        : "El banner estará oculto para los clientes"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormActive(!formActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      formActive
                        ? "bg-success"
                        : "bg-muted-foreground/40"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        formActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? editingBanner
                        ? "Actualizando..."
                        : "Creando..."
                      : editingBanner
                        ? "Actualizar Banner"
                        : "Crear Banner"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteBanner}
        title="Eliminar banner"
        message={`¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
