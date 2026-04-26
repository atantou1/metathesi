"use client";

import { PanelLeft } from "lucide-react";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";

export function SidebarTrigger() {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-2xl hover:bg-muted dark:hover:bg-muted text-text-tertiary transition-colors"
      aria-label="Toggle Sidebar"
    >
      <PanelLeft className="w-5 h-5" />
    </button>
  );
}
