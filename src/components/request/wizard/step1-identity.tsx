"use client"

import { useEffect, useState, useTransition } from "react"
import { useFormContext } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getDivisions, getSpecialties } from "@/actions/profile"
import { Search, Lock, User, Briefcase, ChevronRight, Building2 } from "lucide-react"

type Option = { id: number; name: string; code?: string }

export function Step1Identity({ onNext }: { onNext: () => void }) {
    const { control, watch, setValue, getValues } = useFormContext()
    const [isPending, startTransition] = useTransition()

    // Options State
    const [divisions, setDivisions] = useState<Option[]>([])
    const [specialties, setSpecialties] = useState<{ id: number, name: string, code: string, educationalCategory?: string }[]>([])
    const [specialtyCategory, setSpecialtyCategory] = useState<string>("PE")

    // Filtered Specialties
    const filteredSpecialties = specialties.filter(s => {
        const prefix = specialtyCategory === "PE" ? "ΠΕ" :
            specialtyCategory === "TE" ? "ΤΕ" :
                specialtyCategory === "DE" ? "ΔΕ" : "";

        if (!prefix) return true;

        return s.code?.startsWith(prefix) || s.educationalCategory === prefix;
    })

    // Watch fields
    const selectedDivisionId = watch("divisionId")

    // Initial Data Load
    useEffect(() => {
        startTransition(async () => {
            const divs = await getDivisions()
            setDivisions(divs)
        })
    }, [])

    // Cascade: Division -> Specialty
    useEffect(() => {
        if (selectedDivisionId) {
            startTransition(async () => {
                const specs = await getSpecialties(Number(selectedDivisionId))
                setSpecialties(specs)

                // Reset specialty if not valid for new division
                const currentSpec = getValues("specialtyId")
                if (currentSpec && !specs.find(s => s.id === Number(currentSpec))) {
                    setValue("specialtyId", "")
                }
            })
        } else {
            setSpecialties([])
        }
    }, [selectedDivisionId, setValue, getValues])

    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[550px] border border-gray-100 dark:border-slate-700">
            {/* Left Panel (Visual) */}
            <div className="hidden md:flex md:w-5/12 bg-slate-50 dark:bg-slate-900 p-10 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -mr-16 -mt-16 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -ml-16 -mb-16 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Step 1 of 2</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Professional Identity</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                        Let's verify your current employment status to match you with compatible transfer opportunities.
                    </p>
                </div>

                <div className="relative z-10 mt-auto pt-8">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                <Lock className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Secure Data Handling</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your professional details are encrypted and only used for matching purposes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full md:w-7/12 flex flex-col h-full relative">
                {/* Mobile Header */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10 md:hidden">
                    <button className="text-slate-500 hover:text-primary transition-colors p-1 -ml-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700">
                        {/* Chevron Left would go here if we were implementing back, but this is step 1 */}
                    </button>
                    <h1 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white uppercase">Profile Setup</h1>
                    <button className="text-primary text-sm font-medium hover:text-primary-dark">Help</button>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex px-8 pt-8 pb-2 justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Details</h3>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Identity</p>
                            <p className="text-[10px] text-slate-500">Step 1</p>
                        </div>
                        <div className="relative w-8 h-8">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-100 dark:text-slate-700" cx="16" cy="16" fill="none" r="14" stroke="currentColor" strokeWidth="3"></circle>
                                <circle className="text-primary" cx="16" cy="16" fill="none" r="14" stroke="currentColor" strokeDasharray="88" strokeDashoffset="44" strokeWidth="3"></circle>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-6 pb-2 md:hidden">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 1 of 2</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Professional Identity</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2 rounded-full shadow-[0_0_10px_rgba(29,79,215,0.4)]"></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 pb-4 md:px-8 md:py-6">
                    <div className="mb-6 md:hidden">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">Professional Identity</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Verify your current employment details.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Full Name */}
                        <FormField
                            control={control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 ml-1">
                                        Full Name
                                    </FormLabel>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="w-[20px] h-[20px] text-slate-400" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g. John Doe"
                                                className="block w-full pl-10 pr-3 py-6 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-input hover:border-slate-400"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Division */}
                        <FormField
                            control={control}
                            name="divisionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 ml-1">
                                        Division
                                    </FormLabel>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="w-[20px] h-[20px] text-primary" />
                                        </div>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value ? String(field.value) : undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="pl-10 pr-10 py-6 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-input hover:border-slate-400 h-auto">
                                                    <SelectValue placeholder="Select Division" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {divisions.map((div) => (
                                                    <SelectItem key={div.id} value={String(div.id)}>
                                                        {div.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Specialty */}
                        <FormField
                            control={control}
                            name="specialtyId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 ml-1">
                                        Specialty
                                    </FormLabel>
                                    <div className="flex rounded-lg shadow-input hover:shadow-md transition-shadow duration-200 group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
                                        <div className="relative w-24 flex-shrink-0 border-r border-slate-200 dark:border-slate-600">
                                            <Select
                                                value={specialtyCategory}
                                                onValueChange={(val) => setSpecialtyCategory(val)}
                                                disabled={!selectedDivisionId}
                                            >
                                                <SelectTrigger className="w-full pl-3 pr-2 py-6 text-sm font-medium bg-slate-50 dark:bg-slate-900/50 rounded-l-lg text-slate-900 dark:text-white focus:outline-none z-10 relative cursor-pointer border-none h-full">
                                                    <SelectValue placeholder="Cat" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PE">ΠΕ</SelectItem>
                                                    <SelectItem value="TE">ΤΕ</SelectItem>
                                                    <SelectItem value="DE">ΔΕ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                                <Search className="w-[20px] h-[20px] text-slate-400" />
                                            </div>
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={field.value ? String(field.value) : undefined}
                                                disabled={!selectedDivisionId}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full pl-10 pr-4 py-6 text-sm bg-transparent border-none rounded-r-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 z-10 relative h-auto shadow-none">
                                                        <SelectValue placeholder={selectedDivisionId ? "Search code or name..." : "Select division first"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredSpecialties.map((spec) => (
                                                        <SelectItem key={spec.id} value={String(spec.id)}>
                                                            {spec.code} - {spec.name}
                                                        </SelectItem>
                                                    ))}
                                                    {filteredSpecialties.length === 0 && selectedDivisionId && (
                                                        <div className="p-2 text-sm text-slate-500 text-center">No specialties found</div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <p className="mt-2 ml-1 text-[11px] text-slate-500 dark:text-slate-400">
                                        Select category (e.g. ΠΕ) then search for your specialty code.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Footer inside the card */}
                <div className="px-6 py-6 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 mt-auto md:px-8 md:py-8 md:rounded-br-2xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="hidden md:block text-[11px] text-slate-400 max-w-[200px] leading-snug">
                            Processing under Public Sector Privacy guidelines.
                        </p>
                        <button
                            type="button"
                            onClick={onNext}
                            className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 group order-1 md:order-2"
                        >
                            Continue
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <p className="text-center mt-4 text-[10px] text-slate-400 md:hidden">
                        Securely processed under Privacy guidelines.
                    </p>
                </div>
            </div>
        </div>
    )
}
