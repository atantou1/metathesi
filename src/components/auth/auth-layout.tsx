import Link from "next/link"
import { Star, Shield } from "lucide-react"
import { Logo } from "@/components/logo"

interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center lg:p-0 p-4 bg-muted text-foreground selection:bg-primary/20">
            <div className="w-full h-full lg:h-screen lg:flex overflow-hidden bg-card shadow-2xl lg:shadow-none rounded-2xl lg:rounded-none max-w-sm lg:max-w-none mx-auto border lg:border-none border-border">

                {/* Left Side */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundColor: 'var(--primary)',
                            backgroundImage: 'radial-gradient(var(--primary-hover) 1px, transparent 1px), radial-gradient(var(--primary-hover) 1px, var(--primary) 1px)',
                            backgroundSize: '40px 40px',
                            backgroundPosition: '0 0, 20px 20px'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-hover z-10"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>

                    <div className="relative z-20 text-center px-12 max-w-xl">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm text-white mb-8 border border-white/10 shadow-lg">
                            <Logo className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">metaThesi App</h2>
                        <p className="text-lg text-foreground/80 leading-relaxed font-light">
                            Experience clarity and calm in your daily workflow. Streamline your processes with our Serene Ocean design system.
                        </p>
                        <div className="mt-12 flex justify-center gap-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-primary bg-sky-700 flex items-center justify-center text-xs text-white">AM</div>
                                <div className="w-10 h-10 rounded-full border-2 border-primary bg-sky-600 flex items-center justify-center text-xs text-white">BR</div>
                                <div className="w-10 h-10 rounded-full border-2 border-primary bg-sky-500 flex items-center justify-center text-xs text-white">CK</div>
                            </div>
                            <div className="flex items-center text-sm text-foreground/80 font-medium">
                                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                                Loved by professionals
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full lg:w-1/2 flex flex-col h-full bg-white relative">
                    <div className="lg:hidden h-1 w-full bg-primary/10 absolute top-0 left-0"></div>
                    <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-20 xl:px-24 overflow-y-auto scrollbar-hide">
                        <div className="mb-10 text-center lg:text-left">
                            <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 shadow-soft">
                                <Logo className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2">
                                {title}
                            </h1>
                            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                                {subtitle}
                            </p>
                        </div>

                        {children}

                        <div className="mt-auto text-center lg:text-left pt-6">
                            <div className="mt-8 pt-6 border-t border-border flex items-center justify-center lg:justify-start space-x-2 opacity-80">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Secure & Protected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
