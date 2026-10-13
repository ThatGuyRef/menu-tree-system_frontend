"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MenuTree } from "@/components/menu/MenuTree";
import { MenuForm } from "@/components/menu/MenuForm";
import { useMenuStore } from "@/store/menuStore";
import { Folder, LayoutGrid } from "lucide-react";

export default function HomePage() {
  const { fetchMenuTree } = useMenuStore();

  useEffect(() => {
    fetchMenuTree();
  }, [fetchMenuTree]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* 1. Sidebar Navigasi Kiri */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 px-6 py-6 lg:px-12 lg:py-8 max-w-7xl w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-medium">
          <Folder className="w-4 h-4 text-gray-400 fill-gray-200" />
          <span>/</span>
          <span className="text-gray-700">Menus</span>
        </div>

        {/* Page Title */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#0055D6] flex items-center justify-center text-white shadow-md shadow-[#0055D6]/20 shrink-0">
            <LayoutGrid className="w-5 h-5 fill-white/20" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Menus
          </h1>
        </div>

        {/* Two-Column Grid matching Figma (Left: Tree, Right: Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <section className="w-full">
            <MenuTree />
          </section>
          <section className="w-full sticky top-8">
            <MenuForm />
          </section>
        </div>
      </main>
    </div>
  );
}