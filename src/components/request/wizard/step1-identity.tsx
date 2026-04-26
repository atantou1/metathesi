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
import { getDivisions, getSpecialties, getRegions, getZones } from "@/actions/profile"
import { User, UserCircle, Layers, ChevronDown } from "lucide-react"

type Option = { id: number; name: string; code?: string }

export function Step1Identity() {
    const { control, watch, setValue, getValues } = useFormContext()
    const [isPending, startTransition] = useTransition()

    // Options State
    const [divisions, setDivisions] = useState<Option[]>([])
    const [specialties, setSpecialties] = useState<{ id: number, name: string, code: string, educationalCategory?: string }[]>([])
    const [specialtyCategory, setSpecialtyCategory] = useState<string>("PE")
    const [regions, setRegions] = useState<Option[]>([])
    const [currentZones, setCurrentZones] = useState<Option[]>([])

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
    const currentRegionId = watch("currentRegionId")

    // Initial Data Load
    useEffect(() => {
        startTransition(async () => {
            const [divs, regs] = await Promise.all([
                getDivisions(),
                getRegions()
            ])
            setDivisions(divs)
            setRegions(regs)
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
                    setValue("specialtyId", 0)
                }
            })
        } else {
            setSpecialties([])
        }
    }, [selectedDivisionId, setValue, getValues])

    // Cascade: Region -> Zones
    useEffect(() => {
        if (currentRegionId && selectedDivisionId) {
            startTransition(async () => {
                const zones = await getZones(Number(currentRegionId), Number(selectedDivisionId))
                setCurrentZones(zones)
            })
        } else {
            setCurrentZones([])
        }
    }, [currentRegionId, selectedDivisionId])

    return (
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-sky-50 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-3 mb-6">
                <div className="p-2 rounded-2xl bg-primary-soft text-primary">
                    <UserCircle className="w-5 h-5" />
                </div>
                Επαγγελματική Ταυτότητα & Τρέχουσα Θέση
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Full Name */}
                <div className="md:col-span-2">
                    <FormField
                        control={control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Ονομα</FormLabel>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="π.χ. Νικόλαος Παππάς"
                                            className="form-input pl-10 bg-muted border-border"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Division (Βαθμίδα) */}
                <div>
                    <FormField
                        control={control}
                        name="divisionId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="block text-[10px] font-bold text-text-quaternary uppercase tracking-widest pl-1">Βαθμιδα</FormLabel>
                                <div className="relative">
                                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                    <FormControl>
                                        <select
                                            className="form-input pl-10 appearance-none cursor-pointer bg-muted border-border"
                                            value={field.value ? String(field.value) : ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        >
                                            <option value="">Επιλογή Βαθμίδας</option>
                                            {divisions.map((div) => (
                                                <option key={div.id} value={String(div.id)}>
                                                    {div.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Specialty (Ειδικότητα) */}
                <div>
                    <FormField
                        control={control}
                        name="specialtyId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="block text-[10px] font-bold text-text-quaternary uppercase tracking-widest pl-1">Ειδικοτητα</FormLabel>
                                <div className="flex rounded-2xl bg-muted border border-border focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/15 transition-all overflow-hidden focus-within:bg-card">
                                    <div className="relative w-24 flex-shrink-0 border-r border-border bg-muted">
                                        <select
                                            value={specialtyCategory}
                                            onChange={(e) => setSpecialtyCategory(e.target.value)}
                                            className="w-full h-full pl-4 pr-8 py-[0.875rem] text-sm font-medium text-foreground bg-transparent appearance-none cursor-pointer focus:outline-none"
                                        >
                                            <option value="PE">ΠΕ</option>
                                            <option value="TE">ΤΕ</option>
                                            <option value="DE">ΔΕ</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                    <div className="relative flex-grow">
                                        <FormControl>
                                            <select
                                                disabled={!selectedDivisionId}
                                                className="w-full h-full pl-4 pr-10 py-[0.875rem] text-sm bg-transparent appearance-none cursor-pointer focus:outline-none text-foreground"
                                                value={field.value ? String(field.value) : ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            >
                                                <option value="">Επιλογή ειδικότητας...</option>
                                                {filteredSpecialties.map((spec) => (
                                                    <option key={spec.id} value={String(spec.id)}>
                                                        {spec.code} ({spec.name})
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="md:col-span-2 border-t border-border my-2"></div>

                {/* Region (Περιφέρεια) */}
                <div>
                    <FormField
                        control={control}
                        name="currentRegionId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="block text-[10px] font-bold text-text-quaternary uppercase tracking-widest pl-1">Περιφερεια</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <select
                                            className="form-input appearance-none cursor-pointer bg-muted border-border"
                                            value={field.value ? String(field.value) : ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        >
                                            <option value="">Επιλογή...</option>
                                            {regions.map((reg) => (
                                                <option key={reg.id} value={String(reg.id)}>
                                                    {reg.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Zone (Περιοχή) */}
                <div>
                    <FormField
                        control={control}
                        name="currentZoneId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="block text-[10px] font-bold text-text-quaternary uppercase tracking-widest pl-1">Περιοχη</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <select
                                            disabled={!currentRegionId}
                                            className="form-input appearance-none cursor-pointer bg-surface-dim border-border"
                                            value={field.value ? String(field.value) : ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        >
                                            <option value="">Επιλογή...</option>
                                            {currentZones.map((zone) => (
                                                <option key={zone.id} value={String(zone.id)}>
                                                    {zone.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
