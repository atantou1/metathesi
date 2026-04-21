import Link from "next/link";
import { HeroMap } from "@/components/home/hero-map";

export default function Home() {
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
                <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Νέα ψηφιακή πλατφόρμα.{" "}
                  <Link href="/signup" className="font-semibold text-indigo-600">
                    <span aria-hidden="true" className="absolute inset-0" />
                    Read more <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                  Βάλε την αναζήτηση στον αυτόματο πιλότο
                </h1>
                <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                  Το Ψηφιακό Κέντρο Αμοιβαίων Μεταθέσεων. Ξέχνα το χάος των
                  ομάδων στο Viber και το Facebook. Βρες τη μετάθεση που
                  ψάχνεις, έξυπνα και γρήγορα.
                </p>
                <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                  <Link
                    href="/signup"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                  <a href="#how-it-works" className="text-sm/6 font-semibold text-gray-900">
                    Learn more <span aria-hidden="true">→</span>
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

        {/* Bottom Gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>


      {/* How it Works Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Πώς λειτουργεί</h4>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl text-balance">Απλοποιήστε τη διαδικασία μετάθεσής σας</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">Τρία απλά βήματα για να βρείτε την επόμενη επαγγελματική σας στέγη χωρίς περιττές καθυστερήσεις.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group flex flex-col items-center rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center transition-all hover:bg-white hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <span className="material-symbols-outlined text-3xl">account_circle</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">1. Δημιούργησε το Προφίλ σου</h3>
              <p className="text-slate-600">Εισάγετε τα στοιχεία της τρέχουσας θέσης σας και την ειδικότητά σας εύκολα και γρήγορα.</p>
            </div>
            {/* Step 2 */}
            <div className="group flex flex-col items-center rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center transition-all hover:bg-white hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <span className="material-symbols-outlined text-3xl">map</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">2. Δήλωσε Επιθυμία</h3>
              <p className="text-slate-600">Επιλέξτε τις περιοχές ή τους φορείς που σας ενδιαφέρουν για την αμοιβαία μετάθεση.</p>
            </div>
            {/* Step 3 */}
            <div className="group flex flex-col items-center rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center transition-all hover:bg-white hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <span className="material-symbols-outlined text-3xl">notifications_active</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">3. Λάβε Ειδοποίηση</h3>
              <p className="text-slate-600">Μόλις βρεθεί συμβατότητα με άλλον χρήστη, θα ενημερωθείτε αμέσως στο κινητό σας.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Connectivity CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 md:px-20 md:py-24">
            {/* Abstract Pattern Background */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="mb-6 text-3xl font-black text-white md:text-5xl">Έτοιμοι για το επόμενο βήμα;</h2>
              <p className="mb-10 max-w-2xl text-lg text-primary-100 text-white/90">
                Γίνετε μέλος της μεγαλύτερης κοινότητας αμοιβαίων μεταθέσεων στην Ελλάδα και βρείτε τη λύση που ψάχνετε σήμερα.
              </p>
              <Link href="/signup">
                <button className="rounded-2xl bg-white px-10 py-4 text-lg font-bold text-primary shadow-xl hover:bg-slate-50 hover:scale-105 transition-all">
                  Ξεκίνα Δωρεάν
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-12 bg-background-light">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-black text-primary">1.200+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Εγγεγραμμένοι</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary">850+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Ενεργές Αιτήσεις</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary">420</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Επιτυχή Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary">100%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Εχεμύθεια</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
