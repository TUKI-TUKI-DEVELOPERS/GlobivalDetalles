"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { buildImageUrl, BUSINESS } from "@/config/constants";
import type { Product } from "@/types";

const STORAGE_KEY = "catalogo_cart_items";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imagen?: string | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addProduct: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  getWhatsAppCartLink: () => string;
  formatCurrency: (n: number) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // Normalize old format (id → productId)
    return parsed.map((item: Record<string, unknown>) => ({
      productId: item.productId ?? item.id,
      name: item.name,
      price: Number(item.price),
      imagen: item.imagen,
      quantity: Number(item.quantity) || 1,
    }));
  } catch {
    return [];
  }
}

function writeCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("catalogo_cart_items_updated"));
  } catch {
    /* ignore */
  }
}

function getUnitPrice(product: Product): number {
  const offer = product.precio_de_oferta;
  if (offer && offer !== "") return Number(offer);
  return Number(product.price);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Sync from other tabs / product detail page
  useEffect(() => {
    const sync = () => setItems(readCartFromStorage());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const count = useMemo(
    () => items.reduce((sum, ci) => sum + ci.quantity, 0),
    [items],
  );

  const total = useMemo(
    () => items.reduce((sum, ci) => sum + ci.price * ci.quantity, 0),
    [items],
  );

  const formatCurrency = useCallback(
    (n: number) =>
      n.toLocaleString("es-PE", { style: "currency", currency: "PEN" }),
    [],
  );

  const addProduct = useCallback((product: Product) => {
    const unitPrice = getUnitPrice(product);
    setItems((prev) => {
      const existing = prev.find((ci) => ci.productId === product.id);
      if (existing) {
        return prev.map((ci) =>
          ci.productId === product.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: unitPrice,
          imagen: product.imagen,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((ci) => ci.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((ci) =>
          ci.productId === productId
            ? { ...ci, quantity: Math.max(0, ci.quantity + delta) }
            : ci,
        )
        .filter((ci) => ci.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getWhatsAppCartLink = useCallback(() => {
    if (items.length === 0) return BUSINESS.whatsappUrl();
    const lines = items.map(
      (ci) =>
        `- ${ci.name} x${ci.quantity} -- ${formatCurrency(ci.price)} c/u = ${formatCurrency(ci.price * ci.quantity)}`,
    );
    const cartTotal = items.reduce(
      (sum, ci) => sum + ci.price * ci.quantity,
      0,
    );
    const header =
      "Hola, quiero solicitar estos productos de Globival & Detalles:\n\n";
    const message = `${header}${lines.join("\n")}\n\nTotal: ${formatCurrency(cartTotal)}`;
    return BUSINESS.whatsappUrl(message);
  }, [items, formatCurrency]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      total,
      isOpen,
      open,
      close,
      toggle,
      addProduct,
      removeItem,
      updateQuantity,
      clearCart,
      getWhatsAppCartLink,
      formatCurrency,
    }),
    [
      items,
      count,
      total,
      isOpen,
      open,
      close,
      toggle,
      addProduct,
      removeItem,
      updateQuantity,
      clearCart,
      getWhatsAppCartLink,
      formatCurrency,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
