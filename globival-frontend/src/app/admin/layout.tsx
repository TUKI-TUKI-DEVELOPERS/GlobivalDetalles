"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        <a href="#admin-content" className="skip-to-content">
          Saltar al contenido
        </a>
        <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader onToggleSidebar={toggleSidebar} />

          <main id="admin-content" className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
