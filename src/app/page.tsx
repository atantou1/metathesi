
import Link from "next/link"
import { ArrowRight, CheckCircle, Smartphone, BarChart3, Shield, Settings, Zap, Bookmark } from "lucide-react"

export default function Home() {
  return (
    <div className="font-display bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased overflow-x-hidden transition-colors duration-300">

      <main className="relative pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">

        {/* HERO SECTION */}
        <section className="text-center w-full max-w-4xl mx-auto mb-20 md:mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-sm font-semibold mb-6 animate-fade-in-up">
            <Zap className="w-4 h-4" />
            <span>The Future of Mutual Transfers</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white leading-[1.1]">
            Tame the <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-blue-600 dark:from-white dark:to-blue-500">Bureaucracy</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Find your perfect mutual transfer match instantly. Stop searching through forums and spreadsheets. One centralized, intelligent dashboard designed for public sector mobility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl transition-all duration-300">
                View Demo
              </button>
            </Link>
          </div>

          <div className="mt-16 relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-slate-50 to-blue-600/5 dark:from-blue-600/40 dark:via-slate-900 dark:to-blue-600/10 active:opacity-100"></div>
            {/* Placeholder for Hero Image */}
            <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-slate-400">Dashboard Preview Image</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg max-w-sm w-full transform translate-y-8 animate-slide-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Match Found!</h3>
                    <p className="text-xs text-slate-500">Teacher from Athens wants to swap.</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[85%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FLIP CARD SECTION */}
        <section className="w-full max-w-5xl mx-auto mb-24 md:mb-32 px-4" id="problem">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Flip the Script</h2>
            <p className="text-slate-500 dark:text-slate-400">Tap the card below to see how we change the narrative.</p>
          </div>

          {/* Note: This assumes you will add the 'flip-card' CSS to your globals.css or use a component */}
          <div className="group h-[400px] w-full max-w-md mx-auto perspective-1000 cursor-pointer">
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">The Chaos</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Endless forums, outdated lists, and uncertainty. You are losing opportunities every day to manual searching and unverified posts.
                </p>
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  Hover to Solve <Smartphone className="w-4 h-4" />
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 text-white rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-glow">
                <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">The Clarity</h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  A unified intelligence layer for your transfers. metaThesi filters the noise and surfaces only the matches that matter to your career.
                </p>
                <button className="px-6 py-2 bg-white text-blue-600 rounded-full font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors">
                  Claim Clarity
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="w-full max-w-4xl mx-auto mb-24 md:mb-32 relative" id="how-it-works">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 dark:text-white">How it Works</h2>
          </div>

          <div className="absolute left-[20px] md:left-1/2 top-32 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 md:translate-x-0 h-[80%] z-0"></div>

          <div className="space-y-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start md:items-center group">
              <div className="w-full md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 pl-12 md:pl-0 mt-2 md:mt-0">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create Profile</h3>
                <p className="text-slate-600 dark:text-slate-400">Securely sign up and define your current position using our government-aligned database.</p>
              </div>
              <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-900 shadow-lg group-hover:scale-110 transition-transform order-1 md:order-2">
                <span className="text-white text-sm font-bold">1</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start md:items-center group">
              <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-4 border-blue-600 shadow-lg group-hover:scale-110 transition-transform order-1 md:order-2">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div className="w-full md:w-1/2 md:pl-12 order-2 md:order-3 pl-12 md:pl-0 mt-2 md:mt-0 ml-auto">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Define Request</h3>
                <p className="text-slate-600 dark:text-slate-400">Set your intent. Choose what regions, cities, or specific positions you are looking for.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start md:items-center group">
              <div className="w-full md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 pl-12 md:pl-0 mt-2 md:mt-0">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Get Matched</h3>
                <p className="text-slate-600 dark:text-slate-400">Experience a curated feed. No ads, no distractions, just pure matches tailored to you.</p>
              </div>
              <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-900 shadow-lg group-hover:scale-110 transition-transform order-1 md:order-2">
                <span className="text-white text-sm font-bold">3</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="w-full max-w-7xl mx-auto mb-20" id="features">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Built for public servants who value their time and career progression.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Market Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Understand transfer trends. See which regions are high demand and how your specialty is moving.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Privacy First</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Your data stays yours. We don't share your intent until you match and approve connection.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Custom Filters</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Fine-tune your search. Include or exclude specific cities, schools, or departments.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Instant Notifications</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Get matched instantly. Real-time alerts via email or app when a compatible colleague appears.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Save & Watch</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Not ready? Save potential regions and watch their activity levels over time.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Verified Users</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                All profiles are verified against public sector records. Trust who you match with.
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full max-w-5xl mx-auto mb-12">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:24px_24px]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to find your match?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Join 10,000+ public servants who have already found their next position.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg">Get Started Free</button>
                </Link>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">Learn More</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">metaThesi</span>
            <span className="text-slate-400 text-sm">© 2024</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
