import React, { Suspense } from "react";
import SummaryPageClient from "./SummaryPageClient";

export default function SummaryPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mb-4"></div>
            <p className="text-text-tertiary font-medium tracking-wide">Φόρτωση پانελλαδικής σύνοψης...</p>
        </div>
    }>
      <SummaryPageClient />
    </Suspense>
  );
}
