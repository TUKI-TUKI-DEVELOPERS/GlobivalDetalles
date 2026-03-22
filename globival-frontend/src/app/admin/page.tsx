"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  FolderTree,
  AlertTriangle,
  Star,
  Image,
  Mail,
  Plus,
  Eye,
  Calendar,
  ArrowUp,
  BarChart3,
  Server,
} from "lucide-react";
import {
  categoryService,
  subcategoryService,
  productService,
  claimService,
  testimonialService,
  contactService,
  extractArray,
} from "@/services/api";
import { toast } from "react-toastify";

interface Stats {
  categories: number;
  subcategories: number;
  products: number;
  claims: number;
  testimonials: number;
  contacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    subcategories: 0,
    products: 0,
    claims: 0,
    testimonials: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [categories, subcategories, products, claims, testimonials, contacts] =
          await Promise.all([
            categoryService.getAll(),
            subcategoryService.getAll(),
            productService.getAll(),
            claimService.getAll(),
            testimonialService.getAll(),
            contactService.getAll(),
          ]);

        setStats({
          categories: extractArray(categories).length,
          subcategories: extractArray(subcategories).length,
          products: extractArray(products).length,
          claims: extractArray(claims).length,
          testimonials: extractArray(testimonials).length,
          contacts: extractArray(contacts).length,
        });
        setError(null);
      } catch {
        setError("No se pudieron cargar las estadisticas del dashboard");
        toast.error("Error al cargar estadisticas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Layers,
      title: "Categorias",
      value: stats.categories,
      color: "from-blue-500 to-blue-600",
      link: "/admin/categorias",
    },
    {
      icon: FolderTree,
      title: "Subcategorias",
      value: stats.subcategories,
      color: "from-purple-500 to-purple-600",
      link: "/admin/subcategorias",
    },
    {
      icon: ShoppingCart,
      title: "Productos",
      value: stats.products,
      color: "from-green-500 to-green-600",
      link: "/admin/productos",
    },
    {
      icon: AlertTriangle,
      title: "Reclamaciones",
      value: stats.claims,
      color: "from-amber-500 to-amber-600",
      link: "/admin/reclamaciones",
    },
    {
      icon: Star,
      title: "Testimonios",
      value: stats.testimonials,
      color: "from-rose-500 to-rose-600",
      link: "/admin/testimonios",
    },
    {
      icon: Mail,
      title: "Contactos",
      value: stats.contacts,
      color: "from-teal-500 to-teal-600",
      link: "/admin/contactos",
    },
  ];

  const quickActions = [
    {
      title: "Crear Producto",
      description: "Anadir nuevo producto al catalogo",
      icon: Plus,
      link: "/admin/productos",
      color: "bg-green-500",
    },
    {
      title: "Nueva Categoria",
      description: "Organizar productos por categorias",
      icon: Layers,
      link: "/admin/categorias",
      color: "bg-blue-500",
    },
    {
      title: "Ver Reclamaciones",
      description: "Gestionar quejas y sugerencias",
      icon: Eye,
      link: "/admin/reclamaciones",
      color: "bg-amber-500",
    },
    {
      title: "Gestionar Banners",
      description: "Actualizar promociones visuales",
      icon: Image,
      link: "/admin/banners",
      color: "bg-purple-500",
    },
    {
      title: "Ver Contactos",
      description: "Revisar mensajes de clientes",
      icon: Mail,
      link: "/admin/contactos",
      color: "bg-teal-500",
    },
    {
      title: "Testimonios",
      description: "Gestionar resenas de clientes",
      icon: Star,
      link: "/admin/testimonios",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-600/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <LayoutDashboard className="text-blue-600" />
                Dashboard Administrativo
              </h1>
              <p className="text-muted-foreground mt-2">
                Bienvenido al panel de control de Globival
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="text-blue-600" size={16} />
                <span className="text-muted-foreground">
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg flex items-center gap-3">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-16 h-8 bg-muted rounded" />
                    <div className="w-20 h-4 bg-muted rounded" />
                  </div>
                </div>
              ))
            : statCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={card.link} className="group block">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}
                        >
                          <card.icon size={20} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-foreground">
                          {card.value}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
                <ArrowUp className="text-blue-600" size={20} />
                Acciones Rapidas
              </h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.link} className="group block">
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-all duration-200 group-hover:shadow-md">
                      <div
                        className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <action.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* System Status & Performance */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <BarChart3 className="text-blue-600" size={20} />
                Resumen de Rendimiento
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-foreground/80">
                    Total productos en catalogo
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {loading ? "..." : stats.products}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-foreground/80">
                    Categorias activas
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {loading ? "..." : stats.categories}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-foreground/80">
                    Mensajes sin leer
                  </span>
                  <span className="text-sm font-semibold text-amber-600">
                    {loading ? "..." : stats.contacts}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Server className="text-blue-600" size={20} />
                Estado del Sistema
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/30">
                  <span className="text-sm font-medium text-success">
                    Servidor
                  </span>
                  <span className="text-sm text-success font-medium">
                    Operativo
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/30">
                  <span className="text-sm font-medium text-success">
                    Base de datos
                  </span>
                  <span className="text-sm text-success font-medium">
                    Conectada
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    API
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {error ? "Error de conexion" : "Disponible"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
