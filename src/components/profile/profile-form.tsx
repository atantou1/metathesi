"use client"

import { useTransition, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileValues } from "@/lib/schemas"
import { createProfile, getDivisions, getSpecialties, getRegions, getZones } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import {
    Form,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const SECTOR_ID_EDUCATION = 1
const SECTOR_NAME_EDUCATION = "Εκπαίδευση"

type Option = { id: number; name: string; code?: string }

export function ProfileForm() {
    const [isPending, startTransition] = useTransition()

    // Options State
    const [divisions, setDivisions] = useState<Option[]>([])
    const [specialties, setSpecialties] = useState<Option[]>([])
    const [regions, setRegions] = useState<Option[]>([])
    const [zones, setZones] = useState<Option[]>([])

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            divisionId: 0,
            specialtyId: 0,
            currentZoneId: 0,
        },
    })

    // Watch fields for cascading logic
    const selectedDivisionId = form.watch("divisionId")
    const selectedRegionId = form.getValues("currentZoneId") // This is tricky, region is not in schema but needed for UI logic
    // We need a separate state for selectedRegion if it's not part of the final submission?
    // Or we can add it to the form but not submit it?
    // Let's add independent state for region selection UI
    const [selectedRegion, setSelectedRegion] = useState<string>("")

    // Initial Data Load (Divisions & Regions)
    useEffect(() => {
        startTransition(async () => {
            const [divs, regs] = await Promise.all([getDivisions(), getRegions()])
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
                form.setValue("specialtyId", 0) // Reset specialty when division changes
            })
        } else {
            setSpecialties([])
        }
    }, [selectedDivisionId, form])

    // Cascade: Region + Division -> Zones
    useEffect(() => {
        if (selectedRegion && selectedDivisionId) {
            startTransition(async () => {
                const z = await getZones(Number(selectedRegion), Number(selectedDivisionId))
                setZones(z)
                form.setValue("currentZoneId", 0)
            })
        } else {
            setZones([])
        }
    }, [selectedRegion, selectedDivisionId, form])

    function onSubmit(values: ProfileValues) {
        startTransition(async () => {
            try {
                const result = await createProfile(values)
                if (result?.error) {
                    form.setError("root", { message: result.error })
                }
            } catch (error) {
                form.setError("root", { message: "Κάτι πήγε στραβά." })
            }
        })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Ρύθμιση Επαγγελματικού Προφίλ</CardTitle>
                <CardDescription>Συμπληρώστε τα στοιχεία της τρέχουσας θέσης σας.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Sector - Fixed */}
                        <FormItem>
                            <FormLabel>Τομέας</FormLabel>
                            <Input value={SECTOR_NAME_EDUCATION} disabled />
                        </FormItem>

                        {/* Division */}
                        <FormField
                            control={form.control}
                            name="divisionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Βαθμίδα Εκπαίδευσης</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? String(field.value) : undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Επιλέξτε Βαθμίδα" />
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Specialty */}
                        <FormField
                            control={form.control}
                            name="specialtyId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ειδικότητα</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value ? String(field.value) : undefined}
                                        disabled={!selectedDivisionId}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Επιλέξτε Ειδικότητα" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {specialties.map((spec) => (
                                                <SelectItem key={spec.id} value={String(spec.id)}>
                                                    {spec.code} - {spec.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {!selectedDivisionId && <p className="text-xs text-muted-foreground">Επιλέξτε πρώτα βαθμίδα.</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Current Position Group */}
                        <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                            <h3 className="font-medium">Τρέχουσα Θέση</h3>

                            {/* Region Selection (UI Only) */}
                            <FormItem>
                                <FormLabel>Περιφέρεια</FormLabel>
                                <Select
                                    onValueChange={(val) => setSelectedRegion(val)}
                                    value={selectedRegion}
                                    disabled={!selectedDivisionId}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Επιλέξτε Περιφέρεια" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {regions.map((reg) => (
                                            <SelectItem key={reg.id} value={String(reg.id)}>
                                                {reg.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>

                            {/* Zone Selection */}
                            <FormField
                                control={form.control}
                                name="currentZoneId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Περιοχή Μετάθεσης / Ζώνη</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value ? String(field.value) : undefined}
                                            disabled={!selectedRegion || !selectedDivisionId}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Επιλέξτε Ζώνη" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {zones.map((zone) => (
                                                    <SelectItem key={zone.id} value={String(zone.id)}>
                                                        {zone.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Bio, Hire Date, Service Time removed for Phase 1 simplification */}

                        {form.formState.errors.root && (
                            <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Αποθήκευση Προφίλ..." : "Δημιουργία Προφίλ"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
