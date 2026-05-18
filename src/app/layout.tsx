import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://metathesi.gr"),
  title: {
    template: "%s | metaThesi",
    default: "Αμοιβαίες Μεταθέσεις Εκπαιδευτικών | metaThesi",
  },
  description: "Η πρώτη ψηφιακή πλατφόρμα για αμοιβαίες μεταθέσεις εκπαιδευτικών και δημοσίων υπαλλήλων. Βρείτε την ιδανική μετάθεση έξυπνα, αυτοματοποιημένα και γρήγορα.",
  keywords: ["αμοιβαίες μεταθέσεις", "εκπαιδευτικοί", "μεταθέσεις εκπαιδευτικών", "υπουργείο παιδείας", "δημόσιοι υπάλληλοι", "μετάθεση"],
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://metathesi.gr",
    siteName: "metaThesi",
    title: "Αμοιβαίες Μεταθέσεις Εκπαιδευτικών | metaThesi",
    description: "Η πρώτη ψηφιακή πλατφόρμα για αμοιβαίες μεταθέσεις εκπαιδευτικών και δημοσίων υπαλλήλων.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "metaThesi Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Αμοιβαίες Μεταθέσεις Εκπαιδευτικών | metaThesi",
    description: "Η πρώτη ψηφιακή πλατφόρμα για αμοιβαίες μεταθέσεις εκπαιδευτικών και δημοσίων υπαλλήλων.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={`${inter.variable} font-sans text-neutral-text-main antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

