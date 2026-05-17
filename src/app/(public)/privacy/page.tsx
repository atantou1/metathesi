import { Metadata } from "next";
import { Lock, Eye, FileText, UserCheck, RefreshCw, Mail, MapPin, Building2, Scale, Info, Database, Share2, Clock, Trash2, CheckCircle2, Users } from "lucide-react";
import { SafeEmail } from "@/components/ui/safe-email";

export const metadata: Metadata = {
  title: "Πολιτική Απορρήτου",
  description: "Η παρούσα Πολιτική Απορρήτου περιγράφει πώς το metaThesi συλλέγει, χρησιμοποιεί, διατηρεί και προστατεύει τα προσωπικά σας δεδομένα.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20 flex flex-col items-center px-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Πολιτική Απορρήτου
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
                  Η παρούσα Πολιτική Απορρήτου περιγράφει πώς το <span className="font-semibold text-foreground">metaThesi</span> (εφεξής "η Εφαρμογή", "εμείς", "μας") συλλέγει, χρησιμοποιεί, διατηρεί και προστατεύει τα προσωπικά σας δεδομένα. Η Εφαρμογή λειτουργεί ως αυτοματοποιημένος μεσολαβητής για την εύρεση αμοιβαίων μεταθέσεων στον Δημόσιο Τομέα.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Ο σεβασμός της ιδιωτικότητάς σας και η συμμόρφωση με τον Γενικό Κανονισμό για την Προστασία Δεδομένων (GDPR - ΕΕ 2016/679) αποτελεί βασική αρχή του σχεδιασμού μας.
                </p>
              </div>
            </section>



            {/* 2. Ορισμοί Βασικών Εννοιών */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Scale className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Ορισμοί Βασικών Εννοιών</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-8 text-sm text-text-secondary">
                  <p>Για την καλύτερη κατανόηση της παρούσας Πολιτικής, οι παρακάτω όροι που χρησιμοποιούνται στην Εφαρμογή έχουν την εξής έννοια:</p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      { title: "Χρήστης", desc: "Το φυσικό πρόσωπο που δημιουργεί λογαριασμό στην Εφαρμογή, χρησιμοποιώντας το email και τον κωδικό πρόσβασής του." },
                      { title: "Επαγγελματικό Προφίλ", desc: "Η ψηφιακή καταχώρηση που δημιουργεί ο Χρήστης εντός του λογαριασμού του, η οποία περιλαμβάνει τα υπηρεσιακά του στοιχεία (Κλάδος, Βαθμίδα, Ειδικότητα, Έτη Υπηρεσίας). Ένας Χρήστης έχει ένα Προφίλ." },
                      { title: "Περιοχή", desc: "Η γεωγραφική ή διοικητική περιοχή τοποθέτησης/υπηρέτησης (π.χ. Διεύθυνση Εκπαίδευσης). Χωρίζεται σε Τρέχουσα Περιοχή, όπου υπηρετεί τώρα ο Χρήστης, και σε Περιοχές Επιθυμίας, όπου επιθυμεί να μετατεθεί." },
                      { title: "Αίτηση Μετάθεσης", desc: "Η μοναδική, ενεργή δήλωση του Προφίλ που συνδέει την Τρέχουσα Περιοχή με τις Περιοχές Επιθυμίας. Κάθε Προφίλ μπορεί να έχει μόνο μία ενεργή Αίτηση κάθε χρονική στιγμή." },
                      { title: "Αντιστοίχηση", desc: "Η επιτυχής, αυτοματοποιημένη συσχέτιση δύο ή περισσότερων Αιτήσεων Μετάθεσης από τον αλγόριθμο της Εφαρμογής. Διακρίνεται σε Άμεσο (δύο χρήστες ανταλλάσσουν θέσεις) ή Κυκλικό (αλυσίδα τριών ή περισσότερων χρηστών)." },
                      { title: "Συμμετέχοντες", desc: "Τα Προφίλ που εμπλέκονται σε μια επιτυχή Αντιστοίχηση. Μόνο οι Συμμετέχοντες αποκτούν δικαίωμα πρόσβασης στο κοινό, απομονωμένο δωμάτιο συνομιλίας της εκάστοτε αντιστοίχησης." }
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

            {/* 3. Ποια Δεδομένα Συλλέγουμε */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Database className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Ποια Δεδομένα Συλλέγουμε</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-8 text-sm text-text-secondary">
                  <p>Για την παροχή των υπηρεσιών μας, συλλέγουμε και επεξεργαζόμαστε τα ακόλουθα δεδομένα, όπως αυτά αποθηκεύονται με ασφάλεια στη βάση δεδομένων μας:</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-foreground mb-3">Δεδομένα Λογαριασμού</h3>
                      <ul className="space-y-2 ml-4 list-disc marker:text-primary/40">
                        <li>Όνομα.</li>
                        <li>Διεύθυνση ηλεκτρονικού ταχυδρομείου.</li>
                        <li>Κρυπτογραφημένος κωδικός πρόσβασης (τα passwords αποθηκεύονται αποκλειστικά ως bcrypt hashes).</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground mb-3">Επαγγελματικό Προφίλ & Υπηρεσιακή Κατάσταση</h3>
                      <ul className="space-y-2 ml-4 list-disc marker:text-primary/40">
                        <li>Κλάδος, Βαθμίδα και Ειδικότητα.</li>
                        <li>Συνολικός χρόνος υπηρεσίας (Έτη, Μήνες, Ημέρες) και Ημερομηνία Πρόσληψης.</li>
                        <li>Οργανική θέση / Τρέχουσα Ζώνη Υπηρέτησης (Origin Zone).</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground mb-3">Δεδομένα Αίτησης Μετάθεσης</h3>
                      <ul className="space-y-2 ml-4 list-disc marker:text-primary/40">
                        <li>Οι περιοχές στις οποίες επιθυμείτε να μετατεθείτε, με σειρά προτεραιότητας.</li>
                        <li>Το ιστορικό και η κατάσταση των αιτήσεών σας (ενεργή/ανενεργή).</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground mb-3">Δεδομένα Επικοινωνίας (In-App Chat)</h3>
                      <p className="leading-relaxed ml-4">Το περιεχόμενο των μηνυμάτων που ανταλλάσσετε με άλλους χρήστες εντός της Εφαρμογής, <strong>αποκλειστικά</strong> όταν έχει προκύψει ενεργή αντιστοίχιση.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground mb-3">Τεχνικά Δεδομένα & Ασφάλεια</h3>
                      <ul className="space-y-2 ml-4 list-disc marker:text-primary/40">
                        <li>Δεδομένα συνεδρίας και καταγραφή προσπαθειών σύνδεσης για την αποτροπή κακόβουλων επιθέσεων.</li>
                        <li>Αρχεία καταγραφής για περιπτώσεις παραβίασης των όρων χρήσης.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Σκοπός και Νομική Βάση */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <FileText className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Σκοπός και Νομική Βάση Επεξεργασίας</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-8 text-sm text-text-secondary">
                  <p>Επεξεργαζόμαστε τα δεδομένα σας αποκλειστικά για τους παρακάτω σκοπούς:</p>
                  
                  <div className="space-y-8">
                    <div className="space-y-3">
                        <h3 className="font-bold text-foreground">Εκτέλεση Σύμβασης (Άρθρο 6(1)(β) GDPR)</h3>
                        <ul className="space-y-2 list-disc ml-4 marker:text-primary/40">
                          <li>Η λειτουργία του Αλγορίθμου Ταυτοποίησης για την εύρεση άμεσων ή κυκλικών μεταθέσεων βάσει της Ειδικότητας και των περιοχών ενδιαφέροντός σας.</li>
                          <li>Η διευκόλυνση της μεταξύ σας επικοινωνίας (Chat) όταν προκύψει επιτυχής αντιστοίχηση.</li>
                          <li>Η αποστολή ειδοποιήσεων (In-App και Email) για την πορεία της αίτησής σας.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-foreground">Έννομο Συμφέρον (Άρθρο 6(1)(στ) GDPR)</h3>
                        <ul className="space-y-2 list-disc ml-4 marker:text-primary/40">
                          <li>Η παραγωγή <em>πλήρως ανωνυμοποιημένων</em> στατιστικών δεδομένων (Data Analytics, διαδραστικοί χάρτες, τάσεις βάσεων) για την ενημέρωση του συνόλου των χρηστών.</li>
                          <li>Η διασφάλιση της ορθής λειτουργίας, της ασφάλειας των συστημάτων μας (rate limiting) και η αποτροπή απάτης.</li>
                        </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Με Ποιους Μοιραζόμαστε τα Δεδομένα */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Share2 className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Με Ποιους Μοιραζόμαστε τα Δεδομένα σας</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-6 text-sm text-text-secondary">
                  <p>Δεν πωλούμε και δεν εμπορευόμαστε τα προσωπικά σας δεδομένα. Η πρόσβαση σε αυτά επιτρέπεται μόνο σε:</p>
                  <ul className="space-y-8">
                    <li className="space-y-2">
                        <h3 className="font-bold text-foreground">Άλλοι Χρήστες της Εφαρμογής</h3>
                        <p className="leading-relaxed ml-4">Μόνο οι χρήστες με τους οποίους έχετε δημιουργήσει μια αντιστοίχηση έχουν πρόσβαση στο ονοματεπώνυμο, την ειδικότητα, την τρέχουσα θέση σας και το ιστορικό μηνυμάτων της συγκεκριμένης συνομιλίας.</p>
                    </li>
                    <li className="space-y-4">
                        <h3 className="font-bold text-foreground">Πάροχοι Υπηρεσιών (Εκτελούντες την Επεξεργασία)</h3>
                        <p className="leading-relaxed ml-4">Χρησιμοποιούμε έμπιστους τρίτους παρόχους που λειτουργούν αυστηρά με βάση τις οδηγίες μας. Συγκεκριμένα:</p>
                        <div className="grid gap-3 sm:grid-cols-3 ml-4">
                          <div className="p-3 rounded-xl bg-surface-dim border border-border-dim text-xs">
                            <span className="font-bold block mb-1">Vercel:</span> Φιλοξενία πλατφόρμας και βάσης δεδομένων.
                          </div>
                          <div className="p-3 rounded-xl bg-surface-dim border border-border-dim text-xs">
                            <span className="font-bold block mb-1">Resend:</span> Ασφαλής αποστολή ενημερωτικών emails.
                          </div>
                          <div className="p-3 rounded-xl bg-surface-dim border border-border-dim text-xs">
                            <span className="font-bold block mb-1">Cloudflare:</span> Προστασία από κακόβουλα bots και spam.
                          </div>
                        </div>
                    </li>
                    <li className="space-y-2">
                        <h3 className="font-bold text-foreground">Διαχειριστές (Admins)</h3>
                        <p className="leading-relaxed ml-4">Εξουσιοδοτημένοι διαχειριστές της πλατφόρμας, αποκλειστικά για λόγους τεχνικής υποστήριξης και τήρησης της ασφάλειας (RBAC rules).</p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. Ασφάλεια Δεδομένων */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Lock className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Ασφάλεια Δεδομένων</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>Η Εφαρμογή έχει σχεδιαστεί (Privacy by Design) με αυστηρά τεχνικά μέτρα:</p>
                  <ul className="space-y-3 ml-4 list-disc marker:text-primary/40">
                    <li>Όλη η επικοινωνία κρυπτογραφείται μέσω πρωτοκόλλου SSL/TLS.</li>
                    <li>Οι συνομιλίες (Chats) είναι αυστηρά απομονωμένες (isolated) και η πρόσβαση περιορίζεται μέσω της βάσης δεδομένων μόνο στους ενεργούς συμμετέχοντες. Αν ένα match ακυρωθεί, το Chat κλειδώνει.</li>
                    <li>Οι κωδικοί πρόσβασης είναι μη-ανακτήσιμοι ακόμα και από τους διαχειριστές (hashed algorithms).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. Διατήρηση και Διαγραφή */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Clock className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Διατήρηση και Διαγραφή Δεδομένων</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-4 text-sm text-text-secondary leading-relaxed">
                  <ul className="space-y-3 ml-4 list-disc marker:text-primary/40">
                    <li>Τα προσωπικά σας δεδομένα διατηρούνται στη βάση δεδομένων μας <strong>μόνο για όσο χρονικό διάστημα παραμένει ενεργός ο λογαριασμός σας</strong>.</li>
                    <li>Σε περίπτωση διαγραφής του λογαριασμού σας, τα προσωπικά στοιχεία, οι ανοιχτές αιτήσεις και τα μηνύματα διαγράφονται οριστικά.</li>
                    <li>Διατηρούμε μόνο ανωνυμοποιημένα, συγκεντρωτικά δεδομένα για τα Analytics τα οποία είναι αδύνατον να συνδεθούν με εσάς.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 8. Τα Δικαιώματά σας */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Eye className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Τα Δικαιώματά σας βάσει GDPR</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-8 text-sm text-text-secondary leading-relaxed">
                  <p>Ως χρήστης, έχετε τα εξής δικαιώματα:</p>
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-foreground">Δικαίωμα Πρόσβασης</h3>
                        <p className="ml-4">Να γνωρίζετε ποια δεδομένα σας διατηρούμε.</p>
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-foreground">Δικαίωμα Διόρθωσης</h3>
                        <p className="ml-4">Να διορθώσετε ανακριβή στοιχεία του προφίλ σας μέσω της Εφαρμογής.</p>
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-foreground">Δικαίωμα Διαγραφής</h3>
                        <p className="ml-4">Να ζητήσετε την οριστική διαγραφή του λογαριασμού σας ("Δικαίωμα στη λήθη").</p>
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-foreground">Δικαίωμα Φορητότητας</h3>
                        <p className="ml-4">Να λάβετε τα δεδομένα σας σε μηχανικά αναγνώσιμη μορφή (π.χ. JSON).</p>
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-foreground">Δικαίωμα Εναντίωσης & Περιορισμού</h3>
                        <p className="ml-4">Να ζητήσετε τον περιορισμό της επεξεργασίας σε συγκεκριμένες περιπτώσεις.</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted border border-border-dim text-center">
                    <p className="mb-2">Για την άσκηση οποιουδήποτε δικαιώματος, επικοινωνήστε μαζί μας στο <SafeEmail user="privacy" domain="metathesi.gr" className="font-bold" />. Απαντάμε στα αιτήματά σας εντός 30 ημερών.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 9. Αλλαγές */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <RefreshCw className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">Αλλαγές στην Πολιτική Απορρήτου</h2>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Διατηρούμε το δικαίωμα να επικαιροποιούμε την παρούσα Πολιτική. Κάθε ουσιώδης αλλαγή θα σας γνωστοποιείται μέσω της Εφαρμογής και μέσω email.
                  </p>
                </div>
              </div>
            </section>

            {/* 10. Υπεύθυνος Επεξεργασίας */}
            <section className="relative md:pl-10">
              <div className="absolute left-[-2.75rem] top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary/50">
                <Building2 className="h-3 w-3 text-primary" />
              </div>
              <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border-dim bg-card/50">
                  <h2 className="text-label">10. Υπεύθυνος Επεξεργασίας</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-6">
                  <p className="text-sm text-text-secondary">
                    Υπεύθυνος Επεξεργασίας για τα δεδομένα που συλλέγονται μέσω της Εφαρμογής είναι:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-2">
                      <div className="text-sm">
                        <span className="block text-xs font-bold uppercase tracking-wider text-text-quaternary mb-0.5">Επωνυμία / Ονοματεπώνυμο</span>
                        <span className="text-text-secondary">Ατλάσης Αντώνιος</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="text-sm">
                        <span className="block text-xs font-bold uppercase tracking-wider text-text-quaternary mb-0.5">Έδρα / Διεύθυνση</span>
                        <span className="text-text-secondary">Εξοχών, 62100 Σέρρες, Ελλάδα</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="text-sm">
                        <span className="block text-xs font-bold uppercase tracking-wider text-text-quaternary mb-0.5">Email Επικοινωνίας (DPO / Privacy)</span>
                        <SafeEmail user="privacy" domain="metathesi.gr" />
                      </div>
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
