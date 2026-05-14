import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Στατιστικά Αμοιβαίων Μεταθέσεων",
  description: "Διαδραστικός χάρτης και αναλυτικά στατιστικά για τις αμοιβαίες μεταθέσεις εκπαιδευτικών. Δείτε τις βάσεις μορίων, τη ζήτηση και τον ανταγωνισμό ανά περιοχή.",
  alternates: {
    canonical: "/stats",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
