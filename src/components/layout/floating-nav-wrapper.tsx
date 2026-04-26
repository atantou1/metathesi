"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function FloatingNavWrapper({ children }: { children: ReactNode }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 inset-x-0 w-full flex justify-center z-50 pt-2 px-4 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "w-full max-w-7xl pointer-events-auto rounded-4xl transition-all duration-300",
                    scrolled
                        ? "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-lg border border-white/20 dark:border-slate-800/50"
                        : "bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm shadow-sm border border-white/10 dark:border-slate-800/30"
                )}
            >
                {children}
            </motion.nav>
        </div>
    );
}
