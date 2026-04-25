import Link from "next/link";
import { Facebook, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-16 mt-auto">
            <div className="mx-auto max-w-7xl px-4 lg:px-0">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-6 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined text-sm">sync_alt</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">metaThesi</span>
                        </div>
                        <p className="max-w-sm text-slate-500 leading-relaxed">
                            Η σύγχρονη πλατφόρμα που φέρνει κοντά τους δημόσιους υπαλλήλους για την
                            εύρεση αμοιβαίας μετάθεσης με ασφάλεια και ταχύτητα.
                        </p>
                    </div>
                    <div>
                        <h5 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
                            Σύνδεσμοι
                        </h5>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link
                                    className="text-slate-500 hover:text-primary transition-colors"
                                    href="#"
                                >
                                    Όροι Χρήσης
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-slate-500 hover:text-primary transition-colors"
                                    href="#"
                                >
                                    Πολιτική Απορρήτου
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-slate-500 hover:text-primary transition-colors"
                                    href="#"
                                >
                                    Συχνές Ερωτήσεις
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
                            Επικοινωνία
                        </h5>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-2 text-slate-500">
                                <span className="material-symbols-outlined text-sm">mail</span>
                                info@metathesi.gr
                            </li>
                            <li className="flex items-center gap-2 text-slate-500">
                                <span className="material-symbols-outlined text-sm">
                                    support_agent
                                </span>
                                Κέντρο Υποστήριξης
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 md:flex-row">
                    <p className="text-sm text-slate-500">
                        © 2024 metaThesi. Όλα τα δικαιώματα διατηρούνται.
                    </p>
                    <div className="flex gap-6">
                        <Link className="text-slate-400 hover:text-primary" href="#" aria-label="Facebook">
                            <Facebook className="w-5 h-5" />
                        </Link>
                        <Link className="text-slate-400 hover:text-primary" href="#" aria-label="X (Twitter)">
                            <Twitter className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
