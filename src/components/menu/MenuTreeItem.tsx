"use client";

import React from "react";
import { MenuItem } from "@/types/menu";
import { useMenuStore } from "@/store/menuStore";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

interface MenuTreeItemProps {
  item: MenuItem;
  level?: number;
  isLast?: boolean;
}

export function MenuTreeItem({ item, level = 0, isLast = false }: MenuTreeItemProps) {
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

  // Search filter matching
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
    <div className="relative select-none text-[13px]">
      {/* Baris Menu Item */}
      <div
        className={`group flex items-center gap-1.5 py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
          isSelected
            ? "text-gray-900 font-bold bg-blue-50/80"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-normal"
        }`}
        onClick={() => selectMenu(item)}
      >
        {/* Expand / Collapse Chevron */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(item.id);
            }}
            className="p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Menu Title */}
        <span className="truncate">{item.name}</span>

        {/* Blue Plus Button (matches Figma active item plus badge) */}
        {(isSelected || isExpanded || hasChildren) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startCreateChild(item);
            }}
            title="Add child menu"
            className="ml-1 p-1 bg-[#0055D6] hover:bg-blue-700 text-white rounded-full shadow-sm transition-all transform hover:scale-110 shrink-0"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Children Tree Nodes with Connecting Guide Lines */}
      {hasChildren && isExpanded && (
        <div className="relative pl-5 ml-2.5 my-0.5 border-l border-gray-200 space-y-0.5">
          {item.children.map((child, index) => (
            <MenuTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              isLast={index === item.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}