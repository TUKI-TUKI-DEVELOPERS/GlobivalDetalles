"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  FolderTree,
  ArrowUpDown,
  X,
  Package,
  Layers,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  subcategoryService,
  categoryService,
  productService,
  featuredCategoryService,
  extractArray,
  extractObject,
} from "@/services/api";
import SubcategoryForm from "@/components/admin/SubcategoryForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import type { SubCategory, Category, Product } from "@/types";

const ITEMS_PER_PAGE = 10;

type SortField = "name" | "category" | "products" | "created_at";
type SortDir = "asc" | "desc";

export default function SubcategoriasAdminPage() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<number, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] =
    useState<SubCategory | null>(null);
  const [featuredId, setFeaturedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{id: number; name: string; hasProducts: boolean; productCount: number} | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState<number | "">("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, catsRes, prodsRes, featuredRes] = await Promise.all([
        subcategoryService.getAll(),
        categoryService.getAll(),
        productService.getAll(),
        featuredCategoryService.get(),
      ]);
      const subs = extractArray<SubCategory>(subsRes);
      const cats = extractArray<Category>(catsRes);
      const prods = extractArray<Product>(prodsRes);

      // Featured subcategory
      const featuredData = featuredRes.data?.data || featuredRes.data;
      setFeaturedId(featuredData?.subcategory_id || null);

      // Count products per subcategory
      const counts: Record<number, number> = {};
      for (const p of prods) {
        counts[p.sub_category_id] = (counts[p.sub_category_id] || 0) + 1;
      }

      setSubcategories(subs);
      setCategories(cats);
      setProductCounts(counts);
    } catch {
      toast.error("Error al cargar las subcategorías");
    } finally {
      setLoading(false);
    }
  };

  // Filtered + sorted
  const filteredSubcategories = useMemo(() => {
    let result = [...subcategories];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category?.name?.toLowerCase().includes(q),
      );
    }

    if (filterCategoryId) {
      result = result.filter((s) => s.category_id === filterCategoryId);
    }

    result.sort((a, b) => {
      // Featured always first
      if (featuredId) {
        if (a.id === featuredId) return -1;
        if (b.id === featuredId) return 1;
      }
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "category":
          cmp = (a.category?.name || "").localeCompare(
            b.category?.name || "",
          );
          break;
        case "products":
          cmp =
            (productCounts[a.id] || 0) - (productCounts[b.id] || 0);
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
  }, [
    subcategories,
    searchTerm,
    filterCategoryId,
    sortField,
    sortDir,
    productCounts,
    featuredId,
  ]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubcategories.length / ITEMS_PER_PAGE),
  );
  const paginatedSubcategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubcategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubcategories, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategoryId]);

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

  const handleToggleFeatured = async (sub: SubCategory) => {
    const newId = featuredId === sub.id ? null : sub.id;
    try {
      await featuredCategoryService.update(newId);
      setFeaturedId(newId);
      toast.success(
        newId
          ? `"${sub.name}" es ahora la subcategoría destacada`
          : "Se quitó la subcategoría destacada",
      );
    } catch {
      toast.error("Error al actualizar la subcategoría destacada");
    }
  };

  const handleAdd = () => {
    setCurrentSubcategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sub: SubCategory) => {
    setCurrentSubcategory(sub);
    setIsModalOpen(true);
  };

  const confirmDeleteSubcategory = async () => {
    if (!deleteTarget) return;
    try {
      await subcategoryService.delete(deleteTarget.id);
      setSubcategories((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success("Subcategoría eliminada correctamente");
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar la subcategoría");
    }
  };

  const handleSave = async (values: {
    name: string;
    categoryId: number;
  }) => {
    try {
      if (currentSubcategory) {
        const response = await subcategoryService.update(
          currentSubcategory.id,
          values,
        );
        const updated = extractObject<SubCategory>(response);
        setSubcategories((prev) =>
          prev.map((s) =>
            s.id === currentSubcategory.id ? { ...s, ...updated } : s,
          ),
        );
        toast.success("Subcategoría actualizada");
      } else {
        const response = await subcategoryService.create(values);
        const created = extractObject<SubCategory>(response);
        setSubcategories((prev) => [...prev, created]);
        toast.success("Subcategoría creada");
      }
      setCurrentSubcategory(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Error al guardar la subcategoría");
    }
  };

  const totalProducts = Object.values(productCounts).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Subcategorías
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {subcategories.length} subcategorías · {totalProducts} productos
              {featuredId && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-amber-500">
                    ★ {subcategories.find((s) => s.id === featuredId)?.name || "Destacada"}
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={18} />
            Nueva Subcategoría
          </button>
        </div>

        {/* Search + Category filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
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
          <select
            aria-label="Filtrar por categoría"
            value={filterCategoryId}
            onChange={(e) =>
              setFilterCategoryId(
                e.target.value ? Number(e.target.value) : "",
              )
            }
            className="h-[42px] sm:w-64 rounded-lg border border-border bg-card text-sm text-foreground px-3 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {(searchTerm || filterCategoryId) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategoryId("");
              }}
              className="text-xs text-primary hover:underline self-center"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredSubcategories.length === 0 ? (
        <div className="text-center py-20">
          <FolderTree
            className="mx-auto text-muted-foreground mb-4"
            size={64}
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron subcategorías
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterCategoryId
              ? "Prueba con otros filtros"
              : "Crea tu primera subcategoría"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("name")}
                  >
                    Subcategoría
                    <SortIcon field="name" />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("category")}
                  >
                    Categoría padre
                    <SortIcon field="category" />
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("products")}
                  >
                    Productos
                    <SortIcon field="products" />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
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
                {paginatedSubcategories.map((sub) => {
                  const prodCount = productCounts[sub.id] || 0;
                  return (
                    <motion.tr
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFeatured(sub)}
                            className={`p-0.5 rounded transition-colors shrink-0 ${
                              featuredId === sub.id
                                ? "text-amber-500"
                                : "text-muted-foreground hover:text-amber-400"
                            }`}
                            title={
                              featuredId === sub.id
                                ? "Quitar destacada"
                                : "Marcar como destacada"
                            }
                          >
                            <Star
                              size={16}
                              fill={featuredId === sub.id ? "currentColor" : "none"}
                            />
                          </button>
                          <span className="font-medium text-foreground text-sm">
                            {sub.name}
                          </span>
                          {featuredId === sub.id && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                              DESTACADA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                          <Layers size={12} />
                          {sub.category?.name || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            prodCount > 0
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Package size={12} />
                          {prodCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Editar"
                            aria-label="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: sub.id, name: sub.name, hasProducts: (productCounts[sub.id] || 0) > 0, productCount: productCounts[sub.id] || 0 })}
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

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paginatedSubcategories.map((sub) => {
              const prodCount = productCounts[sub.id] || 0;
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => handleToggleFeatured(sub)}
                          className={`p-0.5 rounded transition-colors shrink-0 ${
                            featuredId === sub.id
                              ? "text-amber-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Star
                            size={15}
                            fill={featuredId === sub.id ? "currentColor" : "none"}
                          />
                        </button>
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {sub.name}
                        </h3>
                        {featuredId === sub.id && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 shrink-0">
                            DESTACADA
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        <Layers size={11} />
                        {sub.category?.name}
                      </span>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package size={12} />
                          {prodCount} producto{prodCount !== 1 ? "s" : ""}
                        </span>
                        <span>
                          {new Date(sub.created_at).toLocaleDateString(
                            "es-PE",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: sub.id, name: sub.name, hasProducts: (productCounts[sub.id] || 0) > 0, productCount: productCounts[sub.id] || 0 })}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
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

      <SubcategoryForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentSubcategory(null);
        }}
        onSubmit={handleSave}
        initialData={currentSubcategory}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteSubcategory}
        title="Eliminar subcategoría"
        message={
          deleteTarget?.hasProducts
            ? `Esta acción eliminará "${deleteTarget?.name}" y sus ${deleteTarget?.productCount} producto(s) asociados. Esta acción NO se puede deshacer.`
            : `¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`
        }
        variant={deleteTarget?.hasProducts ? "warning" : "danger"}
      />
    </div>
  );
}
