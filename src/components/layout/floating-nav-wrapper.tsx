"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface NavContextType {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function useNav() {
    const context = useContext(NavContext);
    if (!context) throw new Error("useNav must be used within FloatingNavWrapper");
    return context;
}

export function FloatingNavWrapper({ children }: { children: ReactNode }) {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <NavContext.Provider value={{ isOpen, setIsOpen }}>
            <div className={cn(
                "fixed top-0 inset-x-0 w-full flex justify-center z-50 transition-all duration-500",
                isOpen ? "pt-0 px-0 h-screen" : "pt-2 px-4 pointer-events-none"
            )}>
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ 
                        y: 0, 
                        opacity: 1,
                        height: isOpen ? "100vh" : "auto",
                        maxWidth: isOpen ? "100%" : "80rem", // 7xl is 80rem
                        borderRadius: isOpen ? "0px" : "2rem", // 4xl is 2rem
                    }}
                    transition={{ 
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                        height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                    }}
                    className={cn(
                        "w-full pointer-events-auto transition-all duration-300 relative overflow-hidden",
                        isOpen
                            ? "bg-white dark:bg-card border-none shadow-none"
                            : scrolled
                                ? "bg-white/40 dark:bg-card/40 backdrop-blur-md shadow-soft border border-white/20 dark:border-border/50"
                                : "bg-white/30 dark:bg-card/30 backdrop-blur-sm shadow-ambient border border-white/10 dark:border-border/30"
                    )}
                >
                    {children}
                </motion.nav>
            </div>
        </NavContext.Provider>
    );
}
