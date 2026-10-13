"use client";

import React, { useState } from "react";
import {
  Folder,
  LayoutGrid,
  Menu as MenuIcon,
  X,
  Code2,
  SlidersHorizontal,
  FolderTree,
  FileCode2,
  Users,
  Trophy,
  PanelLeftClose,
} from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ElementType;
  active?: boolean;
}

export function Sidebar() {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const systemsItems: NavItem[] = [
    { name: "System Code", icon: Code2 },
    { name: "Properties", icon: SlidersHorizontal },
    { name: "Menus", icon: LayoutGrid, active: true },
    { name: "API List", icon: FileCode2 },
  ];

  const generalItems: NavItem[] = [
    { name: "Users & Group", icon: Users },
    { name: "Competition", icon: Trophy },
  ];

  const SidebarContent = (
    <div
      className={`flex flex-col h-[calc(100vh-2rem)] bg-[#0055D6] text-white p-5 select-none rounded-[28px] m-4 shadow-2xl transition-all duration-300 ${
        isCollapsed ? "w-20 items-center" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between w-full mb-8 px-1">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="grid grid-cols-2 gap-1 p-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              CLOIT
            </span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeftClose className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>

        <button
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden text-white/80 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 w-full space-y-4 overflow-y-auto overflow-x-hidden pr-0.5">
        <div>
          {/* Section: Systems Header */}
          <div
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-white/10 text-white font-semibold text-sm mb-2 backdrop-blur-sm ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
          >
            <Folder className="w-4 h-4 shrink-0 text-white" />
            {!isCollapsed && <span>Systems</span>}
          </div>

          {/* Sub Navigation Items */}
          <div className={`space-y-1.5 ${isCollapsed ? "" : "pl-2"}`}>
            {systemsItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    item.active
                      ? "bg-white text-[#0055D6] shadow-lg shadow-black/10 font-bold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      item.active ? "text-[#0055D6]" : "text-white"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Sections */}
        <div className="space-y-1.5 pt-2">
          {generalItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
                  isCollapsed ? "justify-center px-2" : ""
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-white" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="p-2.5 bg-[#0055D6] text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative z-10">{SidebarContent}</div>
        </div>
      )}
    </>
  );
}