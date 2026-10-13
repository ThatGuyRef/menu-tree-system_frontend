"use client";

import React, { useState, useEffect } from "react";
import { useMenuStore } from "@/store/menuStore";
import { Modal } from "@/components/ui/Modal";
import { Trash2, X } from "lucide-react";

export function MenuForm() {
  const {
    selectedMenu,
    isCreating,
    parentForNewItem,
    cancelCreating,
    createMenu,
    updateMenu,
    deleteMenu,
    isSubmitting,
  } = useMenuStore();

  const [name, setName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isCreating) {
      setName("");
      setFormError(null);
    } else if (selectedMenu) {
      setName(selectedMenu.name);
      setFormError(null);
    }
  }, [selectedMenu, isCreating]);

  if (!selectedMenu && !isCreating) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 text-gray-400">
        <p className="text-sm">
          Select an item from the tree or click &quot;+&quot; to manage menu item
        </p>
      </div>
    );
  }

  const currentDepth = isCreating
    ? parentForNewItem
      ? parentForNewItem.depth + 1
      : 0
    : selectedMenu?.depth ?? 0;

  const parentName = isCreating
    ? parentForNewItem
      ? parentForNewItem.name
      : "Root"
    : selectedMenu?.parent?.name ?? (selectedMenu?.parentId ? "Systems" : "Root");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Menu name is required");
      return;
    }
    setFormError(null);

    if (isCreating) {
      await createMenu({
        name: name.trim(),
        parentId: parentForNewItem ? parentForNewItem.id : null,
      });
    } else if (selectedMenu) {
      await updateMenu(selectedMenu.id, {
        name: name.trim(),
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedMenu) return;
    const success = await deleteMenu(selectedMenu.id);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-lg pt-2 lg:pt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {isCreating ? "Create Menu Item" : "Menu Details"}
          </span>
          <div className="flex items-center gap-1">
            {!isCreating && selectedMenu && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isSubmitting}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete menu"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {isCreating && (
              <button
                type="button"
                onClick={cancelCreating}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Menu ID */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Menu ID
            </label>
            <input
              type="text"
              readOnly
              value={isCreating ? "Auto-generated UUID" : selectedMenu?.id || ""}
              className="w-full bg-[#EAECF0]/60 text-gray-500 text-xs font-mono rounded-2xl py-3 px-4 cursor-not-allowed select-all border-none focus:outline-none"
            />
          </div>

          {/* Depth */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Depth
            </label>
            <input
              type="text"
              readOnly
              value={currentDepth}
              className="w-full bg-[#EAECF0]/60 text-gray-700 text-xs font-medium rounded-2xl py-3 px-4 cursor-not-allowed border-none focus:outline-none"
            />
          </div>

          {/* Parent Data */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Parent Data
            </label>
            <input
              type="text"
              readOnly
              value={parentName}
              className="w-full bg-[#EAECF0]/60 text-gray-700 text-xs font-medium rounded-2xl py-3 px-4 cursor-not-allowed border-none focus:outline-none"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="e.g. System Code"
              className={`w-full bg-[#EAECF0]/60 text-gray-900 text-xs font-medium rounded-2xl py-3 px-4 border-none focus:outline-none focus:ring-2 focus:ring-[#0055D6] focus:bg-white transition-all ${
                formError ? "ring-2 ring-red-400" : ""
              }`}
            />
            {formError && (
              <p className="text-xs text-red-500 mt-1">{formError}</p>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-[#0055D6] hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-lg shadow-[#0055D6]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Save
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        title="Delete Menu"
        description={`Are you sure you want to delete "${selectedMenu?.name}"? All sub-items under this menu will also be removed.`}
        confirmText="Delete"
      />
    </>
  );
}