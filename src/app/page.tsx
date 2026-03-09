import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <span className="mr-2 flex h-2 w-2 rounded-full bg-primary"></span>
                Νέα ψηφιακή πλατφόρμα
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl text-balance">
                  Βάλε την αναζήτηση στον <span className="text-primary">αυτόματο πιλότο</span>
                </h1>
                <p className="text-lg leading-relaxed text-slate-600 md:text-xl max-w-xl">
                  Το Ψηφιακό Κέντρο Αμοιβαίων Μεταθέσεων. Ξέχνα το χάος των ομάδων στο Viber και το Facebook. Βρες τη μετάθεση που ψάχνεις, έξυπνα και γρήγορα.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <button className="rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/25 hover:scale-105 transition-transform w-full sm:w-auto">
                    Ξεκίνα Δωρεάν
                  </button>
                </Link>
                <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto">
                  <span className="material-symbols-outlined">play_circle</span>
                  Δες πώς δουλεύει
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2 relative w-20 h-8">
                  <div className="absolute left-0 h-8 w-8 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="absolute left-4 h-8 w-8 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="absolute left-8 h-8 w-8 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <span>Ήδη 500+ δημόσιοι υπάλληλοι βρήκαν τη λύση τους</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl"></div>
              <div
                className="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-2xl"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5omOm3Dq40TZjIveihaWnuwzwdQUg0GIixUXniHQryiD_AvdiDRoFKTk93PNSDEXgYDNOvb1NjLl2_ntRWALfRCbrHHfscMN7aA3zOwaLLKwgczWPhDUyLwHyMVkxPbb-D6RSUPohAzV4GBy_Uwz4SoVipraEt9zK_9XSltpPS41lk1aU6Wvlsz4CCZcfXsuBEndLnYhK0lhtYD9FypUALfltgw9CBRZ8fckSwp0wmVux5mIsr3iiotu_9TWXHEwNMycbKbMNjqs")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          </div>
        </div>
      </header>

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
