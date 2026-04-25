import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider } from "@/components/admin/sidebar-provider";
import { SidebarTrigger } from "@/components/admin/sidebar-trigger";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        redirect("/");
    }

    return (
        <SessionProvider session={session}>
            <SidebarProvider>
                <div className="flex h-screen overflow-hidden bg-white dark:bg-[#020617] font-display text-slate-900 dark:text-slate-100">
                    {/* Sidebar Container */}
                    <AdminSidebar />
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F8FAFC]/30 dark:bg-transparent">
                        {/* Internal Header (Dashboard-01 Style) */}
                        <header className="h-14 flex items-center px-4 gap-4 shrink-0 transition-all border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                            <SidebarTrigger />
                            
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                            
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-sm">
                                <Link href="/admin" className="text-slate-500 hover:text-slate-900 transition-colors">
                                    Admin
                                </Link>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                <span className="font-semibold text-slate-900 dark:text-white">Dashboard</span>
                            </nav>
                        </header>
                        
                        {/* Scrollable Scroll Area */}
                        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
                            <div className="max-w-7xl mx-auto space-y-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </SessionProvider>
    );
}
