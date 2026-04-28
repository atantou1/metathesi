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
                <div className="flex h-screen overflow-hidden bg-background text-foreground">
                    {/* Sidebar Container */}
                    <AdminSidebar />
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-muted/30">
                        {/* Internal Header (Dashboard-01 Style) */}
                        <header className="h-14 flex items-center px-4 gap-4 shrink-0 transition-all border-b border-border bg-background">
                            <SidebarTrigger />
                            
                            <div className="h-4 w-px bg-muted dark:bg-muted" />
                            
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-sm">
                                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Admin
                                </Link>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                                <span className="font-semibold text-foreground">Dashboard</span>
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
