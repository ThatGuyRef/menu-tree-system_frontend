"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MenuTree } from "@/components/menu/MenuTree";
import { MenuForm } from "@/components/menu/MenuForm";
import { useMenuStore } from "@/store/menuStore";
import { Folder, ListTree } from "lucide-react";

export default function HomePage() {
  const { fetchMenuTree } = useMenuStore();

  useEffect(() => {
    fetchMenuTree();
  }, [fetchMenuTree]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigasi Kiri */}
      <Sidebar />

      {/* Area Konten Utama */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* 1. Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
          <Folder className="w-4 h-4 text-gray-400" />
          <span>/</span>
          <span className="text-gray-700">Menus</span>
        </div>

        {/* 2. Header Halaman */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <ListTree className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Menus
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage hierarchical menu tree navigation and nested structures
            </p>
          </div>
        </div>

        {/* 3. Grid Dua Kolom (Tree di Kiri, Form di Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section>
            <MenuTree />
          </section>
          <section className="sticky top-6">
            <MenuForm />
          </section>
        </div>
      </main>
    </div>
  );
}