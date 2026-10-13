"use client";

import React from "react";
import { MenuItem } from "@/types/menu";
import { useMenuStore } from "@/store/menuStore";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

interface MenuTreeItemProps {
  item: MenuItem;
  level?: number;
}

export function MenuTreeItem({ item, level = 0 }: MenuTreeItemProps) {
  const {
    selectedMenu,
    selectMenu,
    expandedIds,
    toggleExpand,
    startCreateChild,
    searchQuery,
  } = useMenuStore();

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedIds.has(item.id);
  const isSelected = selectedMenu?.id === item.id;

  // Filter pencarian: cek apakah node ini atau anaknya cocok dengan query
  const matchesSearch = (node: MenuItem, query: string): boolean => {
    if (!query) return true;
    if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
    return (
      node.children?.some((child) => matchesSearch(child, query)) ?? false
    );
  };

  if (searchQuery && !matchesSearch(item, searchQuery)) {
    return null;
  }

  return (
    <div className="relative select-none">
      {/* Baris item menu */}
      <div
        className={`group flex items-center justify-between py-2 px-3 my-0.5 rounded-xl transition-all cursor-pointer ${
          isSelected
            ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
            : "hover:bg-gray-100 text-gray-700 font-normal"
        }`}
        onClick={() => selectMenu(item)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Tombol expand/collapse */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              className="p-1 hover:bg-black/5 rounded-lg text-gray-500 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span className="w-6" />
          )}

          <span className="truncate text-sm">{item.name}</span>
        </div>

        {/* Tombol "+" untuk tambah sub-menu langsung */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            startCreateChild(item);
          }}
          title="Add child menu"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Render anak secara rekursif jika item di-expand */}
      {hasChildren && isExpanded && (
        <div className="relative pl-6 ml-3 border-l-2 border-gray-200 space-y-0.5 my-1">
          {item.children.map((child) => (
            <MenuTreeItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}