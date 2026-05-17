import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string | null | undefined, fallback: string = "??"): string {
  if (!name) return fallback;
  
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalized.substring(0, 2).toUpperCase();
}
