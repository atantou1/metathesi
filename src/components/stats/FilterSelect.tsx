"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  fullWidth?: boolean;
  fontSize?: string;
  fontWeight?: string | number;
  padding?: string;
  background?: string;
  className?: string;
  multiline?: boolean;
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  fullWidth,
  fontSize,
  fontWeight,
  padding = "8px 16px",
  background, // No longer used as default hex
  className = "",
  multiline = false,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label = options.find((o) => o.value === value)?.label || placeholder || value;

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-full border border-border/40 bg-card/40 backdrop-blur-md text-foreground transition-all hover:bg-card/60 hover:shadow-soft cursor-pointer ${multiline ? 'whitespace-normal text-left' : 'whitespace-nowrap'} ${fullWidth ? 'w-full justify-between' : ''} ${className}`}
        style={{
          padding,
          fontSize,
          fontWeight,
        }}
      >
        <span className={multiline ? "" : "truncate"}>{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 z-[9999] min-w-[200px] max-h-[280px] overflow-y-auto bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-floating p-2 animate-in fade-in zoom-in duration-200"
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl text-[13px] font-medium transition-all border border-transparent ${
                  isSelected 
                    ? "bg-primary/10 text-primary border-primary/10" 
                    : "text-text-secondary hover:bg-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
