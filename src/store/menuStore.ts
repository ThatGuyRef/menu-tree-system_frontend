import { create } from "zustand";
import { CreateMenuInput, MenuItem, UpdateMenuInput } from "@/types/menu";
import { menuApi } from "@/services/menuApi";

// Helper rekursif untuk mengumpulkan semua ID dalam tree
function getAllItemIds(items: MenuItem[]): string[] {
  let ids: string[] = [];
  for (const item of items) {
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids = ids.concat(getAllItemIds(item.children));
    }
  }
  return ids;
}

// Helper rekursif untuk mencari item berdasarkan ID
export function findItemInTree(
  items: MenuItem[],
  id: string
): MenuItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children && item.children.length > 0) {
      const found = findItemInTree(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper rekursif untuk mencari item berdasarkan nama
function findItemByName(items: MenuItem[], name: string): MenuItem | null {
  for (const item of items) {
    if (item.name.toLowerCase() === name.toLowerCase()) return item;
    if (item.children && item.children.length > 0) {
      const found = findItemByName(item.children, name);
      if (found) return found;
    }
  }
  return null;
}

interface MenuState {
  menuTree: MenuItem[];
  selectedMenu: MenuItem | null;
  selectedRootMenuId: string | null;
  expandedIds: Set<string>;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isCreating: boolean;
  parentForNewItem: MenuItem | null;

  // Actions
  fetchMenuTree: () => Promise<void>;
  selectMenu: (menu: MenuItem | null) => void;
  setSelectedRootMenuId: (id: string | null) => void;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setSearchQuery: (query: string) => void;
  startCreateRoot: () => void;
  startCreateChild: (parent: MenuItem) => void;
  cancelCreating: () => void;
  createMenu: (input: CreateMenuInput) => Promise<MenuItem | null>;
  updateMenu: (id: string, input: UpdateMenuInput) => Promise<MenuItem | null>;
  deleteMenu: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menuTree: [],
  selectedMenu: null,
  selectedRootMenuId: null,
  expandedIds: new Set<string>(),
  searchQuery: "",
  isLoading: false,
  isSubmitting: false,
  error: null,
  isCreating: false,
  parentForNewItem: null,

  fetchMenuTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const tree = await menuApi.getMenuTree();
      set((state) => {
        const defaultRootId =
          state.selectedRootMenuId || (tree.length > 0 ? tree[0].id : null);

        // Auto-expand semua item saat pertama kali load
        const allIds = getAllItemIds(tree);
        const newExpanded = new Set(state.expandedIds);
        allIds.forEach((id) => newExpanded.add(id));

        // Pertahankan selected menu jika ada, atau default ke "System Code" sesuai Figma
        let updatedSelectedMenu = state.selectedMenu;
        if (state.selectedMenu) {
          updatedSelectedMenu = findItemInTree(tree, state.selectedMenu.id);
        } else {
          updatedSelectedMenu = findItemByName(tree, "System Code") || (tree.length > 0 ? tree[0] : null);
        }

        return {
          menuTree: tree,
          selectedRootMenuId: defaultRootId,
          expandedIds: newExpanded,
          selectedMenu: updatedSelectedMenu,
          isLoading: false,
        };
      });
    } catch (err: any) {
      set({
        error: err.message || "Failed to fetch menus",
        isLoading: false,
      });
    }
  },

  selectMenu: (menu) => {
    set({
      selectedMenu: menu,
      isCreating: false,
      parentForNewItem: null,
    });
  },

  setSelectedRootMenuId: (id) => {
    set((state) => {
      const selectedItem = id ? findItemInTree(state.menuTree, id) : null;
      return {
        selectedRootMenuId: id,
        selectedMenu: selectedItem || state.selectedMenu,
        isCreating: false,
        parentForNewItem: null,
      };
    });
  },

  toggleExpand: (id) => {
    set((state) => {
      const nextExpanded = new Set(state.expandedIds);
      if (nextExpanded.has(id)) {
        nextExpanded.delete(id);
      } else {
        nextExpanded.add(id);
      }
      return { expandedIds: nextExpanded };
    });
  },

  expandAll: () => {
    const { menuTree } = get();
    const allIds = getAllItemIds(menuTree);
    set({ expandedIds: new Set(allIds) });
  },

  collapseAll: () => {
    set({ expandedIds: new Set() });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  startCreateRoot: () => {
    set({
      isCreating: true,
      parentForNewItem: null,
      selectedMenu: null,
    });
  },

  startCreateChild: (parent) => {
    set((state) => {
      const nextExpanded = new Set(state.expandedIds);
      nextExpanded.add(parent.id);
      return {
        isCreating: true,
        parentForNewItem: parent,
        selectedMenu: null,
        expandedIds: nextExpanded,
      };
    });
  },

  cancelCreating: () => {
    set({
      isCreating: false,
      parentForNewItem: null,
    });
  },

  createMenu: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      const created = await menuApi.createMenu(input);
      await get().fetchMenuTree();
      set({
        isCreating: false,
        parentForNewItem: null,
        selectedMenu: created,
        isSubmitting: false,
      });
      return created;
    } catch (err: any) {
      set({
        error: err.message || "Failed to create menu item",
        isSubmitting: false,
      });
      return null;
    }
  },

  updateMenu: async (id, input) => {
    set({ isSubmitting: true, error: null });
    try {
      const updated = await menuApi.updateMenu(id, input);
      await get().fetchMenuTree();
      set({
        selectedMenu: updated,
        isSubmitting: false,
      });
      return updated;
    } catch (err: any) {
      set({
        error: err.message || "Failed to update menu item",
        isSubmitting: false,
      });
      return null;
    }
  },

  deleteMenu: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await menuApi.deleteMenu(id);
      await get().fetchMenuTree();
      set({
        selectedMenu: null,
        isCreating: false,
        parentForNewItem: null,
        isSubmitting: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err.message || "Failed to delete menu item",
        isSubmitting: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));