"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  Printer,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  productService,
  subcategoryService,
  categoryService,
  extractArray,
  extractObject,
} from "@/services/api";
import { buildImageUrl } from "@/config/constants";
import Image from "next/image";
import ProductoForm from "@/components/admin/ProductoForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useTicketPrint } from "@/components/admin/TicketPrint";
import type { Product, SubCategory, Category } from "@/types";
import { getSubCategory } from "@/types";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

type SortField = "name" | "price" | "stock" | "created_at";
type SortDir = "asc" | "desc";

export default function ProductosAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{id: number; name: string} | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const printTicket = useTicketPrint();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "">("");
  const [filterSubcategory, setFilterSubcategory] = useState<number | "">("");
  const [filterStock, setFilterStock] = useState<"all" | "instock" | "out">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);

  // Sort
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, subcategoriesRes, categoriesRes] = await Promise.all([
        productService.getAll(),
        subcategoryService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(extractArray<Product>(productsRes));
      setSubcategories(extractArray<SubCategory>(subcategoriesRes));
      setCategories(extractArray<Category>(categoriesRes));
    } catch {
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  // Subcategories filtered by selected category
  const filteredSubcategoriesForSelect = useMemo(() => {
    if (!filterCategory) return subcategories;
    return subcategories.filter((s) => s.category_id === filterCategory);
  }, [subcategories, filterCategory]);

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.SKU?.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (filterCategory) {
      result = result.filter(
        (p) => getSubCategory(p)?.category?.id === filterCategory,
      );
    }

    // Subcategory filter
    if (filterSubcategory) {
      result = result.filter((p) => p.sub_category_id === filterSubcategory);
    }

    // Stock filter
    if (filterStock === "instock") {
      result = result.filter((p) => p.stock > 0);
    } else if (filterStock === "out") {
      result = result.filter((p) => p.stock === 0);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = Number(a.price) - Number(b.price);
          break;
        case "stock":
          cmp = a.stock - b.stock;
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
    products,
    searchTerm,
    filterCategory,
    filterSubcategory,
    filterStock,
    sortField,
    sortDir,
  ]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const handlePrintSelected = () => {
    const selected = products.filter((p) => selectedProducts.has(p.id));
    if (selected.length === 0) return;
    printTicket(selected);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedProducts(new Set());
  }, [searchTerm, filterCategory, filterSubcategory, filterStock, itemsPerPage]);

  const activeFilterCount = [
    filterCategory,
    filterSubcategory,
    filterStock !== "all" ? filterStock : "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterSubcategory("");
    setFilterStock("all");
  };

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

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await productService.delete(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Producto eliminado correctamente");
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar el producto");
    }
  };

  const handleSaveProduct = async (formData: FormData) => {
    if (isOperationInProgress) return;
    try {
      setIsOperationInProgress(true);
      if (currentProduct) {
        const response = await productService.update(
          currentProduct.id,
          formData,
        );
        const updated = extractObject<Product>(response);
        setProducts((prev) =>
          prev.map((p) => (p.id === currentProduct.id ? updated : p)),
        );
        toast.success("Producto actualizado correctamente");
      } else {
        const response = await productService.create(formData);
        const created = extractObject<Product>(response);
        setProducts((prev) => [...prev, created]);
        toast.success("Producto creado correctamente");
      }
      setCurrentProduct(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Error al guardar el producto");
    } finally {
      setIsOperationInProgress(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Productos
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredProducts.length} de {products.length} productos
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedProducts.size > 0 && (
              <button
                onClick={handlePrintSelected}
                className="flex items-center gap-2 px-4 py-2.5 bg-info text-info-foreground rounded-lg hover:bg-info/90 transition-colors shadow-sm font-medium text-sm"
              >
                <Printer size={18} />
                Imprimir ({selectedProducts.size})
              </button>
            )}
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
            >
              <Plus size={18} />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Search + Filter toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o SKU..."
              aria-label="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-card text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground/80 hover:bg-muted"
            }`}
          >
            <Filter size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 grid gap-3 sm:grid-cols-3 rounded-lg border border-border bg-card p-4"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Categoría
              </label>
              <select
                aria-label="Filtrar por categoría"
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(
                    e.target.value ? Number(e.target.value) : "",
                  );
                  setFilterSubcategory("");
                }}
                className="w-full h-9 rounded-lg border border-border bg-card text-sm text-foreground px-2"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Subcategoría
              </label>
              <select
                aria-label="Filtrar por subcategoría"
                value={filterSubcategory}
                onChange={(e) =>
                  setFilterSubcategory(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="w-full h-9 rounded-lg border border-border bg-card text-sm text-foreground px-2"
              >
                <option value="">Todas</option>
                {filteredSubcategoriesForSelect.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Stock
              </label>
              <select
                aria-label="Filtrar por stock"
                value={filterStock}
                onChange={(e) =>
                  setFilterStock(e.target.value as "all" | "instock" | "out")
                }
                className="w-full h-9 rounded-lg border border-border bg-card text-sm text-foreground px-2"
              >
                <option value="all">Todos</option>
                <option value="instock">En stock</option>
                <option value="out">Agotados</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <div className="sm:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <Package
            className="mx-auto text-muted-foreground mb-4"
            size={64}
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || activeFilterCount > 0
              ? "Prueba con otros filtros o términos de búsqueda"
              : "Agrega tu primer producto"}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="accent-primary cursor-pointer"
                        aria-label="Seleccionar todos"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-16">
                      Img
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("name")}
                    >
                      Producto
                      <SortIcon field="name" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Categoría
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("price")}
                    >
                      Precio
                      <SortIcon field="price" />
                    </th>
                    <th
                      className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("stock")}
                    >
                      Stock
                      <SortIcon field="stock" />
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-24">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-muted/30 transition-colors ${selectedProducts.has(product.id) ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="accent-primary cursor-pointer"
                          aria-label={`Seleccionar ${product.name}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={
                              buildImageUrl(product.imagen) ||
                              "/placeholder.svg"
                            }
                            alt={product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground text-sm">
                          {product.name}
                        </div>
                        {product.SKU && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {product.SKU}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-muted-foreground">
                          {getSubCategory(product)?.category?.name}
                        </div>
                        <div className="text-sm text-foreground/80">
                          {getSubCategory(product)?.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {product.precio_de_oferta ? (
                          <div>
                            <div className="line-through text-muted-foreground text-xs">
                              S/ {product.price}
                            </div>
                            <div className="font-semibold text-success text-sm">
                              S/ {product.precio_de_oferta}
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium text-foreground text-sm">
                            S/ {product.price}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            product.stock > 0
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => printTicket([product])}
                            className="p-2.5 text-muted-foreground hover:text-info hover:bg-info/10 rounded-lg transition-colors"
                            title="Imprimir ticket"
                            aria-label="Imprimir ticket"
                          >
                            <Printer size={15} />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Editar"
                            aria-label="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                            className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Eliminar"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={
                        buildImageUrl(product.imagen) || "/placeholder.svg"
                      }
                      alt={product.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {getSubCategory(product)?.category?.name} /{" "}
                      {getSubCategory(product)?.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {product.precio_de_oferta ? (
                        <>
                          <span className="line-through text-muted-foreground text-xs">
                            S/ {product.price}
                          </span>
                          <span className="font-semibold text-success text-sm">
                            S/ {product.precio_de_oferta}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-foreground text-sm">
                          S/ {product.price}
                        </span>
                      )}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          product.stock > 0
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Mostrar</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="h-8 rounded-md border border-border bg-card px-2 text-sm"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>por página</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, i, arr) => {
                  const showEllipsis =
                    i > 0 && page - arr[i - 1] > 1;
                  return (
                    <span key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-1 text-muted-foreground">…</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 min-w-8 rounded-lg px-2.5 text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  );
                })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="text-muted-foreground text-xs">
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de{" "}
              {filteredProducts.length}
            </div>
          </div>
        </>
      )}

      <ProductoForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProduct(null);
        }}
        onSubmit={handleSaveProduct}
        initialData={currentProduct}
        subcategories={subcategories}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteProduct}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
