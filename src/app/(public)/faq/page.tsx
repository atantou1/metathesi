import { FaqSection } from "@/components/home/faq-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Συχνές Ερωτήσεις | metaThesi",
  description: "Βρείτε απαντήσεις σε όλες τις ερωτήσεις σας σχετικά με τις αμοιβαίες μεταθέσεις εκπαιδευτικών στο metaThesi.gr.",
};

export default function FAQPage() {
  return (
    <div className="pt-20">
      <FaqSection background="bg-background" />
    </div>
  );
}
