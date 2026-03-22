"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Loader2,
  Mail,
  MailOpen,
  Trash2,
  Eye,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Tag,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import { contactService, extractArray } from "@/services/api";
import type { Contact } from "@/types";

const ITEMS_PER_PAGE = 10;
type FilterStatus = "all" | "unread" | "read";
type SortField = "nombre" | "titulo" | "created_at";
type SortDir = "asc" | "desc";

export default function ContactosAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAll();
      setContacts(extractArray<Contact>(response));
    } catch {
      toast.error("Error al cargar los contactos");
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = contacts.filter((c) => !c.leido).length;
  const readCount = contacts.filter((c) => c.leido).length;

  // Filtered + sorted
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.titulo.toLowerCase().includes(q) ||
          c.categoria?.toLowerCase().includes(q) ||
          c.mensaje.toLowerCase().includes(q),
      );
    }

    if (filterStatus === "unread") {
      result = result.filter((c) => !c.leido);
    } else if (filterStatus === "read") {
      result = result.filter((c) => c.leido);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "nombre":
          cmp = a.nombre.localeCompare(b.nombre);
          break;
        case "titulo":
          cmp = a.titulo.localeCompare(b.titulo);
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
  }, [contacts, searchTerm, filterStatus, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / ITEMS_PER_PAGE),
  );
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContacts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContacts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

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

  const openDetail = (contact: Contact) => {
    setSelectedContact(contact);
    if (!contact.leido) markAsRead(contact);
  };

  const markAsRead = async (contact: Contact) => {
    try {
      await contactService.markAsRead(contact.id);
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, leido: true } : c)),
      );
      if (selectedContact?.id === contact.id) {
        setSelectedContact((prev) => (prev ? { ...prev, leido: true } : prev));
      }
    } catch {
      toast.error("Error al marcar como leído");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await contactService.delete(deleteTarget.id);
      setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Contacto eliminado");
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar el contacto");
    }
  };

  const exportCSV = () => {
    if (filteredContacts.length === 0) {
      toast.warning("No hay datos para exportar");
      return;
    }
    const headers = [
      "ID",
      "Nombre",
      "Email",
      "Teléfono",
      "Título",
      "Categoría",
      "Mensaje",
      "Leído",
      "Fecha",
    ];
    const esc = (v: string | number | boolean | undefined | null) => {
      const s = String(v ?? "");
      return `"${s.replace(/"/g, '""')}"`;
    };
    const rows = filteredContacts.map((c) => [
      esc(c.id),
      esc(c.nombre),
      esc(c.email),
      esc(c.telefono),
      esc(c.titulo),
      esc(c.categoria),
      esc(c.mensaje),
      esc(c.leido ? "Sí" : "No"),
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
    a.download = `contactos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Contactos
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {contacts.length} mensajes ·{" "}
              {unreadCount > 0 ? (
                <span className="text-destructive font-medium">
                  {unreadCount} sin leer
                </span>
              ) : (
                <span className="text-success">todos leídos</span>
              )}
              {readCount > 0 && (
                <span className="text-muted-foreground"> · {readCount} leídos</span>
              )}
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

        {/* Search + Status filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, email, título, categoría..."
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
                {
                  value: "unread",
                  label: `Sin leer${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
                },
                { value: "read", label: "Leídos" },
              ] as { value: FilterStatus; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
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
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-20">
          <Mail
            className="mx-auto text-muted-foreground mb-4"
            size={64}
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No se encontraron contactos
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== "all"
              ? "Prueba con otros filtros"
              : "No hay mensajes de contacto"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="w-10 px-3 py-3" />
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("nombre")}
                  >
                    Remitente
                    <SortIcon field="nombre" />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("titulo")}
                  >
                    Asunto
                    <SortIcon field="titulo" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Categoría
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("created_at")}
                  >
                    Fecha
                    <SortIcon field="created_at" />
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground w-28">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => openDetail(contact)}
                    className={`cursor-pointer transition-colors hover:bg-muted/30 ${
                      !contact.leido
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-3 text-center">
                      {!contact.leido ? (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
                      ) : (
                        <MailOpen
                          size={14}
                          className="text-muted-foreground mx-auto"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`text-sm ${!contact.leido ? "font-semibold text-foreground" : "text-foreground/80"}`}
                      >
                        {contact.nombre}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`text-sm truncate max-w-[200px] ${!contact.leido ? "font-medium text-foreground" : "text-muted-foreground"}`}
                      >
                        {contact.titulo}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {contact.categoria && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                          <Tag size={10} />
                          {contact.categoria}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(contact.created_at).toLocaleDateString(
                        "es-PE",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openDetail(contact)}
                          className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Ver detalle"
                          aria-label="Ver detalle"
                        >
                          <Eye size={15} />
                        </button>
                        {!contact.leido && (
                          <button
                            onClick={() => markAsRead(contact)}
                            className="p-2.5 text-muted-foreground hover:text-success hover:bg-success/10 rounded-lg transition-colors"
                            title="Marcar como leído"
                            aria-label="Responder"
                          >
                            <MailOpen size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(contact)}
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paginatedContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => openDetail(contact)}
                className={`bg-card border rounded-xl p-4 shadow-sm cursor-pointer transition-colors ${
                  !contact.leido
                    ? "border-primary/30 bg-blue-50/30 dark:bg-blue-900/10"
                    : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      !contact.leido
                        ? "bg-primary/10 ring-2 ring-primary/20"
                        : "bg-muted"
                    }`}
                  >
                    <User
                      size={16}
                      className={
                        !contact.leido
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm truncate ${!contact.leido ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}
                      >
                        {contact.nombre}
                      </h3>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                        {new Date(contact.created_at).toLocaleDateString(
                          "es-PE",
                          { day: "2-digit", month: "short" },
                        )}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${!contact.leido ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {contact.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {contact.mensaje}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {contact.categoria && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded text-[10px] font-medium">
                          {contact.categoria}
                        </span>
                      )}
                      {!contact.leido && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
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
                  filteredContacts.length,
                )}{" "}
                de {filteredContacts.length}
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
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setSelectedContact(null)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Mail className="text-blue-600" size={16} />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Detalle del Contacto
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Sender */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center shrink-0">
                    <User className="text-blue-600" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {selectedContact.nombre}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Mail size={13} />
                        {selectedContact.email}
                      </a>
                      <a
                        href={`tel:${selectedContact.telefono}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Phone size={13} />
                        {selectedContact.telefono}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Subject + Category */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
                      <MessageSquare size={12} />
                      Asunto
                    </label>
                    <p className="text-sm font-medium text-foreground bg-muted px-3 py-2 rounded-lg">
                      {selectedContact.titulo}
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
                      <Tag size={12} />
                      Categoría
                    </label>
                    <p className="text-sm text-foreground bg-muted px-3 py-2 rounded-lg">
                      {selectedContact.categoria || "—"}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Mensaje
                  </label>
                  <div className="bg-muted p-4 rounded-lg border border-border">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
                      {selectedContact.mensaje}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      selectedContact.leido
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {selectedContact.leido ? (
                      <>
                        <MailOpen size={12} /> Leído
                      </>
                    ) : (
                      <>
                        <Mail size={12} /> Sin leer
                      </>
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {formatDate(selectedContact.created_at)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-wrap justify-end gap-2 p-5 border-t border-border">
                {!selectedContact.leido && (
                  <button
                    onClick={() => markAsRead(selectedContact)}
                    className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <MailOpen size={14} />
                    Marcar como leído
                  </button>
                )}
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.titulo)}&body=${encodeURIComponent(
                    `Estimado/a ${selectedContact.nombre},\n\nGracias por comunicarse con Globival Detalles respecto a "${selectedContact.titulo}".\n\n`,
                  )}`}
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Mail size={14} />
                  Responder por email
                </a>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setDeleteTarget(null)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-xl shadow-xl w-full max-w-sm"
            >
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-destructive" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  ¿Eliminar contacto?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Se eliminará el mensaje de{" "}
                  <strong>{deleteTarget.nombre}</strong> con asunto &quot;
                  {deleteTarget.titulo}&quot;. Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
