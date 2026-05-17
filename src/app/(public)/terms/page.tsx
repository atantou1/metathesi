import { Metadata } from "next";
import { Info, Building2, Scale, FileText, ShieldCheck, UserCheck, Lock, Globe, RefreshCw, Gavel } from "lucide-react";
import { SafeEmail } from "@/components/ui/safe-email";

export const metadata: Metadata = {
  title: "Όροι Χρήσης",
  description: "Παρακαλούμε διαβάστε προσεκτικά τους Όρους Χρήσης πριν χρησιμοποιήσετε την πλατφόρμα metaThesi.gr.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 flex flex-col items-center px-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Όροι Χρήσης
          </h1>
          <p className="text-sm font-medium text-text-tertiary uppercase tracking-widest">
            Τελευταία Ενημέρωση: 13 Απριλίου 2026
          </p>
        </div>

        {/* Content Container */}
        <div className="relative">
          {/* Decorative Background Element */}
          <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />

          <div className="space-y-12">
            {/* Introduction */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Info className="h-3 w-3 text-primary" />
              </div>
              <div className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Καλώς ήρθατε στο <span className="font-semibold text-foreground">metaThesi</span> (εφεξής "η Εφαρμογή"). Παρακαλούμε διαβάστε προσεκτικά τους παρακάτω Όρους Χρήσης πριν χρησιμοποιήσετε την πλατφόρμα.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Η χρήση της Εφαρμογής συνεπάγεται την πλήρη και ανεπιφύλακτη αποδοχή των παρόντων όρων.
                </p>
              </div>
            </section>



            {/* Ορισμοί */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Scale className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Ορισμοί</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-8 text-sm text-text-secondary">
                  <p>Για την ορθή κατανόηση των όρων, υιοθετούνται οι ορισμοί όπως αυτοί περιγράφονται στην Πολιτική Απορρήτου μας:</p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      { title: "Χρήστης", desc: "Το φυσικό πρόσωπο που δημιουργεί λογαριασμό στην Εφαρμογή." },
                      { title: "Επαγγελματικό Προφίλ", desc: "Η καταχώρηση των υπηρεσιακών στοιχείων (Κλάδος, Βαθμίδα, Ειδικότητα κ.λπ.)." },
                      { title: "Περιοχή", desc: "Η γεωγραφική/διοικητική μονάδα (Τρέχουσα και Επιθυμίας)." },
                      { title: "Αίτηση Μετάθεσης", desc: "Η ενεργή δήλωση προτίμησης του Χρήστη." },
                      { title: "Αντιστοίχηση", desc: "Η αυτοματοποιημένη εύρεση αμοιβαίας ή κυκλικής μετάθεσης." }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <p className="leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Περιγραφή Υπηρεσίας */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <FileText className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Περιγραφή Υπηρεσίας</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-6 text-sm text-text-secondary leading-relaxed">
                  <p>Το metaThesi λειτουργεί ως <span className="font-semibold text-foreground">αυτοματοποιημένος μεσολαβητής (broker)</span> και <span className="font-semibold text-foreground">Κέντρο Δεδομένων (Data Hub)</span>. Παρέχει στους Χρήστες τη δυνατότητα:</p>
                  <ul className="space-y-3 ml-4 list-disc marker:text-primary/40">
                    <li>Να δηλώνουν την επιθυμία τους για αμοιβαία μετάθεση.</li>
                    <li>Να εντοπίζουν αυτοματοποιημένα άλλους Χρήστες για Άμεση ή Κυκλική Αντιστοίχηση.</li>
                    <li>Να επικοινωνούν μέσω απομονωμένου συστήματος συνομιλίας (Chat) όταν προκύψει Αντιστοήχηση.</li>
                    <li>Να έχουν πρόσβαση σε αναλυτικά στατιστικά στοιχεία και διαδραστικούς χάρτες σχετικά με τις μεταθέσεις στον δημόσιο τομέα.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Πηγή Δεδομένων Στατιστικών */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Globe className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Πηγή Δεδομένων Στατιστικών & Αποποίηση Ευθύνης</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-8 text-sm text-text-secondary leading-relaxed">
                  <p>Η Εφαρμογή παρέχει στατιστικά στοιχεία (Data Analytics), ιστορικά δεδομένα βάσεων και απεικονίσεις ζήτησης/προσφοράς.</p>
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-bold text-foreground">Προέλευση</h3>
                        <p className="ml-4">Τα δεδομένα αυτά συλλέγονται από δημόσια προσβάσιμες πηγές, όπως το πρόγραμμα <strong>"Διαύγεια"</strong>, ανακοινώσεις των εκάστοτε <strong>Διευθύνσεων</strong>, καθώς και από ανωνυμοποιημένα στοιχεία που παραθέτουν εθελοντικά χρήστες στο διαδίκτυο.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-foreground">Ακρίβεια</h3>
                        <p className="ml-4">Παρόλο που καταβάλλεται κάθε προσπάθεια για την ορθότητα των στοιχείων, τα στατιστικά παρέχονται "ως έχουν" και για ενημερωτικούς σκοπούς. Η Εφαρμογή <strong>δεν εγγυάται</strong> την ακρίβεια των επίσημων βάσεων ή την εγκυρότητα των πινάκων που δημοσιεύονται από τρίτους και δεν φέρει ευθύνη για τυχόν διοικητικές αποφάσεις που βασίζονται σε αυτά τα στοιχεία.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Υποχρεώσεις και Ευθύνη Χρήστη */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <UserCheck className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Υποχρεώσεις και Ευθύνη Χρήστη</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-6 text-sm text-text-secondary leading-relaxed">
                  <div className="space-y-2">
                      <h3 className="font-bold text-foreground">Ακρίβεια Στοιχείων</h3>
                      <p className="ml-4">Ο Χρήστης οφείλει να δηλώνει αληθή και ακριβή υπηρεσιακά στοιχεία στο Επαγγελματικό του Προφίλ. Η σκόπιμη εισαγωγή ψευδών στοιχείων που παραπλανούν τον αλγόριθμο Αντιστοίχησης μπορεί να οδηγήσει σε προσωρινή ή μόνιμη διακοπή πρόσβασης (Ban).</p>
                  </div>
                  <div className="space-y-2">
                      <h3 className="font-bold text-foreground">Χρήση Λογαριασμού</h3>
                      <p className="ml-4">Ο Χρήστης είναι υπεύθυνος για τη διατήρηση της μυστικότητας του κωδικού πρόσβασής του.</p>
                  </div>
                  <div className="space-y-2">
                      <h3 className="font-bold text-foreground">Κανόνες Επικοινωνίας</h3>
                      <p className="ml-4">Κατά τη χρήση του In-App Chat, οι Συμμετέχοντες οφείλουν να τηρούν τους κανόνες δεοντολογίας και ευπρέπειας. Απαγορεύεται η χρήση υβριστικού, απειλητικού ή παράνομου περιεχομένου.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Ασφάλεια */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <ShieldCheck className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Ασφάλεια και Προστασία από Κακόβουλη Χρήση</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-6 text-sm text-text-secondary leading-relaxed">
                  <p>Η Εφαρμογή εφαρμόζει αυστηρά τεχνικά μέτρα ασφαλείας:</p>
                  <ul className="space-y-4 ml-4 list-disc marker:text-primary/40">
                    <li><span className="font-bold text-foreground">Cloudflare Turnstile:</span> Χρησιμοποιούμε την υπηρεσία Turnstile για την προστασία από αυτοματοποιημένες επιθέσεις (bots) και spam κατά την είσοδο ή την εγγραφή στην πλατφόρμα.</li>
                    <li><span className="font-bold text-foreground">Περιορισμοί:</span> Εφαρμόζεται τεχνολογία Rate-Limiting και καταγραφή Login Attempts για την αποτροπή επιθέσεων brute-force.</li>
                    <li><span className="font-bold text-foreground">Διαγραφή:</span> Ο Χρήστης έχει το δικαίωμα διαγραφής του λογαριασμού του ανά πάσα στιγμή, γεγονός που συνεπάγεται την οριστική διαγραφή των προσωπικών του δεδομένων.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Περιορισμός Ευθύνης Παρόχου */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Lock className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Περιορισμός Ευθύνης Παρόχου</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-4 text-sm text-text-secondary leading-relaxed">
                  <ul className="space-y-3 ml-4 list-disc marker:text-primary/40">
                    <li>Η Εφαρμογή είναι ένα εργαλείο <strong>διευκόλυνσης</strong> και <strong>ενημέρωσης</strong>. Η πραγματοποίηση μιας μετάθεσης εξαρτάται αποκλειστικά από τις επίσημες διαδικασίες των αρμόδιων δημόσιων φορέων και υπουργείων.</li>
                    <li>Η Εφαρμογή δεν φέρει ευθύνη για οποιαδήποτε διακοπή λειτουργίας λόγω τεχνικών προβλημάτων ή συντήρησης, ούτε για τυχόν απώλεια δεδομένων από γεγονότα ανωτέρας βίας.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Πνευματική Ιδιοκτησία */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <FileText className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Πνευματική Ιδιοκτησία</h2>
                </div>
                <div className="p-6 sm:p-8 text-sm text-text-secondary leading-relaxed">
                  <p>Το περιεχόμενο, το λογότυπο, ο κώδικας και η σχεδίαση του metaThesi αποτελούν πνευματική ιδιοκτησία του παρόχου. Απαγορεύεται η αναπαραγωγή, η εξόρυξη δεδομένων (data scraping) ή η εμπορική εκμετάλλευση της πλατφόρμας χωρίς έγγραφη άδεια.</p>
                </div>
              </div>
            </section>

            {/* Τροποποίηση Όρων */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <RefreshCw className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Τροποποίηση Όρων</h2>
                </div>
                <div className="p-6 sm:p-8 text-sm text-text-secondary leading-relaxed">
                  <p>Διατηρούμε το δικαίωμα να τροποποιούμε τους παρόντες όρους προκειμένου να ανταποκρίνονται σε νέες λειτουργίες ή νομικές απαιτήσεις. Οι Χρήστες θα ενημερώνονται για σημαντικές αλλαγές μέσω της Εφαρμογής ή μέσω email.</p>
                </div>
              </div>
            </section>

            {/* Εφαρμοστέο Δίκαιο */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Gavel className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Εφαρμοστέο Δίκαιο</h2>
                </div>
                <div className="p-6 sm:p-8 text-sm text-text-secondary leading-relaxed">
                  <p>Οι παρόντες όροι διέπονται από το Ελληνικό Δίκαιο και για οποιαδήποτε διαφορά προκύψει, αρμόδια είναι τα δικαστήρια των Σερρών.</p>
                </div>
              </div>
            </section>

            {/* Στοιχεία Παρόχου */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Building2 className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Στοιχεία Παρόχου</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-6 text-sm text-text-secondary">
                  <p>Η Εφαρμογή ανήκει και τελεί υπό τη διαχείριση του:</p>
                  <ul className="space-y-4 ml-4">
                    <li className="space-y-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-text-quaternary">Ονοματεπώνυμο</span>
                      <span className="text-foreground">Ατλάσης Αντώνιος</span>
                    </li>
                    <li className="space-y-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-text-quaternary">Έδρα</span>
                      <span className="text-foreground">Εξοχών, 62100 Σέρρες, Ελλάδα</span>
                    </li>
                    <li className="space-y-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-text-quaternary">Email Επικοινωνίας</span>
                      <SafeEmail user="privacy" domain="metathesi.gr" />
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
