"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,

  ShoppingCart,
  LayoutGrid,
  List,
  Tag,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import {
  categoryService,
  subcategoryService,
  productService,
  extractArray,
} from "@/services/api";
import { toast } from "react-toastify";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { motion, AnimatePresence } from "framer-motion";
import { buildImageUrl, BLUR_DATA_URL, BUSINESS } from "@/config/constants";
import { useCart } from "@/contexts/CartContext";
import type { Product, SubCategory } from "@/types";
import { getSubCategory } from "@/types";
import ProductModal from "@/components/ui/ProductModal";
import EmptyState from "@/components/ui/EmptyState";

interface LocalCategory {
  id: number;
  name: string;
  description?: string;
}

interface LocalSubcategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
}

const cardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [subcategories, setSubcategories] = useState<LocalSubcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("q") || searchParams.get("search") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>(() => {
    const cats = searchParams.get("cats");
    return cats ? cats.split(",").map(Number).filter(Boolean) : [];
  });
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(
    () => {
      const subs = searchParams.get("subs");
      return subs ? subs.split(",").map(Number).filter(Boolean) : [];
    }
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "default"
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    document.title = "Catálogo | Globival Detalles";
  }, []);
  const [showAvailability, setShowAvailability] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const productsPerPage = 12;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Advanced filters
  const [offerOnly, setOfferOnly] = useState(
    searchParams.get("offer") === "1"
  );
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("stock") === "1"
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  // Sync filters to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (sortOption !== "default") params.set("sort", sortOption);
    if (currentPage > 1) params.set("page", String(currentPage));
    if (selectedCategories.length > 0)
      params.set("cats", selectedCategories.join(","));
    if (selectedSubcategories.length > 0)
      params.set("subs", selectedSubcategories.join(","));
    if (offerOnly) params.set("offer", "1");
    if (inStockOnly) params.set("stock", "1");

    const query = params.toString();
    const newUrl = query ? `?${query}` : "/catalogo";
    router.replace(newUrl, { scroll: false });
  }, [
    searchTerm,
    sortOption,
    currentPage,
    selectedCategories,
    selectedSubcategories,
    offerOnly,
    inStockOnly,
    router,
  ]);

  // Load data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [catRes, subRes, prodRes] = await Promise.all([
          categoryService.getAll(),
          subcategoryService.getAll(),
          productService.getAll(),
        ]);
        setCategories(extractArray<LocalCategory>(catRes));
        setSubcategories(
          extractArray<SubCategory>(subRes).map((s) => ({
            id: s.id,
            name: s.name,
            category_id: s.category_id,
          }))
        );
        setProducts(extractArray<Product>(prodRes));
      } catch (error) {
        console.error("Error al cargar catalogo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Price limits
  const [computedMinPrice, computedMaxPrice] = useMemo(() => {
    if (products.length === 0) return [0, 0];
    const prices = products.map((p) =>
      p.precio_de_oferta && p.precio_de_oferta !== ""
        ? Number(p.precio_de_oferta)
        : Number(p.price)
    );
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange(([min, max]) => {
        if (min === 0 && max === 0)
          return [computedMinPrice, computedMaxPrice];
        return [min, max];
      });
    }
  }, [products, computedMinPrice, computedMaxPrice]);

  // Filtering
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0 || selectedSubcategories.length > 0) {
      const subCatsOfSelectedCats =
        selectedCategories.length > 0
          ? subcategories
              .filter((sc) => selectedCategories.includes(sc.category_id))
              .map((sc) => sc.id)
          : [];

      filtered = filtered.filter((product) => {
        const subCatId = product.sub_category_id || getSubCategory(product)?.id;
        return selectedSubcategories.length > 0
          ? selectedSubcategories.includes(subCatId ?? 0)
          : subCatsOfSelectedCats.includes(subCatId ?? 0);
      });
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    if (offerOnly)
      filtered = filtered.filter(
        (p) => p.precio_de_oferta && p.precio_de_oferta !== ""
      );
    if (inStockOnly) filtered = filtered.filter((p) => p.stock > 0);

    if (priceRange[0] !== 0 || priceRange[1] !== 0) {
      filtered = filtered.filter((p) => {
        const price =
          p.precio_de_oferta && p.precio_de_oferta !== ""
            ? Number(p.precio_de_oferta)
            : Number(p.price);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    switch (sortOption) {
      case "price_asc":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    products,
    selectedCategories,
    selectedSubcategories,
    searchTerm,
    sortOption,
    subcategories,
    offerOnly,
    inStockOnly,
    priceRange,
  ]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    if (selectedCategories.includes(categoryId)) {
      const subCatsToRemove = subcategories
        .filter((sc) => sc.category_id === categoryId)
        .map((sc) => sc.id);
      setSelectedSubcategories((prev) =>
        prev.filter((id) => !subCatsToRemove.includes(id))
      );
    }
  };

  const handleSubcategoryChange = (subcategoryId: number) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSearchTerm("");
    setSortOption("default");
    setCurrentPage(1);
    setOfferOnly(false);
    setInStockOnly(false);
    setPriceRange([computedMinPrice, computedMaxPrice]);
  };

  const getSubcategoriesForCategory = (categoryId: number) =>
    subcategories.filter((sc) => sc.category_id === categoryId);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSubcategories.length > 0 ||
    !!searchTerm ||
    offerOnly ||
    inStockOnly ||
    priceRange[0] > computedMinPrice ||
    priceRange[1] < computedMaxPrice;

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const getWhatsAppLink = (product: Product) => {
    const message = `Hola, me gustaria obtener mas informacion sobre el producto "${product.name}" de Globival & Detalles.`;
    return BUSINESS.whatsappUrl(message);
  };

  const handleAddToCart = (product: Product) => {
    cart.addProduct(product);
    toast.success(`${product.name} agregado al carrito`, { autoClose: 2000 });
  };

  const getDiscountPercent = (price: number | string, offerPrice: number | string) => {
    const p = Number(price);
    const o = Number(offerPrice);
    if (p <= 0) return 0;
    return Math.round(((p - o) / p) * 100);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="relative min-h-[calc(100vh-160px)]">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.15),transparent_60%)] opacity-60" />
      </div>

      <div className="relative z-10 py-8 bg-background/80 backdrop-blur-md min-h-[calc(100vh-160px)] mt-6 rounded-t-2xl">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="bg-card p-8 mb-8 rounded-lg shadow-lg border border-border relative overflow-hidden backdrop-blur-xl">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 relative z-10 text-2xl md:text-3xl font-bold"
            >
              Nuestro{" "}
              <span className="text-primary">Catalogo</span> de Productos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground max-w-3xl relative z-10"
            >
              Explora nuestra amplia seleccion de productos, regalos y detalles
              personalizados de alta calidad.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Mobile overlay */}
            <div
              className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden ${isFilterOpen ? "block" : "hidden"}`}
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Sidebar filters */}
            <aside
              className={`bg-card rounded-xl h-fit border border-border relative ${
                isFilterOpen
                  ? "fixed top-0 left-0 right-0 bottom-0 z-50 lg:static lg:z-auto overflow-y-auto"
                  : "hidden lg:block"
              }`}
            >
              {/* Filter header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                  Filtros
                </h2>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary hover:text-primary/70 transition-colors font-medium"
                    >
                      Limpiar todo
                    </button>
                  )}
                  <button
                    className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setIsFilterOpen(false)}
                    aria-label="Cerrar filtros"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5">
              {/* Categories */}
              <div>
                <button
                  className="flex w-full justify-between items-center py-1 cursor-pointer group"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span className="text-sm font-medium text-foreground">
                    Categorías
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {showFilters && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="list-none p-0 mt-2 overflow-hidden space-y-0.5"
                    >
                      {categories.map((category) => {
                        const subs = getSubcategoriesForCategory(category.id);
                        return (
                          <li key={category.id}>
                            <div
                              className={`flex items-center py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-sm ${selectedCategories.includes(category.id) ? "text-primary font-medium bg-primary/5" : "hover:bg-muted"}`}
                            >
                              <input
                                id={`cat-${category.id}`}
                                type="checkbox"
                                checked={selectedCategories.includes(
                                  category.id
                                )}
                                onChange={() =>
                                  handleCategoryChange(category.id)
                                }
                                className="mr-2 accent-primary cursor-pointer"
                              />
                              <label
                                htmlFor={`cat-${category.id}`}
                                onClick={(e) => {
                                  if (subs.length > 0) {
                                    e.preventDefault();
                                    toggleCategoryExpand(category.id);
                                  }
                                }}
                                className="cursor-pointer flex-1"
                              >
                                {category.name}
                              </label>
                              {subs.length > 0 && (
                                <button
                                  type="button"
                                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                                  onClick={() =>
                                    toggleCategoryExpand(category.id)
                                  }
                                  aria-label={expandedCategories[category.id] ? "Colapsar subcategorías" : "Expandir subcategorías"}
                                >
                                  {expandedCategories[category.id] ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                            <AnimatePresence>
                              {expandedCategories[category.id] &&
                                subs.length > 0 && (
                                  <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="list-none pl-6 my-1 overflow-hidden"
                                  >
                                    {subs.map((sub) => (
                                      <li key={sub.id}>
                                        <div
                                          className={`flex items-center py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-sm ${selectedSubcategories.includes(sub.id) ? "text-primary font-medium bg-primary/5" : "hover:bg-muted"}`}
                                        >
                                          <input
                                            id={`subcat-${sub.id}`}
                                            type="checkbox"
                                            checked={selectedSubcategories.includes(
                                              sub.id
                                            )}
                                            onChange={() =>
                                              handleSubcategoryChange(sub.id)
                                            }
                                            className="mr-2 accent-primary cursor-pointer"
                                          />
                                          <label htmlFor={`subcat-${sub.id}`} className="cursor-pointer">
                                            {sub.name}
                                          </label>
                                        </div>
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                            </AnimatePresence>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Availability */}
              <div>
                <button
                  className="flex w-full justify-between items-center py-1 cursor-pointer group"
                  onClick={() => setShowAvailability(!showAvailability)}
                >
                  <span className="text-sm font-medium text-foreground">
                    Disponibilidad
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground ${showAvailability ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {showAvailability && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="list-none p-0 mt-2 overflow-hidden space-y-0.5"
                    >
                      <li>
                        <div
                          className={`flex items-center py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-sm ${offerOnly ? "text-primary font-medium bg-primary/5" : "hover:bg-muted"}`}
                          onClick={() => setOfferOnly(!offerOnly)}
                        >
                          <input
                            id="filter-offer-only"
                            type="checkbox"
                            checked={offerOnly}
                            onChange={(e) => setOfferOnly(e.target.checked)}
                            className="mr-2 accent-primary"
                          />
                          <label htmlFor="filter-offer-only" className="cursor-pointer flex items-center gap-2">
                            <Tag className="w-3 h-3" /> Solo en oferta
                          </label>
                        </div>
                      </li>
                      <li>
                        <div
                          className={`flex items-center py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-sm ${inStockOnly ? "text-primary font-medium bg-primary/5" : "hover:bg-muted"}`}
                          onClick={() => setInStockOnly(!inStockOnly)}
                        >
                          <input
                            id="filter-in-stock"
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                            className="mr-2 accent-primary"
                          />
                          <label htmlFor="filter-in-stock" className="cursor-pointer flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> Solo con stock
                          </label>
                        </div>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Price */}
              <div>
                <button
                  className="flex w-full justify-between items-center py-1 cursor-pointer group"
                  onClick={() => setShowPrice(!showPrice)}
                >
                  <span className="text-sm font-medium text-foreground">
                    Precio
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground ${showPrice ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {showPrice && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="price-min" className="block text-xs text-muted-foreground mb-1">
                            Mínimo
                          </label>
                          <input
                            id="price-min"
                            type="number"
                            min={computedMinPrice}
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setPriceRange([
                                Math.max(
                                  computedMinPrice,
                                  Math.min(v, priceRange[1])
                                ),
                                priceRange[1],
                              ]);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="price-max" className="block text-xs text-muted-foreground mb-1">
                            Máximo
                          </label>
                          <input
                            id="price-max"
                            type="number"
                            min={priceRange[0]}
                            max={computedMaxPrice}
                            value={priceRange[1]}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setPriceRange([
                                priceRange[0],
                                Math.min(
                                  computedMaxPrice,
                                  Math.max(v, priceRange[0])
                                ),
                              ]);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-sm"
                          />
                        </div>
                      </div>
                      <button
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={() =>
                          setPriceRange([computedMinPrice, computedMaxPrice])
                        }
                      >
                        <DollarSign className="w-3 h-3" /> Restablecer precio
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </div>
            </aside>

            {/* Main content */}
            <div>
              {/* Toolbar */}
              <div className="flex flex-col gap-3 mb-4">
                {/* Top bar: filter button + search + sort + view toggle */}
                <div className="flex items-center gap-2">
                  <button
                    className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground flex-shrink-0"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Filter className="w-4 h-4" /> Filtros
                  </button>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card flex-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:border-primary transition-colors">
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm"
                      aria-label="Buscar productos por nombre"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground flex-shrink-0"
                        aria-label="Limpiar búsqueda"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="hidden sm:block px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground flex-shrink-0"
                    aria-label="Ordenar productos"
                  >
                    <option value="default">Ordenar</option>
                    <option value="price_asc">Menor precio</option>
                    <option value="price_desc">Mayor precio</option>
                    <option value="name_asc">A-Z</option>
                    <option value="name_desc">Z-A</option>
                  </select>

                  <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                      aria-label="Vista mosaico"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                      aria-label="Vista lista"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info bar: result count + active filters */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredProducts.length}</span> productos
                    {hasActiveFilters && " encontrados"}
                  </p>
                  {hasActiveFilters && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {searchTerm && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          &quot;{searchTerm}&quot;
                          <button onClick={() => setSearchTerm("")} className="hover:text-primary/70" aria-label="Quitar filtro de búsqueda">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedCategories.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {selectedCategories.length} categoría{selectedCategories.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {offerOnly && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          Ofertas
                        </span>
                      )}
                      <button
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
                      <div className="aspect-[4/5] bg-muted animate-pulse" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-full bg-muted animate-pulse rounded" />
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-9 w-full bg-muted animate-pulse rounded-lg mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {paginatedProducts.map((product) => {
                        const hasOffer =
                          product.precio_de_oferta !== null &&
                          product.precio_de_oferta !== "";
                        return (
                          <motion.div
                            key={product.id}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 h-full group cursor-pointer"
                          >
                            {/* Image section */}
                            <Link href={`/producto/${product.id}`} className="block relative">
                              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                                <Image
                                  src={buildImageUrl(product.imagen)}
                                  alt={product.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  placeholder="blur"
                                  blurDataURL={BLUR_DATA_URL}
                                />
                                {/* Discount badge */}
                                {hasOffer && (
                                  <div className="absolute top-2.5 left-2.5 bg-destructive text-destructive-foreground text-xs font-bold py-1 px-2.5 rounded-full z-10">
                                    -{getDiscountPercent(product.price, product.precio_de_oferta!)}%
                                  </div>
                                )}
                                {/* Quick view button - visible on hover */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openModal(product);
                                  }}
                                  className="absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-foreground/70 opacity-0 group-hover:opacity-100 transition-all hover:bg-card hover:text-primary z-10"
                                  aria-label="Vista rápida"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </Link>

                            {/* Content */}
                            <div className="p-4">
                              <Link href={`/producto/${product.id}`} className="block">
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                                  {getSubCategory(product)?.name || "General"}
                                </p>
                                <h3 className="text-sm font-semibold mb-2 line-clamp-2 transition-colors group-hover:text-primary leading-snug">
                                  {product.name}
                                </h3>
                              </Link>

                              {/* Price */}
                              <div className="flex items-baseline gap-2 mb-3">
                                {hasOffer ? (
                                  <>
                                    <span className="text-base font-bold text-foreground">
                                      S/ {product.precio_de_oferta}
                                    </span>
                                    <span className="text-xs text-muted-foreground line-through">
                                      S/ {product.price}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-base font-bold text-foreground">
                                    S/ {product.price}
                                  </span>
                                )}
                              </div>

                              {/* Action buttons - always visible */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground py-2 text-xs font-medium transition-all hover:bg-primary/90 active:scale-[0.97]"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  Agregar
                                </button>
                                <a
                                  href={getWhatsAppLink(product)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-whatsapp/10 text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
                                  aria-label="Consultar por WhatsApp"
                                >
                                  <WhatsAppIcon className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {viewMode === "list" && (
                    <div className="space-y-4">
                      {paginatedProducts.map((product) => {
                        const hasOffer =
                          product.precio_de_oferta !== null &&
                          product.precio_de_oferta !== "";
                        return (
                          <motion.div
                            key={product.id}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 p-4 flex gap-4 group"
                          >
                            <Link
                              href={`/producto/${product.id}`}
                              className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-muted rounded-lg overflow-hidden"
                            >
                              <Image
                                src={buildImageUrl(product.imagen)}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="144px"
                                placeholder="blur"
                                blurDataURL={BLUR_DATA_URL}
                              />
                              {hasOffer && (
                                <div className="absolute top-1.5 left-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold py-0.5 px-1.5 rounded-full">
                                  -{getDiscountPercent(product.price, product.precio_de_oferta!)}%
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                  {getSubCategory(product)?.name || "General"}
                                </p>
                                <Link href={`/producto/${product.id}`}>
                                  <h3 className="text-sm font-semibold mt-0.5 transition-colors group-hover:text-primary line-clamp-2">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block">
                                  {product.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-2 gap-2">
                                <div className="flex items-baseline gap-2">
                                  {hasOffer ? (
                                    <>
                                      <span className="text-base font-bold text-foreground">
                                        S/ {product.precio_de_oferta}
                                      </span>
                                      <span className="text-xs text-muted-foreground line-through">
                                        S/ {product.price}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-base font-bold text-foreground">
                                      S/ {product.price}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => openModal(product)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    aria-label="Vista rápida"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-medium transition-all hover:bg-primary/90 active:scale-[0.97]"
                                  >
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Agregar</span>
                                  </button>
                                  <a
                                    href={getWhatsAppLink(product)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-whatsapp/10 text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
                                    aria-label="WhatsApp"
                                  >
                                    <WhatsAppIcon className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-full border border-border bg-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors text-sm"
                      >
                        Anterior
                      </button>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                            currentPage === index + 1
                              ? "bg-primary text-white border-primary"
                              : "border border-border bg-card hover:bg-muted"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-full border border-border bg-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors text-sm"
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-card border border-border rounded-lg">
                  <EmptyState
                    icon={Search}
                    title="No se encontraron productos"
                    description="Intenta con otros filtros o términos de búsqueda"
                    action={
                      hasActiveFilters ? (
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 rounded-md border border-dashed border-primary text-primary hover:bg-primary hover:text-white transition-colors active:scale-[0.98]"
                        >
                          Limpiar todos los filtros
                        </button>
                      ) : undefined
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CatalogoContent />
    </Suspense>
  );
}
