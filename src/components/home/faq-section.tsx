"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/faqs";

const FAQItem = ({ faq, isOpen, toggleOpen }: { faq: any; isOpen: boolean; toggleOpen: () => void }) => {
  return (
    <div className="border border-border rounded-2xl bg-surface transition-all duration-200 hover:bg-muted/30">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-[16px] p-[16px] text-left focus:outline-none rounded-2xl"
        onClick={toggleOpen}
      >
        <span className="text-[14px] font-medium leading-[20px] flex-1 text-foreground">
          {faq.question}
        </span>
        <span className="flex items-center flex-shrink-0 mt-[-2px]">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-[16px] pb-[16px] text-[14px] leading-[24px] text-muted-foreground">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export function FaqSection({ background = "bg-surface", isPageTitle = false }: { background?: string, isPageTitle?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={`${background} py-24 px-6`}>
      <div className="mx-auto max-w-[900px]">
        {/* Επικεφαλίδα */}
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="mb-4 text-[14px] font-medium uppercase tracking-[0.7px] leading-[20px] text-primary">
            Συχνες Ερωτησεις
          </p>
          {isPageTitle ? (
            <h1 className="mb-6 text-[32px] md:text-[48px] font-semibold tracking-tight text-foreground leading-tight md:leading-[48px] dark:text-white">
              Λύστε κάθε απορία σας
            </h1>
          ) : (
            <h2 className="mb-6 text-[32px] md:text-[48px] font-semibold tracking-tight text-foreground leading-tight md:leading-[48px] dark:text-white">
              Λύστε κάθε απορία σας
            </h2>
          )}
        </div>

        {/* FAQs List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={index === openIndex}
              toggleOpen={() => setOpenIndex(index === openIndex ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
