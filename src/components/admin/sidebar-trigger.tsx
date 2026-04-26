"use client";

import { PanelLeft } from "lucide-react";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";

export function SidebarTrigger() {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
      aria-label="Toggle Sidebar"
    >
      <PanelLeft className="w-5 h-5" />
    </button>
  );
}
