"use client";

import React, { useState } from "react";
import {
  Folder,
  Grid,
  Menu as MenuIcon,
  X,
  Code2,
  Sliders,
  ListTree,
  Users2,
  Trophy,
} from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ElementType;
  active?: boolean;
}

export function Sidebar() {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const systemsItems: NavItem[] = [
    { name: "System Code", icon: Code2 },
    { name: "Properties", icon: Sliders },
    { name: "Menus", icon: ListTree, active: true },
    { name: "API List", icon: Grid },
  ];

  const generalItems: NavItem[] = [
    { name: "Users & Group", icon: Users2 },
    { name: "Competition", icon: Trophy },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#101828] text-gray-300 w-64 p-5 select-none rounded-3xl m-3 shadow-xl">
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-8 px-2 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-wider text-white">
            CLOIT
          </span>
        </div>
        <button
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        <div>
          {/* Section: Systems Header */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1D2939] text-white font-medium text-sm mb-2 shadow-sm">
            <Folder className="w-4 h-4 text-gray-400" />
            <span>Systems</span>
          </div>

          {/* Sub Navigation Items */}
          <div className="space-y-1 pl-2">
            {systemsItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    item.active
                      ? "bg-[#9FF443] text-[#101828] shadow-md shadow-[#9FF443]/10"
                      : "text-gray-400 hover:text-white hover:bg-[#1D2939]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? "text-[#101828]" : "text-gray-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Sections */}
        <div className="space-y-1">
          {generalItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1D2939] transition-colors cursor-pointer"
              >
                <Icon className="w-4 h-4 text-gray-400" />
                <span>{item.name}</span>
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
          className="p-2.5 bg-[#101828] text-white rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative z-10">{SidebarContent}</div>
        </div>
      )}
    </>
  );
}