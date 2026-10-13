"use client";

import React, { useMemo } from "react";
import { useMenuStore } from "@/store/menuStore";
import { MenuTreeItem } from "./MenuTreeItem";
import { ChevronDown, Plus, Search, Loader2 } from "lucide-react";

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

  const rootMenuItems = useMemo(
    () => menuTree.filter((item) => item.parentId === null),
    [menuTree]
  );

  const displayedItems = useMemo(() => {
    if (!selectedRootMenuId) return menuTree;
    return menuTree.filter((item) => item.id === selectedRootMenuId);
  }, [menuTree, selectedRootMenuId]);

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* 1. Menu Dropdown Selector */}
      <div className="mb-6 max-w-sm">
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Menu
        </label>
        <div className="relative">
          <select
            value={selectedRootMenuId || ""}
            onChange={(e) => setSelectedRootMenuId(e.target.value || null)}
            className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 text-sm font-medium rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0055D6] focus:bg-white transition-all cursor-pointer pr-10"
          >
            <option value="">systemmanagement</option>
            {rootMenuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name.toLowerCase().replace(/\s+/g, "")}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Action Buttons: Expand All & Collapse All (Matches Figma) */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={expandAll}
          className="px-6 py-2.5 bg-[#1D2939] hover:bg-gray-800 text-white text-xs font-semibold rounded-full transition-all shadow-sm"
        >
          Expand All
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-xs font-semibold rounded-full transition-all shadow-sm"
        >
          Collapse All
        </button>
        <button
          type="button"
          onClick={startCreateRoot}
          title="Add new Root Menu"
          className="ml-auto p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Search Filter */}
      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50/70 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0055D6] focus:bg-white transition-all placeholder:text-gray-400"
        />
      </div>

      {/* 4. Menu Tree Nodes */}
      <div className="flex-1 overflow-y-auto pr-2">
        {isLoading && menuTree.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0055D6]" />
            <span className="text-xs">Loading menus...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
            {error}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs">
            No menus available.
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