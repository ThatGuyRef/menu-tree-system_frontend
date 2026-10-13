"use client";

import React, { useMemo } from "react";
import { useMenuStore } from "@/store/menuStore";
import { MenuTreeItem } from "./MenuTreeItem";
import { Search, Plus, Layers, Loader2 } from "lucide-react";

export function MenuTree() {
  const {
    menuTree,
    selectedRootMenuId,
    setSelectedRootMenuId,
    expandAll,
    collapseAll,
    searchQuery,
    setSearchQuery,
    startCreateRoot,
    isLoading,
    error,
  } = useMenuStore();

  // Root items (depth = 0) untuk pilihan dropdown
  const rootMenuItems = useMemo(
    () => menuTree.filter((item) => item.parentId === null),
    [menuTree]
  );

  // Filter root menu yang sedang aktif dipilih di dropdown (atau tampilkan semua jika belum ada)
  const displayedItems = useMemo(() => {
    if (!selectedRootMenuId) return menuTree;
    return menuTree.filter((item) => item.id === selectedRootMenuId);
  }, [menuTree, selectedRootMenuId]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[550px]">
      {/* 1. Selector Menu Root */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Menu
        </label>
        <div className="relative">
          <select
            value={selectedRootMenuId || ""}
            onChange={(e) => setSelectedRootMenuId(e.target.value || null)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
          >
            <option value="">All Menus</option>
            {rootMenuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Tombol Aksi: Expand All, Collapse All & Search */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          type="button"
          onClick={expandAll}
          className="px-4 py-2 bg-[#1D2939] hover:bg-gray-800 text-white text-xs font-semibold rounded-full transition-all shadow-sm"
        >
          Expand All
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold rounded-full transition-all shadow-sm"
        >
          Collapse All
        </button>
        <button
          type="button"
          onClick={startCreateRoot}
          className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Root Menu
        </button>
      </div>

      {/* 3. Search Bar */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menus..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
        />
      </div>

      {/* 4. Daftar Tree Menu */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading && menuTree.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Loading menus...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
            {error}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No menus found. Click &quot;Add Root Menu&quot; to create one.
          </div>
        ) : (
          <div className="space-y-1">
            {displayedItems.map((item) => (
              <MenuTreeItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}