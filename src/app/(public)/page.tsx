"use client";

import Link from "next/link";
import { HeroMap } from "@/components/home/hero-map";
import { FeaturesSection } from "@/components/home/features-section";
import { StatsBentoSection } from "@/components/home/stats-bento-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";

export default function Home() {
  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("how-it-works");
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Background Gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* Main Grid/Flex Container (Μειωμένο Top Padding) */}
        <div className="mx-auto max-w-7xl pt-16 pb-32 sm:pt-24 sm:pb-48 lg:pt-28 lg:pb-56 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Αριστερή στήλη (2/3): Κείμενα */}
          <div className="w-full lg:w-2/3 relative z-10">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <div className="hidden sm:mb-8 sm:flex sm:justify-start">
                <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-white/10 hover:ring-gray-900/20 dark:hover:ring-white/20">
                  Νέα ψηφιακή πλατφόρμα.
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                  Βάλε την αναζήτηση στον αυτόματο πιλότο
                </h1>
                <p className="mt-8 text-pretty text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
                  Το Ψηφιακό Κέντρο Αμοιβαίων Μεταθέσεων. Ξέχνα το χάος των
                  ομάδων στο Viber και το Facebook. Βρες τη μετάθεση που
                  ψάχνεις, έξυπνα και γρήγορα.
                </p>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                  <Link
                    href="/signup"
                    className="rounded-2xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Ξεκίνα τώρα
                  </Link>
                  <a
                    href="#how-it-works"
                    onClick={scrollToHowItWorks}
                    className="text-sm/6 font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    Περισσότερα <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Δεξιά στήλη (1/3): Ο Dotted Map (Μειωμένο αρνητικό margin) */}
          <div className="w-full lg:w-1/3 flex justify-center lg:justify-end lg:-mt-16 relative z-0 pointer-events-none">
            <HeroMap />
          </div>
        </div>

      </div>


      {/* How it Works Section */}
      <section id="how-it-works" className="scroll-mt-20">
        <FeaturesSection />
      </section>

      {/* Stats Bento Section */}
      <StatsBentoSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Final CTA Section */}
      <CtaSection />
    </>
  );
}
