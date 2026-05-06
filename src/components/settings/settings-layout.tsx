"use client"

import { useState, useTransition, useEffect } from "react"
import { Shield, Smartphone, Palette, FolderOpen, User, Lock, Download, Trash2, Moon, Sun, Monitor, Loader2, AlertTriangle, X, CheckCircle2, Check } from "lucide-react"
import { useUser } from "@/components/providers/user-context"
import { deleteAccount, changePassword } from "@/actions/settings"
import { signOut } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema, ChangePasswordValues } from "@/lib/schemas"
import { useTheme } from "next-themes"

export function SettingsLayout({ initialName }: { initialName: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Profile State (from Context)
    const { name, setName, avatarColor } = useUser()
    const [nameError, setNameError] = useState<string | null>(null)

    // Sync initial name from server
    useEffect(() => {
        if (initialName) {
            setName(initialName)
        }
    }, [initialName, setName])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setName(value)
        
        const greekRegex = /^[α-ωΑ-ΩάέίόύήώΑ-ΩΆΈΊΌΎΉΏ\s]*$/
        if (value && !greekRegex.test(value)) {
            setNameError("Επιτρέπονται μόνο ελληνικοί χαρακτήρες")
        } else {
            setNameError(null)
        }
    }

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
        <div className="flex-1 bg-background dark:bg-background relative">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 p-4 sm:p-8 lg:p-12 pb-32 pt-8 sm:pt-12">
                
                {/* Desktop Sticky Sidebar Card */}
                <aside className="w-64 shrink-0 hidden md:block relative pt-[76px]">
                    <div className="sticky top-28 bg-card dark:bg-card border border-border dark:border-border rounded-4xl p-4 shadow-soft space-y-1">
                        <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3 mt-2">Μενού Ρυθμίσεων</h3>
                        <a href="#account" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:text-foreground hover:bg-muted dark:hover:bg-muted/50 transition-colors font-medium">
                            <User className="w-5 h-5" /> Λογαριασμός
                        </a>
                        <a href="#security" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:text-foreground hover:bg-muted dark:hover:bg-muted/50 transition-colors font-medium">
                            <Lock className="w-5 h-5" /> Ασφάλεια
                        </a>
                        <a href="#appearance" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:text-foreground hover:bg-muted dark:hover:bg-muted/50 transition-colors font-medium">
                            <Palette className="w-5 h-5" /> Εμφάνιση
                        </a>
                        <a href="#data" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:text-foreground hover:bg-muted dark:hover:bg-muted/50 transition-colors font-medium">
                            <FolderOpen className="w-5 h-5" /> Δεδομένα
                        </a>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    <div className="space-y-16">
                    
                    {/* ACCOUNT SECTION */}
                    <section id="account" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground dark:text-white">Λογαριασμός</h2>
                                <p className="text-sm text-text-tertiary dark:text-text-quaternary">Διαχειριστείτε τις πληροφορίες του λογαριασμού σας.</p>
                            </div>
                        </div>

                        <div className="bg-card dark:bg-card rounded-4xl p-6 sm:p-10 border border-border dark:border-border shadow-soft">
                            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-8">
                                {/* Avatar Preview Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className={`w-24 h-24 ${avatarColor} text-white rounded-full flex items-center justify-center text-3xl font-bold border-4 border-background dark:border-muted shadow-soft transition-colors duration-500`}>
                                        {name.trim() ? name.trim().charAt(0).toUpperCase() : "Γ"}
                                    </div>
                                    <button className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                                        Αλλαγή χρώματος
                                    </button>
                                </div>

                                {/* Form Section */}
                                <div className="flex-1 w-full space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-text-secondary dark:text-foreground">Όνομα</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={handleNameChange}
                                                className={`w-full px-4 py-3 rounded-2xl border ${nameError ? 'border-red-500' : 'border-border dark:border-border'} bg-background dark:bg-muted text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm`}
                                                placeholder="Μικρό όνομα (με ελληνικούς χαρακτήρες)"
                                            />
                                            {nameError && (
                                                <p className="text-xs text-red-500 mt-1.5 pl-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {nameError}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            disabled={!!nameError || !name}
                                            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-soft shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            type="button"
                                        >
                                            Αποθήκευση Αλλαγών
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECURITY SECTION */}
                    <section id="security" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground dark:text-white">Ασφάλεια</h2>
                                <p className="text-sm text-text-tertiary dark:text-text-quaternary">Διαχειριστείτε τον κωδικό πρόσβασης σας.</p>
                            </div>
                        </div>
                        <div className="bg-card dark:bg-card rounded-4xl p-6 sm:p-8 shadow-soft border border-border dark:border-border">
                            <form className="space-y-6" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>

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
                                            className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-background dark:bg-muted text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm ${passwordForm.formState.errors.currentPassword ? 'border-red-500' : 'border-border dark:border-border'}`}
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
                                                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-background dark:bg-muted text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm ${passwordForm.formState.errors.newPassword ? 'border-red-500' : 'border-border dark:border-border'}`}
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
                                                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-background dark:bg-muted text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm ${passwordForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-border dark:border-border'}`}
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </div>
                                        {passwordForm.formState.errors.confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end border-t border-border dark:border-border">
                                    <button
                                        disabled={isPendingPassword}
                                        className="mt-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-soft shadow-primary/20 flex items-center gap-2 disabled:opacity-50 min-w-[160px] justify-center"
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

                    {/* APPEARANCE SECTION */}
                    <section id="appearance" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl">
                                <Palette className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground dark:text-white">Εμφάνιση</h2>
                                <p className="text-sm text-text-tertiary dark:text-text-quaternary">Προσαρμόστε την εμπειρία προβολής.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <label className="cursor-pointer group">
                                <input 
                                    className="peer sr-only" 
                                    name="theme" 
                                    type="radio" 
                                    checked={mounted ? theme === "light" : false}
                                    onChange={() => setTheme("light")}
                                />
                                <div className="relative overflow-hidden rounded-4xl border-2 border-border dark:border-border bg-card dark:bg-card p-5 transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary shadow-soft">
                                    <div className="h-24 bg-muted rounded-2xl mb-4 flex items-center justify-center border border-border">
                                        <Sun className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground dark:text-white">Φωτεινό</span>
                                        <div className="w-5 h-5 rounded-full border-2 border-border-strong peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                                            {mounted && theme === "light" && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" strokeWidth={4} />}
                                        </div>
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
                                <div className="relative overflow-hidden rounded-4xl border-2 border-border dark:border-border bg-card dark:bg-card p-5 transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary shadow-soft">
                                    <div className="h-24 bg-surface-bright dark:bg-muted rounded-2xl mb-4 flex items-center justify-center border border-border dark:border-border">
                                        <Moon className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground dark:text-white">Σκοτεινό</span>
                                        <div className="w-5 h-5 rounded-full border-2 border-border-strong peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                                            {mounted && theme === "dark" && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" strokeWidth={4} />}
                                        </div>
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
                                <div className="relative overflow-hidden rounded-4xl border-2 border-border dark:border-border bg-card dark:bg-card p-5 transition-all hover:border-primary/50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary shadow-soft">
                                    <div className="h-24 bg-gradient-to-br from-muted to-foreground rounded-2xl mb-4 flex items-center justify-center border border-border dark:border-border">
                                        <Monitor className="w-10 h-10 text-text-tertiary dark:text-foreground" />
                                    </div>
                                        <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground dark:text-white">Σύστημα</span>
                                        <div className="w-5 h-5 rounded-full border-2 border-border-strong peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                                            {mounted && theme === "system" && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" strokeWidth={4} />}
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* DATA SECTION */}
                    <section id="data" className="scroll-mt-32 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary-soft dark:bg-blue-900/20 text-primary dark:text-primary rounded-2xl">
                                <FolderOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground dark:text-white">Δεδομένα</h2>
                                <p className="text-sm text-text-tertiary dark:text-text-quaternary">Διαχειριστείτε τα προσωπικά σας δεδομένα.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-card dark:bg-card rounded-4xl p-6 sm:p-8 shadow-soft border border-border dark:border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <h3 className="font-bold text-foreground dark:text-white text-lg mb-1">Εξαγωγή Δεδομένων</h3>
                                    <p className="text-sm text-text-tertiary dark:text-text-quaternary">
                                        Κατεβάστε ένα αντίγραφο των δεδομένων σας (GDPR).
                                    </p>
                                </div>
                                <button className="shrink-0 bg-background dark:bg-muted border border-border dark:border-border text-text-secondary dark:text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-muted dark:hover:bg-border transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                                    <Download className="w-5 h-5" />
                                    Λήψη αρχείου
                                </button>
                            </div>
                            
                            <div className="bg-card dark:bg-card rounded-4xl p-6 sm:p-8 border border-red-200 dark:border-red-900/50 shadow-soft relative overflow-hidden group">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-50 dark:bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                    <div>
                                        <h3 className="font-bold text-red-600 dark:text-red-400 text-lg mb-1">Διαγραφή Λογαριασμού</h3>
                                        <p className="text-sm text-text-secondary dark:text-text-quaternary">
                                            Αυτή η ενέργεια είναι <span className="font-bold text-foreground dark:text-foreground">μη αναστρέψιμη</span>. Θα διαγραφούν όλα τα δεδομένα σας μόνιμα.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="shrink-0 bg-background dark:bg-muted border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        Διαγραφή
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card dark:bg-card rounded-3xl p-8 max-w-md w-full shadow-floating border border-border dark:border-border animate-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <button
                                onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="p-2 text-text-quaternary hover:text-text-secondary hover:bg-muted dark:hover:bg-muted rounded-full transition-colors disabled:opacity-50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">
                            Είστε σίγουροι;
                        </h3>
                        <p className="text-text-secondary dark:text-text-quaternary mb-8 text-base">
                            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Ο λογαριασμός σας και όλα τα σχετικά δεδομένα, μηνύματα και αιτήσεις θα διαγραφούν οριστικά από τους διακομιστές μας.
                        </p>

                        {deleteError && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-sm font-medium">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="px-6 py-3 rounded-full font-medium text-text-secondary bg-background border border-border hover:bg-muted dark:bg-muted dark:border-border dark:text-foreground dark:hover:bg-border transition-colors disabled:opacity-50"
                            >
                                Ακύρωση
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-6 py-3 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[160px] shadow-soft shadow-red-600/20"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
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
