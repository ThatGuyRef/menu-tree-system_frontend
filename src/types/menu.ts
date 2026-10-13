export interface MenuItem {
    id: string;
    name: string;
    parentId: string | null;
    depth: number;
    sortOrder: number;
    children: MenuItem[];
    parent?: MenuItem;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMenuInput {
    name: string;
    parentId: string | null;
}

export interface UpdateMenuInput {
    name: string;
}

export interface MoveMenuInput {
    parentId: string | null;
}

export interface ReorderMenuInput {
    newPosition: number;
}