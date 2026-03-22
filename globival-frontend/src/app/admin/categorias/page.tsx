"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  X,
  FolderTree,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  categoryService,
  extractArray,
  extractObject,
} from "@/services/api";
import CategoryForm from "@/components/admin/CategoryForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import type { Category } from "@/types";

const ITEMS_PER_PAGE = 10;

type SortField = "name" | "subcategories" | "created_at";
type SortDir = "asc" | "desc";

export default function CategoriasAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(
    null,
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{id: number; name: string; hasChildren: boolean; childCount: number} | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(extractArray<Category>(response));
    } catch {
      toast.error("Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  // Filtered + sorted
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.subcategories?.some((s) =>
            s.name.toLowerCase().includes(q),
          ),
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "subcategories":
          cmp =
            (a.subcategories?.length || 0) - (b.subcategories?.length || 0);
          break;
        case "created_at":
          cmp =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [categories, searchTerm, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / ITEMS_PER_PAGE),
  );
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown
      size={14}
      className={`inline ml-1 ${sortField === field ? "text-primary" : "text-muted-foreground"}`}
    />
  );

  const handleAdd = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;
    try {
      await categoryService.delete(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Categoría eliminada correctamente");
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar la categoría");
    }
  };

  const handleSave = async (values: { name: string }) => {
    try {
      if (currentCategory) {
        const response = await categoryService.update(
          currentCategory.id,
          values,
        );
        const updated = extractObject<Category>(response);
        setCategories((prev) =>
          prev.map((c) => (c.id === currentCategory.id ? { ...c, ...updated } : c)),
        );
        toast.success("Categoría actualizada");
      } else {
        const response = await categoryService.create(values);
        const created = extractObject<Category>(response);
        setCategories((prev) => [...prev, { ...created, subcategories: [] }]);
        toast.success("Categoría creada");
      }
      setCurrentCategory(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Error al guardar la categoría");
    }
  };

  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.subcategories?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Categorías
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {categories.length} categorías · {totalSubcategories}{" "}
              subcategorías en total
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={18} />
            Nueva Categoría
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar categorías o subcategorías..."
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
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20">
          <Layers
            className="mx-auto text-muted-foreground mb-4"
            size={64}
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron categorías
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Prueba con otro término de búsqueda"
              : "Crea tu primera categoría"}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="w-10 px-4 py-3" />
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("name")}
                  >
                    Nombre
                    <SortIcon field="name" />
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("subcategories")}
                  >
                    Subcategorías
                    <SortIcon field="subcategories" />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground hidden sm:table-cell"
                    onClick={() => toggleSort("created_at")}
                  >
                    Creada
                    <SortIcon field="created_at" />
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-28">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedCategories.map((category) => {
                  const subs = category.subcategories || [];
                  const isExpanded = expandedId === category.id;

                  return (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <td className="px-4 py-3">
                        {subs.length > 0 && (
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : category.id)
                            }
                            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {category.name}
                        </div>
                        {/* Expanded subcategories */}
                        {isExpanded && subs.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 ml-2 space-y-1"
                          >
                            {subs.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-2 text-sm text-muted-foreground py-1 pl-2 border-l-2 border-border"
                              >
                                <FolderTree size={13} className="shrink-0" />
                                <span>{sub.name}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            subs.length > 0
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Package size={12} />
                          {subs.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {new Date(category.created_at).toLocaleDateString(
                          "es-PE",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Editar"
                            aria-label="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: category.id, name: category.name, hasChildren: (category.subcategories?.length || 0) > 0, childCount: category.subcategories?.length || 0 })}
                            className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Eliminar"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
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

      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentCategory(null);
        }}
        onSubmit={handleSave}
        initialData={currentCategory}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteCategory}
        title="Eliminar categoría"
        message={
          deleteTarget?.hasChildren
            ? `Esta acción eliminará "${deleteTarget?.name}", sus ${deleteTarget?.childCount} subcategoría(s) y TODOS los productos asociados. Esta acción NO se puede deshacer.`
            : `¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`
        }
        variant={deleteTarget?.hasChildren ? "warning" : "danger"}
      />
    </div>
  );
}
