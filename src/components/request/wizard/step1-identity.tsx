"use client"

import { useEffect, useState, useTransition } from "react"
import { useFormContext } from "react-hook-form" // We'll use FormContext for shared state
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
import { getDivisions, getSpecialties, getRegions } from "@/actions/profile"
import { Search, Lock, User, Briefcase, GraduationCap } from "lucide-react" // Mapped icons

type Option = { id: number; name: string; code?: string }

export function Step1Identity() {
    const { control, watch, setValue, getValues } = useFormContext()
    const [isPending, startTransition] = useTransition()

    // Options State
    const [divisions, setDivisions] = useState<Option[]>([])
    const [specialties, setSpecialties] = useState<{ id: number, name: string, code: string, educationalCategory?: string }[]>([]) // Enhanced type
    const [specialtyCategory, setSpecialtyCategory] = useState<string>("PE") // Default PE

    // Filtered Specialties
    const filteredSpecialties = specialties.filter(s => {
        // Simple mapping: "PE" match "ΠΕ", "TE" match "ΤΕ", "DE" match "ΔΕ"
        // Or if the code data is already "PE..." we can check code.
        // Assuming database `educationalCategory` matches "ΠΕ", "ΤΕ", "ΔΕ" OR the code starts with it.
        // Let's relax filter to check checks start of code or exact category match if available.
        // Looking at typical Greek data: Code is like "ΠΕ04.01", so it starts with "ΠΕ".
        // Category "PE" -> startsWith "ΠΕ" or "PE"

        const prefix = specialtyCategory === "PE" ? "ΠΕ" :
            specialtyCategory === "TE" ? "ΤΕ" :
                specialtyCategory === "DE" ? "ΔΕ" : "";

        if (!prefix) return true;

        // Check code prefix OR category name if available
        // We'll rely on Code mostly as it's cleaner.
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

                // Reset specialty if not valid for new division (unless just loaded)
                // For simplicity in wizard, if user changes division, we probably should reset specialty
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
        <div className="flex flex-col md:flex-row min-h-[550px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
            {/* Left Panel (Visual) */}
            <div className="hidden md:flex md:w-5/12 bg-slate-50 dark:bg-slate-900 p-10 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -mr-16 -mt-16 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -ml-16 -mb-16 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
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
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center mt-0.5">
                                <Lock className="w-4 h-4 text-blue-600" />
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
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10 md:hidden">
                    <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white uppercase">Profile Setup</span>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex px-8 pt-8 pb-2 justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Details</h3>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Identity</p>
                            <p className="text-[10px] text-slate-500">Step 1</p>
                        </div>
                        {/* Ring Progress */}
                        <div className="relative w-8 h-8">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-100 dark:text-slate-700" cx="16" cy="16" fill="none" r="14" stroke="currentColor" strokeWidth="3"></circle>
                                <circle className="text-blue-600" cx="16" cy="16" fill="none" r="14" stroke="currentColor" strokeDasharray="88" strokeDashoffset="44" strokeWidth="3"></circle>
                            </svg>
                        </div>
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
                                            <User className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <Input
                                            {...field}
                                            placeholder="e.g. John Doe"
                                            className="pl-10 py-6 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm"
                                        />
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
                                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 ml-1">
                                        Division
                                    </FormLabel>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value ? String(field.value) : undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="pl-10 h-auto py-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm">
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

                        {/* Specialty with Category Filter */}
                        <FormField
                            control={control}
                            name="specialtyId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 ml-1">
                                        Specialty
                                    </FormLabel>

                                    <div className="flex rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
                                        {/* Category Select */}
                                        <div className="relative w-24 flex-shrink-0 border-r border-slate-200 dark:border-slate-600">
                                            <Select
                                                value={specialtyCategory}
                                                onValueChange={(val) => setSpecialtyCategory(val)}
                                                disabled={!selectedDivisionId}
                                            >
                                                <SelectTrigger className="w-full h-full pl-3 pr-2 py-3 text-sm font-medium bg-slate-50 dark:bg-slate-900/50 rounded-l-lg text-slate-900 dark:text-white border-none focus:ring-0">
                                                    <SelectValue placeholder="Cat" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PE">ΠΕ</SelectItem>
                                                    <SelectItem value="TE">ΤΕ</SelectItem>
                                                    <SelectItem value="DE">ΔΕ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Specialty Search/Select */}
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                                <Search className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={field.value ? String(field.value) : undefined}
                                                disabled={!selectedDivisionId}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full h-auto py-3 pl-10 pr-4 text-sm bg-transparent border-none rounded-r-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 shadow-none">
                                                        <SelectValue placeholder={selectedDivisionId ? "Search code or name..." : "Select division first"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filteredSpecialties.map((spec: { id: number; code: string; name: string }) => (
                                                        <SelectItem key={spec.id} value={String(spec.id)}>
                                                            {spec.code} - {spec.name}
                                                        </SelectItem>
                                                    ))}
                                                    {filteredSpecialties.length === 0 && selectedDivisionId && (
                                                        <div className="p-2 text-sm text-slate-500 text-center">No specialties found for {specialtyCategory}</div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {!selectedDivisionId && <p className="text-[11px] text-slate-500 mt-1 ml-1">Select division first.</p>}
                                    {selectedDivisionId && <p className="text-[11px] text-slate-500 mt-1 ml-1">Select category (e.g. ΠΕ) then search for your specialty code.</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
