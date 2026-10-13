"use client";

import React, { useState, useEffect } from "react";
import { useMenuStore } from "@/store/menuStore";
import { Modal } from "@/components/ui/Modal";
import { Trash2, Save, X, Info } from "lucide-react";

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

  // Sinkronkan state lokal nama setiap kali menu terpilih berganti
  useEffect(() => {
    if (isCreating) {
      setName("");
      setFormError(null);
    } else if (selectedMenu) {
      setName(selectedMenu.name);
      setFormError(null);
    }
  }, [selectedMenu, isCreating]);

  // Jika tidak ada item terpilih dan tidak sedang mode tambah
  if (!selectedMenu && !isCreating) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-[400px] text-gray-400">
        <Info className="w-10 h-10 mb-3 text-gray-300" />
        <h3 className="font-semibold text-gray-700 mb-1">No Menu Selected</h3>
        <p className="text-sm max-w-xs">
          Select a menu item from the tree on the left to view and edit details, or click &quot;+&quot; to add a new child item.
        </p>
      </div>
    );
  }

  // Hitung depth yang akan ditampilkan
  const currentDepth = isCreating
    ? parentForNewItem
      ? parentForNewItem.depth + 1
      : 0
    : selectedMenu?.depth ?? 0;

  // Nama parent
  const parentName = isCreating
    ? parentForNewItem
      ? parentForNewItem.name
      : "Root (No Parent)"
    : selectedMenu?.parent?.name ?? (selectedMenu?.parentId ? "Parent Menu" : "Root (No Parent)");

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
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isCreating
                ? parentForNewItem
                  ? `Add Sub-Menu under "${parentForNewItem.name}"`
                  : "Add Root Menu"
                : "Menu Details"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isCreating
                ? "Enter the title for your new menu entry"
                : "Manage and configure menu item parameters"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCreating && selectedMenu && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isSubmitting}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                title="Delete this menu"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            {isCreating && (
              <button
                type="button"
                onClick={cancelCreating}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Menu ID (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Menu ID
            </label>
            <input
              type="text"
              readOnly
              value={isCreating ? "Auto-generated UUID" : selectedMenu?.id || ""}
              className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm font-mono rounded-2xl py-3 px-4 cursor-not-allowed select-all"
            />
          </div>

          {/* Depth (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Depth
            </label>
            <input
              type="text"
              readOnly
              value={currentDepth}
              className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm font-medium rounded-2xl py-3 px-4 cursor-not-allowed"
            />
          </div>

          {/* Parent Data (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Parent Data
            </label>
            <input
              type="text"
              readOnly
              value={parentName}
              className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm font-medium rounded-2xl py-3 px-4 cursor-not-allowed"
            />
          </div>

          {/* Name (Editable) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="e.g. System Code"
              className={`w-full bg-gray-50 border text-gray-900 text-sm rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                formError ? "border-red-400" : "border-gray-200"
              }`}
            />
            {formError && (
              <p className="text-xs text-red-500 mt-1.5">{formError}</p>
            )}
          </div>

          {/* Tombol Save */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isCreating ? "Create Item" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Dialog Konfirmasi Delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        title="Delete Menu Item"
        description={`Are you sure you want to delete "${selectedMenu?.name}"? All nested sub-items under this menu will also be deleted permanently.`}
        confirmText="Yes, Delete"
      />
    </>
  );
}