# 💻 Menu Tree System - Frontend Application

Modern hierarchical menu management interface built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**, faithfully implementing the Figma design specifications.

---

## ✨ Features

- 🌳 **Unlimited Hierarchical Depth**: Recursive tree component supporting infinite nesting levels.
- ⚡ **Full CRUD Capabilities**: Create root/child items, inline updates, and cascading deletion with confirmation modal.
- 🔄 **Real-Time Synchronized State**: Global state powered by Zustand for instant UI updates.
- 🔍 **Search & Filter**: Real-time filtering across all tree depths with auto-expansion of matching branches.
- 📂 **Expand / Collapse All**: One-click toggling of all nested menu levels.
- 🎨 **Figma Pixel-Accurate UI**: Dark sidebar with CLOIT styling, modern card layout, and visual tree hierarchy lines.
- 📱 **Fully Responsive**: Mobile-friendly navigation drawer and adaptive two-column grid.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **Next.js 14** | React Framework with App Router & Standalone output |
| **TypeScript** | Strict type safety for data models and API contracts |
| **Tailwind CSS** | Utility-first styling with custom palette matching Figma |
| **Zustand** | Lightweight, boilerplate-free global state store |
| **Lucide React** | Clean, consistent vector icon set |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css         # Base styles & tree line indicators
│   ├── layout.tsx          # Root HTML layout with metadata
│   └── page.tsx            # Main dashboard split-view page
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx     # Figma-styled dark navigation sidebar
│   ├── menu/
│   │   ├── MenuTree.tsx    # Tree container with controls & search
│   │   ├── MenuTreeItem.tsx# Recursive tree node component
│   │   └── MenuForm.tsx    # Details, edit, and create form panel
│   └── ui/
│       └── Modal.tsx       # Delete confirmation modal dialog
├── services/
│   └── menuApi.ts          # Typed REST API client
├── store/
│   └── menuStore.ts        # Zustand state store & actions
├── types/
│   └── menu.ts             # TypeScript interfaces (MenuItem, DTOs)
└── lib/
    └── utils.ts            # Classnames merger utility (cn)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Ensure `NEXT_PUBLIC_API_URL` points to your backend (default: `http://localhost:8080/api`).

### 3. Run in Development Mode
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

### 5. Run with Docker
```bash
docker build -t menu-frontend .
docker run -p 3000:3000 menu-frontend
```
