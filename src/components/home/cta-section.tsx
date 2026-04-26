"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-32 px-6 dark:bg-black font-sans">
      {/* Διακριτικό glow effect στο background για αίσθηση βάθους όπως στο Magic UI */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-lighten blur-[120px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-200 to-indigo-200 dark:from-sky-900/40 dark:to-indigo-900/40"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center text-center">
        {/* Υπότιτλος */}
        <h4 className="mb-4 text-[14px] font-medium uppercase tracking-[0.7px] leading-[20px] text-primary">
          Ετοιμοι να ξεκινησετε;
        </h4>

        {/* Κύριος Τίτλος */}
        <h2 className="mb-8 text-[48px] font-semibold tracking-tight text-foreground leading-[48px] dark:text-white">
          Γίνετε μέλος της κοινότητας σήμερα.
        </h2>

        {/* Επεξηγηματικό Κείμενο */}
        <p className="mb-10 mx-auto text-[18px] leading-[32px] text-text-tertiary dark:text-neutral-400 px-0 md:px-[104.5px] max-w-[800px]">
          Βρείτε άμεσα τη μετάθεση που ψάχνετε, ρυθμίστε τις προτιμήσεις σας και αφήστε τον αλγόριθμό μας να κάνει τη δουλειά για εσάς. Εντελώς δωρεάν για όλους τους εκπαιδευτικούς.
        </p>

        {/* Button */}
        <Link href="/signup">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              rocket_launch
            </span>
            Ξεκινήστε τώρα
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
