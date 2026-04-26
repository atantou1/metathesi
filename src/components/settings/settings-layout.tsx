"use client"

import { useState, useTransition, useEffect } from "react"
import { Shield, Smartphone, Palette, FolderOpen, User, Lock, Download, Trash2, Moon, Sun, Monitor, Loader2, AlertTriangle, X, CheckCircle2 } from "lucide-react"
import { deleteAccount, changePassword } from "@/actions/settings"
import { signOut } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema, ChangePasswordValues } from "@/lib/schemas"
import { useTheme } from "next-themes"

export function SettingsLayout() {
    const [activeTab, setActiveTab] = useState("account") // Start with account despite being empty as per request
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
            <aside className="w-20 sm:w-64 bg-card dark:bg-card border-r border-border dark:border-border flex flex-col py-6 shrink-0 z-10 transition-all duration-300 h-full">
                <nav className="space-y-1 px-2 sm:px-4 flex-1">
                    <button
                        onClick={() => setActiveTab("account")}
                        className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-2xl transition-all group ${activeTab === "account"
                            ? "bg-primary/10 text-primary dark:bg-primary/20"
                            : "text-text-tertiary hover:text-primary hover:bg-primary/5 dark:text-text-quaternary dark:hover:text-primary"
                            }`}
                    >
                        <User className={`w-6 h-6 ${activeTab === "account" ? "" : "group-hover:scale-110 transition-transform"}`} />
                        <span className="hidden sm:block font-medium text-sm">Λογαριασμός</span>
                        {activeTab === "account" && (
                            <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full hidden sm:block"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-2xl transition-all group relative ${activeTab === "security"
                            ? "bg-primary/10 text-primary dark:bg-primary/20"
                            : "text-text-tertiary hover:text-primary hover:bg-primary/5 dark:text-text-quaternary dark:hover:text-primary"
                            }`}
                    >
                        <Lock className={`w-6 h-6 ${activeTab === "security" ? "" : "group-hover:scale-110 transition-transform"}`} />
                        <span className="hidden sm:block font-medium text-sm">Ασφάλεια</span>
                        {activeTab === "security" && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full hidden sm:block"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("appearance")}
                        className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-2xl transition-all group relative ${activeTab === "appearance"
                            ? "bg-primary/10 text-primary dark:bg-primary/20"
                            : "text-text-tertiary hover:text-primary hover:bg-primary/5 dark:text-text-quaternary dark:hover:text-primary"
                            }`}
                    >
                        <Palette className={`w-6 h-6 ${activeTab === "appearance" ? "" : "group-hover:scale-110 transition-transform"}`} />
                        <span className="hidden sm:block font-medium text-sm">Εμφάνιση</span>
                        {activeTab === "appearance" && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full hidden sm:block"></div>
                        )}
                    </button>

                    <div className="pt-4 mt-2 border-t border-border-dim dark:border-border">
                        <button
                            onClick={() => setActiveTab("data")}
                            className={`w-full flex items-center sm:justify-start justify-center gap-3 px-3 py-3 rounded-2xl transition-all group relative ${activeTab === "data"
                                ? "bg-primary/10 text-primary dark:bg-primary/20"
                                : "text-text-tertiary hover:text-primary hover:bg-primary/5 dark:text-text-quaternary dark:hover:text-primary"
                                }`}
                        >
                            <FolderOpen className={`w-6 h-6 ${activeTab === "data" ? "" : "group-hover:scale-110 transition-transform"}`} />
                            <span className="hidden sm:block font-medium text-sm">Δεδομένα</span>
                            {activeTab === "data" && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full hidden sm:block"></div>
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
                                <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground dark:text-white">Λογαριασμός</h2>
                                    <p className="text-sm text-text-tertiary dark:text-text-quaternary">Διαχειριστείτε τις πληροφορίες του λογαριασμού σας.</p>
                                </div>
                            </div>

                            <div className="bg-card dark:bg-card rounded-xl p-8 text-center border border-border dark:border-border shadow-ambient">
                                <p className="text-text-tertiary dark:text-text-quaternary">Δεν υπάρχουν διαθέσιμες ρυθμίσεις προς το παρόν.</p>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === "security" && (
                        <section className="animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground dark:text-white">Ασφάλεια</h2>
                                    <p className="text-sm text-text-tertiary dark:text-text-quaternary">Διαχειριστείτε τον κωδικό πρόσβασης σας.</p>
                                </div>
                            </div>
                            <div className="bg-card dark:bg-card rounded-xl p-5 sm:p-6 shadow-ambient border border-border dark:border-border">
                                <form className="space-y-5" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>

                                    {passwordError && (
                                        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-sm font-medium flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            {passwordError}
                                        </div>
                                    )}

                                    {passwordSuccess && (
                                        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-sm font-medium flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {passwordSuccess}
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-text-secondary dark:text-foreground">Τρέχων Κωδικός</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...passwordForm.register("currentPassword")}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border bg-card dark:bg-muted text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm ${passwordForm.formState.errors.currentPassword ? 'border-red-500' : 'border-border dark:border-border'}`}
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
                                            <label className="block text-sm font-medium text-text-secondary dark:text-foreground">Νέος Κωδικός</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                <input
                                                    {...passwordForm.register("newPassword")}
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border bg-card dark:bg-muted text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm ${passwordForm.formState.errors.newPassword ? 'border-red-500' : 'border-border dark:border-border'}`}
                                                    placeholder="••••••••"
                                                    type="password"
                                                />
                                            </div>
                                            {passwordForm.formState.errors.newPassword && (
                                                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-text-secondary dark:text-foreground">Επιβεβαίωση</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-quaternary">
                                                    <Lock className="w-4 h-4" />
                                                </div>
                                                <input
                                                    {...passwordForm.register("confirmPassword")}
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border bg-card dark:bg-muted text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm ${passwordForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-border dark:border-border'}`}
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
                                            className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-2xl text-sm font-medium transition-colors shadow-soft shadow-primary/20 flex items-center gap-2 disabled:opacity-50 min-w-[160px] justify-center"
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
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl">
                                    <Palette className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground dark:text-white">Εμφάνιση</h2>
                                    <p className="text-sm text-text-tertiary dark:text-text-quaternary">Προσαρμόστε την εμπειρία προβολής.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <label className="cursor-pointer group">
                                    <input 
                                        className="peer sr-only" 
                                        name="theme" 
                                        type="radio" 
                                        checked={mounted ? theme === "light" : false}
                                        onChange={() => setTheme("light")}
                                    />
                                    <div className="relative overflow-hidden rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card p-4 transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary">
                                        <div className="h-20 bg-muted rounded-2xl mb-3 flex items-center justify-center border border-border">
                                            <Sun className="w-8 h-8 text-amber-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-foreground dark:text-white">Φωτεινό</span>
                                            <span className="w-4 h-4 rounded-full border border-border-strong peer-checked:border-primary peer-checked:bg-primary"></span>
                                        </div>
                                    </div>
                                </label>
                                <label className="cursor-pointer group">
                                    <input 
                                        className="peer sr-only" 
                                        name="theme" 
                                        type="radio" 
                                        checked={mounted ? theme === "dark" : false}
                                        onChange={() => setTheme("dark")}
                                    />
                                    <div className="relative overflow-hidden rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card p-4 transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary">
                                        <div className="h-20 bg-surface-bright dark:bg-muted rounded-2xl mb-3 flex items-center justify-center border border-border dark:border-border">
                                            <Moon className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-foreground dark:text-white">Σκοτεινό</span>
                                            <span className="w-4 h-4 rounded-full border border-border-strong peer-checked:border-primary peer-checked:bg-primary"></span>
                                        </div>
                                    </div>
                                </label>
                                <label className="cursor-pointer group">
                                    <input 
                                        className="peer sr-only" 
                                        name="theme" 
                                        type="radio" 
                                        checked={mounted ? theme === "system" : true}
                                        onChange={() => setTheme("system")}
                                    />
                                    <div className="relative overflow-hidden rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card p-4 transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary">
                                        <div className="h-20 bg-gradient-to-br from-muted to-foreground rounded-2xl mb-3 flex items-center justify-center border border-border dark:border-border">
                                            <Monitor className="w-8 h-8 text-text-tertiary dark:text-foreground" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-foreground dark:text-white">Σύστημα</span>
                                            <span className="w-4 h-4 rounded-full border border-border-strong peer-checked:border-primary peer-checked:bg-primary"></span>
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
                                <div className="p-2 bg-primary-soft dark:bg-blue-900/20 text-primary dark:text-primary rounded-2xl">
                                    <FolderOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground dark:text-white">Δεδομένα</h2>
                                    <p className="text-sm text-text-tertiary dark:text-text-quaternary">Διαχειριστείτε τα προσωπικά σας δεδομένα.</p>
                                </div>
                            </div>
                            <div className="bg-card dark:bg-card rounded-xl p-5 sm:p-6 shadow-ambient border border-border dark:border-border mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-foreground dark:text-white text-base mb-1">Εξαγωγή Δεδομένων</h3>
                                        <p className="text-sm text-text-tertiary dark:text-text-quaternary">
                                            Κατεβάστε ένα αντίγραφο των δεδομένων σας (GDPR).
                                        </p>
                                    </div>
                                    <button className="shrink-0 bg-card dark:bg-muted border border-border dark:border-border text-text-secondary dark:text-foreground px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-muted dark:hover:bg-border transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                        <Download className="w-5 h-5" />
                                        Λήψη αρχείου
                                    </button>
                                </div>
                            </div>
                            <div className="bg-card dark:bg-card rounded-xl p-5 sm:p-6 border border-red-200 dark:border-red-900/50 relative overflow-hidden group">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                    <div>
                                        <h3 className="font-bold text-red-600 dark:text-red-400 text-lg mb-1">Διαγραφή Λογαριασμού</h3>
                                        <p className="text-sm text-text-secondary dark:text-text-quaternary">
                                            Αυτή η ενέργεια είναι <span className="font-bold text-foreground dark:text-foreground">μη αναστρέψιμη</span>. Θα διαγραφούν όλα τα δεδομένα σας μόνιμα.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="shrink-0 bg-card dark:bg-muted border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card dark:bg-card rounded-2xl p-6 max-w-md w-full shadow-floating border border-border dark:border-border animate-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <button
                                onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="p-2 text-text-quaternary hover:text-text-secondary hover:bg-muted dark:hover:bg-muted rounded-full transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">
                            Είστε σίγουροι;
                        </h3>
                        <p className="text-text-secondary dark:text-text-quaternary mb-6 text-sm">
                            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Ο λογαριασμός σας και όλα τα σχετικά δεδομένα, μηνύματα και αιτήσεις θα διαγραφούν οριστικά από τους διακομιστές μας.
                        </p>

                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-sm font-medium">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 rounded-xl font-medium text-text-secondary bg-card border border-border hover:bg-muted dark:bg-muted dark:border-border dark:text-foreground dark:hover:bg-border transition-colors disabled:opacity-50"
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
