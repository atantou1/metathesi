import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Στατιστικά Αμοιβαίων Μεταθέσεων",
  description: "Διαδραστικός χάρτης και αναλυτικά στατιστικά για τις αμοιβαίες μεταθέσεις εκπαιδευτικών. Δείτε τις βάσεις μορίων, τη ζήτηση και τον ανταγωνισμό ανά περιοχή.",
  alternates: {
    canonical: "/stats",
  },
  openGraph: {
    title: "Στατιστικά Αμοιβαίων Μεταθέσεων | metaThesi",
    description: "Διαδραστικός χάρτης και αναλυτικά στατιστικά για τις αμοιβαίες μεταθέσεις εκπαιδευτικών. Δείτε τις βάσεις μορίων, τη ζήτηση και τον ανταγωνισμό ανά περιοχή.",
    images: [
      {
        url: "/stats/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Χάρτης Στατιστικών Αμοιβαίων Μεταθέσεων",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Στατιστικά Αμοιβαίων Μεταθέσεων | metaThesi",
    description: "Διαδραστικός χάρτης και αναλυτικά στατιστικά για τις αμοιβαίες μεταθέσεις εκπαιδευτικών.",
    images: ["/stats/opengraph-image.png"],
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
