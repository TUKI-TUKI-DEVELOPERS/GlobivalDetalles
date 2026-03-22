"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Loader2,
  AlertTriangle,
  Eye,
  User,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import { claimService, extractArray } from "@/services/api";
import type { Claim } from "@/types";

const ITEMS_PER_PAGE = 10;

type SortField = "nombre" | "email" | "created_at";
type SortDir = "asc" | "desc";

export default function ReclamacionesAdminPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await claimService.getAll();
      setClaims(extractArray<Claim>(response));
    } catch {
      toast.error("Error al cargar las reclamaciones");
    } finally {
      setLoading(false);
    }
  };

  // Filtered + sorted
  const filteredClaims = useMemo(() => {
    let result = [...claims];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.telefono?.toLowerCase().includes(q) ||
          c.mensaje.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "nombre":
          cmp = a.nombre.localeCompare(b.nombre);
          break;
        case "email":
          cmp = a.email.localeCompare(b.email);
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
  }, [claims, searchTerm, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredClaims.length / ITEMS_PER_PAGE),
  );
  const paginatedClaims = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClaims.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClaims, currentPage]);

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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const exportCSV = () => {
    if (filteredClaims.length === 0) {
      toast.warning("No hay datos para exportar");
      return;
    }
    const headers = ["ID", "Nombre", "Email", "Teléfono", "Mensaje", "Fecha"];
    const esc = (v: string | number | undefined | null) => {
      const s = String(v ?? "");
      return `"${s.replace(/"/g, '""')}"`;
    };
    const rows = filteredClaims.map((c) => [
      esc(c.id),
      esc(c.nombre),
      esc(c.email),
      esc(c.telefono),
      esc(c.mensaje),
      esc(formatDate(c.created_at)),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n",
    );
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reclamaciones_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  };

  // Stats
  const thisMonth = claims.filter((c) => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Reclamaciones
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {claims.length} reclamaciones en total · {thisMonth} este mes
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
          >
            <Download size={16} />
            Exportar CSV
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
            placeholder="Buscar por nombre, email, teléfono o mensaje..."
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
      ) : filteredClaims.length === 0 ? (
        <div className="text-center py-20">
          <AlertTriangle
            className="mx-auto text-muted-foreground mb-4"
            size={64}
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron reclamaciones
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Prueba con otro término de búsqueda"
              : "No hay reclamaciones registradas"}
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
                    onClick={() => toggleSort("nombre")}
                  >
                    Remitente
                    <SortIcon field="nombre" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Mensaje
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("created_at")}
                  >
                    Fecha
                    <SortIcon field="created_at" />
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-20">
                    Ver
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center shrink-0">
                          <User className="text-amber-600" size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">
                            {claim.nombre}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {claim.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                        {claim.mensaje}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(claim.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClaim(claim);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paginatedClaims.map((claim) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedClaim(claim)}
                className="bg-card border border-border rounded-xl p-4 shadow-sm cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center shrink-0">
                    <User className="text-amber-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {claim.nombre}
                      </h3>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(claim.created_at).toLocaleDateString(
                          "es-PE",
                          { day: "2-digit", month: "short" },
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      {claim.email}
                      {claim.telefono && ` · ${claim.telefono}`}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {claim.mensaje}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground text-xs">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredClaims.length,
                )}{" "}
                de {filteredClaims.length}
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
                    const showEllipsis = i > 0 && page - arr[i - 1] > 1;
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
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setSelectedClaim(null)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-amber-600" size={16} />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Detalle de Reclamación
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-5">
                {/* Sender info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center shrink-0">
                    <User className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedClaim.nombre}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                      <a
                        href={`mailto:${selectedClaim.email}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Mail size={13} />
                        {selectedClaim.email}
                      </a>
                      {selectedClaim.telefono && (
                        <a
                          href={`tel:${selectedClaim.telefono}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Phone size={13} />
                          {selectedClaim.telefono}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                    <MessageSquare size={13} />
                    Mensaje de reclamación
                  </label>
                  <div className="bg-muted p-4 rounded-lg border border-border">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
                      {selectedClaim.mensaje}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground pt-3 border-t border-border">
                  <Calendar size={14} />
                  Recibida el {formatDate(selectedClaim.created_at)}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-5 border-t border-border">
                <a
                  href={`mailto:${selectedClaim.email}?subject=Re: Reclamación - Globival Detalles&body=Estimado/a ${selectedClaim.nombre},%0D%0A%0D%0AGracias por comunicarse con nosotros respecto a su reclamación.%0D%0A%0D%0A`}
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  Responder por email
                </a>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
