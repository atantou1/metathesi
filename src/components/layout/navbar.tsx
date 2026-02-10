import Link from "next/link"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export async function Navbar() {
    const session = await auth()

    return (
        <header className="border-b bg-background shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold text-primary">
                        MutualMatcher
                    </Link>
                    <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                        <Link href="/" className="text-muted-foreground hover:text-foreground">
                            Αρχική
                        </Link>
                        {session && (
                            <>
                                <Link href="/profile" className="text-muted-foreground hover:text-foreground">
                                    Προφίλ
                                </Link>
                                <Link href="/request/create" className="text-muted-foreground hover:text-foreground">
                                    Αιτήσεις
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                {session.user?.email}
                            </span>
                            <form
                                action={async () => {
                                    "use server"
                                    await signOut()
                                }}
                            >
                                <Button variant="outline" size="sm">
                                    Αποσύνδεση
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Σύνδεση
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Εγγραφή</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
