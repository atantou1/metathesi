"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SafeEmailProps {
  user: string;
  domain: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * A component to protect email addresses from simple bot scraping.
 * It reconstructs the email address on the client side.
 */
export function SafeEmail({ user, domain, className }: SafeEmailProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Reconstruct email only on client side
    setEmail(`${user}@${domain}`);
  }, [user, domain]);

  if (!email) {
    // Fallback/Loading state that bots will see in SSR
    return (
      <span className={cn("inline-block opacity-50", className)}>
        {user} [at] {domain.replace(".", " [dot] ")}
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className={cn("text-primary hover:underline transition-colors", className)}
    >
      {email}
    </a>
  );
}
