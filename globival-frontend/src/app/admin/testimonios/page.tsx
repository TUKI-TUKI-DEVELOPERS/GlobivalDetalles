"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Search,
  X,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  MessageSquare,
  Calendar,
  Quote,
  User,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  testimonialService,
  extractArray,
  extractObject,
} from "@/services/api";
import { buildImageUrl, validateImageFile } from "@/config/constants";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import type { Testimonial } from "@/types";

const ITEMS_PER_PAGE = 6;
type FilterStatus = "all" | "active" | "inactive";

export default function TestimoniosAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{id: number; name: string} | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialService.getAll();
      setTestimonials(extractArray<Testimonial>(response));
    } catch {
      toast.error("Error al cargar los testimonios");
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const activeCount = testimonials.filter((t) => t.active).length;
  const inactiveCount = testimonials.length - activeCount;

  // Filtered
  const filteredTestimonials = useMemo(() => {
    let result = [...testimonials];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.message.toLowerCase().includes(q),
      );
    }

    if (filterStatus === "active") {
      result = result.filter((t) => t.active);
    } else if (filterStatus === "inactive") {
      result = result.filter((t) => !t.active);
    }

    // newest first
    result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return result;
  }, [testimonials, searchTerm, filterStatus]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE),
  );
  const paginatedTestimonials = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTestimonials.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTestimonials, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Handlers
  const openCreate = () => {
    setFormName("");
    setFormMessage("");
    setFormImage(null);
    setFormImagePreview("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormName("");
    setFormMessage("");
    setFormImage(null);
    setFormImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        e.target.value = "";
        return;
      }
      setFormImage(file);
      setFormImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    if (!formMessage.trim()) {
      toast.error("El mensaje es requerido");
      return;
    }
    if (!editingTestimonial && !formImage) {
      toast.error("La imagen es requerida");
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", formName.trim());
      formData.append("message", formMessage.trim());
      if (formImage) {
        formData.append("image", formImage);
      }

      if (editingTestimonial) {
        formData.append("_method", "PUT");
        const response = await testimonialService.update(editingTestimonial.id, formData);
        const updated = extractObject<Testimonial>(response);
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingTestimonial.id ? updated : t)),
        );
        toast.success("Testimonio actualizado");
      } else {
        const response = await testimonialService.create(formData);
        const created = extractObject<Testimonial>(response);
        setTestimonials((prev) => [created, ...prev]);
        toast.success("Testimonio creado");
      }
      closeModal();
    } catch {
      toast.error(
        editingTestimonial
          ? "Error al actualizar el testimonio"
          : "Error al crear el testimonio",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      await testimonialService.toggleActive(testimonial.id);
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === testimonial.id ? { ...t, active: !t.active } : t,
        ),
      );
      toast.success(
        testimonial.active
          ? "Testimonio desactivado"
          : "Testimonio activado",
      );
    } catch {
      toast.error("Error al cambiar el estado");
    }
  };

  const confirmDeleteTestimonial = async () => {
    if (!deleteTarget) return;
    try {
      await testimonialService.delete(deleteTarget.id);
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success("Testimonio eliminado");
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar el testimonio");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Testimonios
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {testimonials.length} testimonios ·{" "}
              <span className="text-success">{activeCount} activos</span>
              {inactiveCount > 0 && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-muted-foreground">
                    {inactiveCount} inactivos
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={18} />
            Nuevo Testimonio
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
              placeholder="Buscar por nombre o mensaje..."
              aria-label="Buscar"
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
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare
            className="mx-auto text-muted-foreground mb-4"
            size={64}
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron testimonios
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== "all"
              ? "Prueba con otros filtros"
              : "Agrega tu primer testimonio de cliente"}
          </p>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedTestimonials.map((testimonial) => {
              const isExpanded = expandedId === testimonial.id;
              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-5">
                    {/* Author row */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0 ring-2 ring-border">
                        {testimonial.image ? (
                          <Image
                            src={
                              buildImageUrl(testimonial.image) ||
                              "/placeholder.svg"
                            }
                            alt={testimonial.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {testimonial.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              testimonial.active
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {testimonial.active ? (
                              <>
                                <Eye size={10} /> Activo
                              </>
                            ) : (
                              <>
                                <EyeOff size={10} /> Inactivo
                              </>
                            )}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar size={10} />
                            {new Date(
                              testimonial.created_at,
                            ).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="relative mb-4">
                      <Quote
                        size={16}
                        className="absolute -top-1 -left-0.5 text-primary/30"
                      />
                      <p
                        className={`text-muted-foreground text-sm pl-5 leading-relaxed ${
                          !isExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {testimonial.message}
                      </p>
                      {testimonial.message.length > 120 && (
                        <button
                          onClick={() =>
                            setExpandedId(
                              isExpanded ? null : testimonial.id,
                            )
                          }
                          className="text-xs text-primary hover:underline mt-1 pl-5"
                        >
                          {isExpanded ? "Ver menos" : "Ver más"}
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <button
                        onClick={() => handleToggleActive(testimonial)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          testimonial.active
                            ? "bg-muted text-muted-foreground hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                            : "bg-success/10 text-success hover:bg-success/20"
                        }`}
                      >
                        {testimonial.active ? (
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
                        onClick={() => {
                          setEditingTestimonial(testimonial);
                          setFormName(testimonial.name);
                          setFormMessage(testimonial.message);
                          setFormImage(null);
                          setFormImagePreview("");
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Editar"
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: testimonial.id, name: testimonial.name })}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

      {/* Create Modal */}
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
                  {editingTestimonial ? "Editar Testimonio" : "Nuevo Testimonio"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Image upload - prominent */}
                <div className="flex flex-col items-center">
                  {formImagePreview ? (
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                        <Image
                          src={formImagePreview}
                          alt="Preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setFormImage(null);
                            setFormImagePreview("");
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-destructive text-destructive-foreground rounded-full transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                      <Upload size={20} className="text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground">
                        {editingTestimonial ? "Foto" : "Foto *"}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {formImagePreview && (
                    <label className="mt-2 text-xs text-primary cursor-pointer hover:underline">
                      Cambiar foto
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                    Nombre del cliente *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    maxLength={255}
                    className="w-full h-10 px-3 border border-border rounded-lg bg-card text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: María García"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/80">
                    Testimonio *
                  </label>
                  <textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-card text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Escribe lo que dijo el cliente sobre su experiencia..."
                  />
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {formMessage.length} caracteres
                  </p>
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
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? (editingTestimonial ? "Guardando..." : "Creando...")
                      : (editingTestimonial ? "Guardar Cambios" : "Crear Testimonio")}
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
        onConfirm={confirmDeleteTestimonial}
        title="Eliminar testimonio"
        message={`¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
