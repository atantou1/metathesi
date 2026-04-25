"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Users, 
    LogOut, 
    Settings,
    ShieldCheck,
    ChevronUp,
    MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Χρήστες", href: "/admin/users", icon: Users },
    { name: "Ρυθμίσεις", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { isOpen } = useSidebar();
    const { data: session } = useSession();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 260 : 64 }}
            className="flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 transition-all duration-300 ease-in-out z-50 shadow-sm overflow-hidden"
        >
            {/* Sidebar Header */}
            <div className="h-14 flex items-center px-4 shrink-0">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0369A1] flex items-center justify-center text-white shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    {isOpen && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-slate-900 dark:text-white tracking-tight"
                        >
                            Admin<span className="text-[#0369A1]">Panel</span>
                        </motion.span>
                    )}
                </Link>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative",
                                isActive 
                                    ? "bg-slate-100 dark:bg-slate-800 text-[#0369A1] font-semibold" 
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <item.icon className={cn(
                                "w-4.5 h-4.5 shrink-0",
                                isActive ? "text-[#0369A1]" : "text-slate-400 group-hover:text-slate-600 transition-colors"
                            )} />
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm truncate"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            {!isOpen && isActive && (
                                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#0369A1] rounded-r-full" />
                            )}
                        </Link>
                    )
                })}
            </div>

            {/* Sidebar Footer with User Info */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all outline-none",
                            !isOpen && "justify-center"
                        )}>
                            <Avatar className="w-8 h-8 rounded-lg shadow-sm">
                                <AvatarImage src={session?.user?.image || undefined} />
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">
                                    {session?.user?.name?.substring(0, 2).toUpperCase() || "AD"}
                                </AvatarFallback>
                            </Avatar>
                            {isOpen && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 text-left min-w-0"
                                >
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {session?.user?.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate">
                                        {session?.user?.email}
                                    </p>
                                </motion.div>
                            )}
                            {isOpen && <MoreHorizontal className="w-4 h-4 text-slate-400 shrink-0" />}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mb-2">
                        <DropdownMenuLabel>Ο Λογαριασμός μου</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/profile" className="cursor-pointer">Προφίλ</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings" className="cursor-pointer">Ρυθμίσεις</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            className="text-red-500 cursor-pointer focus:text-red-500"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Αποσύνδεση
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.aside>
    );
}
