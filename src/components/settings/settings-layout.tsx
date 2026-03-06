"use client"

import { useState, useTransition } from "react"
import { Shield, Smartphone, Palette, FolderOpen, User, Lock, Download, Trash2, Moon, Sun, Monitor, Loader2, AlertTriangle, X, CheckCircle2 } from "lucide-react"
import { deleteAccount, changePassword } from "@/actions/settings"
import { signOut } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema, ChangePasswordValues } from "@/lib/schemas"

export function SettingsLayout() {
    const [activeTab, setActiveTab] = useState("account") // Start with account despite being empty as per request
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    // Password Change State
    const [isPendingPassword, startTransitionPassword] = useTransition()
    const [passwordError, setPasswordError] = useState<string | undefined>()
    const [passwordSuccess, setPasswordSuccess] = useState<string | undefined>()

    const passwordForm = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onPasswordSubmit = (values: ChangePasswordValues) => {
        setPasswordError(undefined);
        setPasswordSuccess(undefined);

        startTransitionPassword(async () => {
            try {
                const result = await changePassword(values);
                if (result?.error) {
                    setPasswordError(result.error);
                } else if (result?.success) {
                    setPasswordSuccess(result.success);
                    passwordForm.reset();
                }
            } catch (error) {
                setPasswordError("Προέκυψε κάποιο σφάλμα.");
            }
        });
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const result = await deleteAccount();
            if (result?.error) {
                setDeleteError(result.error);
                setIsDeleting(false);
            } else {
                // Success! Sign out the user and redirect to login
                await signOut({ callbackUrl: '/login' });
            }
        } catch (error) {
            setDeleteError("Κάτι πήγε στραβά κατά τη διαγραφή.");
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex flex-1 overflow-hidden relative h-full">
            <aside className="w-20 sm:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-6 shrink-0 z-10 transition-all duration-300 h-full">
                <nav className="space-y-1 px-2 sm:px-4 flex-1">
                    <button
                        onClick={() => setActiveTab("account")}
                        className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-lg transition-all group ${activeTab === "account"
                            ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20"
                            : "text-slate-500 hover:text-blue-600 hover:bg-blue-600/5 dark:text-slate-400 dark:hover:text-blue-600"
                            }`}
                    >
                        <User className={`w-6 h-6 ${activeTab === "account" ? "" : "group-hover:scale-110 transition-transform"}`} />
                        <span className="hidden sm:block font-medium text-sm">Λογαριασμός</span>
                        {activeTab === "account" && (
                            <div className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full hidden sm:block"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-lg transition-all group relative ${activeTab === "security"
                            ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20"
                            : "text-slate-500 hover:text-blue-600 hover:bg-blue-600/5 dark:text-slate-400 dark:hover:text-blue-600"
                            }`}
                    >
                        <Lock className={`w-6 h-6 ${activeTab === "security" ? "" : "group-hover:scale-110 transition-transform"}`} />
                        <span className="hidden sm:block font-medium text-sm">Ασφάλεια</span>
                        {activeTab === "security" && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full hidden sm:block"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("appearance")}
                        className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-lg transition-all group relative ${activeTab === "appearance"
                            ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20"
                            : "text-slate-500 hover:text-blue-600 hover:bg-blue-600/5 dark:text-slate-400 dark:hover:text-blue-600"
                            }`}
                    >
                        <Palette className={`w-6 h-6 ${activeTab === "appearance" ? "" : "group-hover:scale-110 transition-transform"}`} />
                        <span className="hidden sm:block font-medium text-sm">Εμφάνιση</span>
                        {activeTab === "appearance" && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full hidden sm:block"></div>
                        )}
                    </button>

                    <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => setActiveTab("data")}
                            className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-lg transition-all group relative ${activeTab === "data"
                                ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20"
                                : "text-slate-500 hover:text-blue-600 hover:bg-blue-600/5 dark:text-slate-400 dark:hover:text-blue-600"
                                }`}
                        >
                            <FolderOpen className={`w-6 h-6 ${activeTab === "data" ? "" : "group-hover:scale-110 transition-transform"}`} />
                            <span className="hidden sm:block font-medium text-sm">Δεδομένα</span>
                            {activeTab === "data" && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full hidden sm:block"></div>
                            )}
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth pb-20">
                <div className="max-w-xl mx-auto space-y-10">

                    {/* ACCOUNT TAB */}
                    {activeTab === "account" && (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-600/10 rounded-lg text-blue-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Λογαριασμός</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Διαχειριστείτε τις πληροφορίες του λογαριασμού σας.</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                                <p className="text-slate-500 dark:text-slate-400">Δεν υπάρχουν διαθέσιμες ρυθμίσεις προς το παρόν.</p>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === "security" && (
                        <section className="animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-600/10 rounded-lg text-blue-600">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ασφάλεια</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Διαχειριστείτε τον κωδικό πρόσβασης σας.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                                <form className="space-y-5" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>

                                    {passwordError && (
                                        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            {passwordError}
                                        </div>
                                    )}

                                    {passwordSuccess && (
                                        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {passwordSuccess}
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Τρέχων Κωδικός</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...passwordForm.register("currentPassword")}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow sm:text-sm ${passwordForm.formState.errors.currentPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </div>
                                        {passwordForm.formState.errors.currentPassword && (
                                            <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Νέος Κωδικός</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                <input
                                                    {...passwordForm.register("newPassword")}
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow sm:text-sm ${passwordForm.formState.errors.newPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                                                    placeholder="••••••••"
                                                    type="password"
                                                />
                                            </div>
                                            {passwordForm.formState.errors.newPassword && (
                                                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Επιβεβαίωση</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                <input
                                                    {...passwordForm.register("confirmPassword")}
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow sm:text-sm ${passwordForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                                                    placeholder="••••••••"
                                                    type="password"
                                                />
                                            </div>
                                            {passwordForm.formState.errors.confirmPassword && (
                                                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-2 flex justify-end">
                                        <button
                                            disabled={isPendingPassword}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 min-w-[160px] justify-center"
                                            type="submit"
                                        >
                                            {isPendingPassword ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <span>Αλλαγή Κωδικού</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    )}

                    {/* APPEARANCE TAB */}
                    {activeTab === "appearance" && (
                        <section className="animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                    <Palette className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Εμφάνιση</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Προσαρμόστε την εμπειρία προβολής.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <label className="cursor-pointer group">
                                    <input defaultChecked className="peer sr-only" name="theme" type="radio" />
                                    <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:border-blue-600/50 peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-600">
                                        <div className="h-20 bg-slate-100 rounded-lg mb-3 flex items-center justify-center border border-slate-200">
                                            <Sun className="w-8 h-8 text-amber-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-slate-900 dark:text-white">Φωτεινό</span>
                                            <span className="w-4 h-4 rounded-full border border-slate-300 peer-checked:border-blue-600 peer-checked:bg-blue-600"></span>
                                        </div>
                                    </div>
                                </label>
                                <label className="cursor-pointer group">
                                    <input className="peer sr-only" name="theme" type="radio" />
                                    <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:border-blue-600/50 peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-600">
                                        <div className="h-20 bg-slate-800 rounded-lg mb-3 flex items-center justify-center border border-slate-700">
                                            <Moon className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-slate-900 dark:text-white">Σκοτεινό</span>
                                            <span className="w-4 h-4 rounded-full border border-slate-300 peer-checked:border-blue-600 peer-checked:bg-blue-600"></span>
                                        </div>
                                    </div>
                                </label>
                                <label className="cursor-pointer group">
                                    <input className="peer sr-only" name="theme" type="radio" />
                                    <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:border-blue-600/50 peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-600">
                                        <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-800 rounded-lg mb-3 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                            <Monitor className="w-8 h-8 text-slate-500 dark:text-slate-300" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-slate-900 dark:text-white">Σύστημα</span>
                                            <span className="w-4 h-4 rounded-full border border-slate-300 peer-checked:border-blue-600 peer-checked:bg-blue-600"></span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </section>
                    )}

                    {/* DATA TAB */}
                    {activeTab === "data" && (
                        <section className="animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <FolderOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Δεδομένα</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Διαχειριστείτε τα προσωπικά σας δεδομένα.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Εξαγωγή Δεδομένων</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Κατεβάστε ένα αντίγραφο των δεδομένων σας (GDPR).
                                        </p>
                                    </div>
                                    <button className="shrink-0 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                        <Download className="w-5 h-5" />
                                        Λήψη αρχείου
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-red-200 dark:border-red-900/50 relative overflow-hidden group">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                    <div>
                                        <h3 className="font-bold text-red-600 dark:text-red-400 text-lg mb-1">Διαγραφή Λογαριασμού</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Αυτή η ενέργεια είναι <span className="font-bold text-slate-800 dark:text-slate-200">μη αναστρέψιμη</span>. Θα διαγραφούν όλα τα δεδομένα σας μόνιμα.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="shrink-0 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        Διαγραφή
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="h-10"></div>
                </div>
            </main>

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Είστε σίγουροι;
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Ο λογαριασμός σας και όλα τα σχετικά δεδομένα, μηνύματα και αιτήσεις θα διαγραφούν οριστικά από τους διακομιστές μας.
                        </p>

                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                Ακύρωση
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Διαγραφή...
                                    </>
                                ) : (
                                    "Ναι, Διαγραφή"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
