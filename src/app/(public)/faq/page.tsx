import { FaqSection } from "@/components/home/faq-section";
import { faqs } from "@/lib/faqs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Συχνές Ερωτήσεις",
  description: "Βρείτε απαντήσεις σε όλες τις ερωτήσεις σας σχετικά με τις αμοιβαίες μεταθέσεις εκπαιδευτικών στο metaThesi.gr.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqSection background="bg-background" isPageTitle={true} />
    </div>
  );
}
