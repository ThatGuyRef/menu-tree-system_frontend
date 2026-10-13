import {
  CreateMenuInput,
  MenuItem,
  MoveMenuInput,
  ReorderMenuInput,
  UpdateMenuInput,
} from "@/types/menu";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const menuApi = {
  // Ambil semua menu dalam bentuk hierarki tree
  async getMenuTree(): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/menus`, {
      cache: "no-store",
    });
    return handleResponse<MenuItem[]>(response);
  },

  // Ambil single menu item berdasarkan ID
  async getMenu(id: string): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      cache: "no-store",
    });
    return handleResponse<MenuItem>(response);
  },

  // Buat menu baru
  async createMenu(data: CreateMenuInput): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MenuItem>(response);
  },

  // Update nama menu
  async updateMenu(id: string, data: UpdateMenuInput): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MenuItem>(response);
  },

  // Hapus menu beserta child-nya
  async deleteMenu(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  },

  // Pindahkan menu ke parent lain
  async moveMenu(id: string, data: MoveMenuInput): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MenuItem>(response);
  },

  // Ubah urutan menu dalam level yang sama
  async reorderMenu(id: string, data: ReorderMenuInput): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<MenuItem>(response);
  },
};