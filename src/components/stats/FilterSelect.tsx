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
  background = "rgba(255,255,255,0.35)",
  className = "",
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
    <div ref={containerRef} className="relative inline-block" style={fullWidth ? { width: "100%" } : {}}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`transition-all ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: padding,
          background: background,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "9999px",
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: "#0f172a",
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s",
          ...(fullWidth ? { width: "100%", justifyContent: "space-between" } : {}),
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.5)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = background;
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
        }}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className="transition-transform duration-200"
          style={{
            width: "14px",
            height: "14px",
            color: "#64748b",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 9999,
            minWidth: "200px",
            maxHeight: "280px",
            overflowY: "auto",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(226,232,240,0.8)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            padding: "8px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 500,
                background: value === opt.value ? "rgba(3, 105, 161, 0.08)" : "transparent",
                color: value === opt.value ? "#0369a1" : "#334155",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  value === opt.value ? "rgba(3, 105, 161, 0.08)" : "transparent";
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
