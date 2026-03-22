"use client";

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ShoppingBag, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import { buildImageUrl } from "@/config/constants";
import { productService, extractArray } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/social", label: "Social" },
  { href: "/contacto", label: "Contacto" },
  { href: "/acerca-de", label: "Quiénes Somos" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const cart = useCart();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (searchResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveSearchIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveSearchIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeSearchIndex >= 0 && searchResults[activeSearchIndex]) {
            const product = searchResults[activeSearchIndex];
            router.push(`/producto/${product.id}`);
            setSearchResults([]);
            setSearchQuery("");
            setSearchOpen(false);
            setActiveSearchIndex(-1);
          }
          break;
        case "Escape":
          setSearchResults([]);
          setActiveSearchIndex(-1);
          break;
      }
    },
    [searchResults, activeSearchIndex, router]
  );

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await productService.getAll();
        const products: Product[] = extractArray<Product>(response);
        const filtered = products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        );
        setSearchResults(filtered.slice(0, 6));
        setActiveSearchIndex(-1);
      } catch {
        setSearchResults([]);
        setActiveSearchIndex(-1);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  return (
    <header className={`sticky top-0 w-full border-b border-border/40 ${mobileMenuOpen ? 'z-50 bg-background' : 'z-40 bg-background/80 backdrop-blur-lg'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground ${
                pathname === link.href
                  ? "bg-accent text-foreground"
                  : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            {/* Desktop search input */}
            <div className="relative hidden lg:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                role="combobox"
                aria-label="Buscar productos"
                aria-expanded={searchResults.length > 0}
                aria-controls="search-results-list"
                aria-activedescendant={activeSearchIndex >= 0 ? `search-result-${activeSearchIndex}` : undefined}
                aria-autocomplete="list"
                className="h-9 w-56 rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none lg:w-64 xl:w-72"
              />
            </div>

            {/* Mobile search input */}
            {searchOpen && (
              <div className="absolute right-0 top-12 w-72 rounded-lg border border-border bg-background p-2 shadow-lg lg:hidden">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    role="combobox"
                    aria-label="Buscar productos"
                    aria-expanded={searchResults.length > 0}
                    aria-controls="search-results-list"
                    aria-activedescendant={activeSearchIndex >= 0 ? `search-result-${activeSearchIndex}` : undefined}
                    aria-autocomplete="list"
                    className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Search autocomplete dropdown */}
            {searchResults.length > 0 && (
              <ul
                id="search-results-list"
                role="listbox"
                aria-label="Resultados de búsqueda"
                className="absolute right-0 top-12 w-80 rounded-lg border border-border bg-background shadow-xl lg:left-0 lg:right-auto lg:top-11"
              >
                {searchResults.map((product, index) => (
                  <li
                    key={product.id}
                    id={`search-result-${index}`}
                    role="option"
                    aria-selected={index === activeSearchIndex}
                  >
                    <Link
                      href={`/producto/${product.id}`}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent ${
                        index === activeSearchIndex ? "bg-accent" : ""
                      }`}
                      onClick={() => {
                        setSearchResults([]);
                        setSearchQuery("");
                        setSearchOpen(false);
                        setActiveSearchIndex(-1);
                      }}
                      tabIndex={-1}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={buildImageUrl(product.imagen)}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          S/ {product.precio_de_oferta || product.price}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {isSearching && searchQuery.length >= 2 && (
              <div className="absolute right-0 top-12 w-80 rounded-lg border border-border bg-background p-4 text-center text-sm text-muted-foreground shadow-xl lg:left-0 lg:right-auto lg:top-11">
                Buscando...
              </div>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={cart.toggle}
            className="relative rounded-lg p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Carrito"
          >
            <ShoppingBag size={20} />
            {cart.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cart.count > 99 ? "99+" : cart.count}
              </span>
            )}
          </button>

          {/* Login / Admin */}
          <Link
            href="/login"
            className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Iniciar sesión"
          >
            <UserCircle size={20} />
          </Link>

          {/* Theme toggle */}
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-border bg-background lg:hidden"
          style={{ backgroundColor: 'var(--background)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <nav className="flex flex-col gap-1 p-4" aria-label="Navegación principal móvil">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                cart.open();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              <ShoppingBag size={20} />
              Carrito {cart.count > 0 && `(${cart.count})`}
            </button>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              <UserCircle size={20} />
              Iniciar Sesión
            </Link>
            <div className="my-2 border-t border-border" />
            <div className="px-4">
              <ThemeToggle />
            </div>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
