"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Τι ακριβώς είναι το metathesi.gr;",
    answer:
      "Το metathesi.gr είναι η πρώτη ολοκληρωμένη πλατφόρμα στην Ελλάδα που συνδέει άμεσα εκπαιδευτικούς Πρωτοβάθμιας και Δευτεροβάθμιας εκπαίδευσης για την εξεύρεση αμοιβαίων μεταθέσεων, καταργώντας την ανάγκη αναζήτησης σε αχανείς ομάδες κοινωνικών δικτύων.",
  },
  {
    question: "Πόσο κοστίζει η χρήση της πλατφόρμας;",
    answer:
      "Η βασική χρήση της πλατφόρμας για τη δημιουργία αίτησης και τον εντοπισμό matches είναι εντελώς δωρεάν για όλους τους εκπαιδευτικούς.",
  },
  {
    question: "Πόσο σύντομα μπορώ να βρω match για την περιοχή μου;",
    answer:
      "Ο χρόνος εντοπισμού διαφέρει ανάλογα με την ειδικότητα, τη βαθμίδα και τη ζήτηση των περιοχών. Ο αλγόριθμός μας λειτουργεί σε πραγματικό χρόνο 24/7, οπότε μόλις κάποιος εκπαιδευτικός με τα κατάλληλα κριτήρια εγγραφεί, θα ενημερωθείτε αμέσως.",
  },
  {
    question: "Είναι τα προσωπικά μου δεδομένα ασφαλή;",
    answer:
      "Απόλυτα. Υιοθετούμε αυστηρές πρακτικές κρυπτογράφησης και Privacy by Design. Κανείς δεν έχει πρόσβαση στα προσωπικά σας στοιχεία μέχρι να προκύψει αποδεδειγμένο match και να ανοίξει το ασφαλές κανάλι επικοινωνίας.",
  },
  {
    question: "Ποια είναι η διαφορά από τις σελίδες και ομάδες στο Facebook;",
    answer:
      "Αντί να ψάχνετε χειροκίνητα ανάμεσα σε εκατοντάδες άσχετες αναρτήσεις, το metathesi.gr κάνει αυτόματα τη σύγκριση. Αναλύει την ειδικότητα, τη βαθμίδα και τις πολλαπλές περιοχές προτίμησης και σας ειδοποιεί μόνο όταν υπάρχει πραγματικό, αμοιβαίο ταίριασμα.",
  },
  {
    question: "Μπορώ να αλλάξω τις προτιμήσεις μου μετά την υποβολή;",
    answer:
      "Βεβαίως! Μπορείτε να επεξεργαστείτε, να προσθέσετε ή να αφαιρέσετε περιοχές προτίμησης όποτε το επιθυμείτε μέσα από το προσωπικό σας Dashboard. Ο αλγόριθμος θα ενημερώσει αμέσως τις αναζητήσεις σας.",
  },
  {
    question: "Πώς ειδοποιούμαι όταν βρεθεί ταίριασμα;",
    answer:
      "Θα λάβετε άμεση ειδοποίηση μέσω email στη διεύθυνση που έχετε δηλώσει. Εφόσον το επιλέξετε, μπορείτε να λαμβάνετε ειδοποιήσεις και μέσω του Dashboard της εφαρμογής, ή ακόμα και μέσω SMS/Viber για Premium χρήστες.",
  },
  {
    question: "Μπορώ να συμμετέχω αν είμαι εκπαιδευτικός ειδικής αγωγής;",
    answer:
      "Ναι, η πλατφόρμα καλύπτει όλες τις κατηγορίες και δομές (Γενική και Ειδική Αγωγή), σεβόμενη τη νομοθεσία για τις αμοιβαίες μεταθέσεις που απαιτεί αντιστοιχία κλάδου και τύπου σχολείου.",
  },
  {
    question: "Τι είναι η Ανάλυση Δημοτικότητας στα Στατιστικά;",
    answer:
      "Είναι ένα εργαλείο που χρησιμοποιεί τα δεδομένα του Υπουργείου και τις τρέχουσες αιτήσεις στο metathesi.gr για να σας δείξει ποιες περιοχές έχουν την μεγαλύτερη ζήτηση (ως 1η προτίμηση) στην ειδικότητά σας.",
  },
  {
    question: "Τι γίνεται αν ακυρωθεί η αμοιβαία μετάθεση από την άλλη πλευρά;",
    answer:
      "Αν για οποιοδήποτε λόγο ο άλλος εκπαιδευτικός ακυρώσει τη διαδικασία, το match απενεργοποιείται και η αίτησή σας επιστρέφει αυτόματα στο pool αναζήτησης για να βρεθεί το επόμενο διαθέσιμο ταίριασμα, χωρίς να χάσετε καθόλου χρόνο.",
  },
];

const FAQItem = ({ faq, isOpen, toggleOpen }: { faq: any; isOpen: boolean; toggleOpen: () => void }) => {
  return (
    <div className={`border border-slate-200 rounded-[8px] transition-all duration-200 ${isOpen ? "bg-slate-50/50 border-sky-200 shadow-sm" : "bg-white hover:bg-slate-50"}`}>
      <button
        type="button"
        className="flex w-full items-start justify-between gap-[16px] p-[16px] text-left focus:outline-none rounded-[8px]"
        onClick={toggleOpen}
      >
        <span className={`text-[14px] font-medium leading-[20px] flex-1 transition-colors ${isOpen ? "text-[#0369a1]" : "text-slate-900"}`}>
          {faq.question}
        </span>
        <span className="flex items-center flex-shrink-0 mt-[-2px]">
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`material-symbols-outlined text-[20px] transition-colors ${isOpen ? "text-[#0369a1]" : "text-slate-400"}`}
          >
            expand_more
          </motion.span>
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
            <p className="px-[16px] pb-[16px] text-[14px] leading-[24px] text-slate-600">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24 px-6 dark:bg-black font-sans">
      <div className="mx-auto max-w-[900px]">
        {/* Επικεφαλίδα */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h4 className="mb-4 text-[14px] font-medium uppercase tracking-[0.7px] leading-[20px] text-[#0369a1]">
            Συχνες Ερωτησεις
          </h4>
          <h2 className="mb-6 text-[48px] font-semibold tracking-tight text-neutral-900 leading-[48px] dark:text-white">
            Λύστε κάθε απορία σας
          </h2>
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
