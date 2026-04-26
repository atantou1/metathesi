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

interface ProfileFormProps {
    initialData?: {
        divisionId: number
        specialtyId: number
        currentZoneId: number
        division: { name: string }
        specialty: { name: string, code: string }
        currentZone: { name: string, region: { name: string, id: number } }
    } | null
}

import { updateProfile } from "@/actions/profile" // Import update action

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(!initialData) // Edit if no data

    // Options State
    const [divisions, setDivisions] = useState<Option[]>([])
    const [specialties, setSpecialties] = useState<Option[]>([])
    const [regions, setRegions] = useState<Option[]>([])
    const [zones, setZones] = useState<Option[]>([])

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            divisionId: initialData?.divisionId || 0,
            specialtyId: initialData?.specialtyId || 0,
            currentZoneId: initialData?.currentZoneId || 0,
        },
    })

    // Watch fields for cascading logic
    const selectedDivisionId = form.watch("divisionId")

    // Initial Region state (derived from initialData if present)
    const [selectedRegion, setSelectedRegion] = useState<string>(
        initialData?.currentZone?.region?.id ? String(initialData.currentZone.region.id) : ""
    )

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
                // Only reset if we are editing and value doesn't match initial data (or we are strictly in edit flow)
                // Actually, if division changes, specialty MUST exist in new division. 
                // Simple logic: if editing, reset. If loading initial, keep.
                // But this effect runs on mount too if defaultValues are set.
                // We need to be careful not to reset initial data on first load.
                const currentSpecId = form.getValues("specialtyId")
                const isValid = specs.find(s => s.id === currentSpecId)
                if (!isValid && isEditing) {
                    form.setValue("specialtyId", 0)
                }
            })
        } else {
            setSpecialties([])
        }
    }, [selectedDivisionId, form, isEditing])

    // Cascade: Region + Division -> Zones
    useEffect(() => {
        if (selectedRegion && selectedDivisionId) {
            startTransition(async () => {
                const z = await getZones(Number(selectedRegion), Number(selectedDivisionId))
                setZones(z)
                const currentZoneId = form.getValues("currentZoneId")
                const isValid = z.find(zo => zo.id === currentZoneId)
                if (!isValid && isEditing) {
                    form.setValue("currentZoneId", 0)
                }
            })
        } else {
            setZones([])
        }
    }, [selectedRegion, selectedDivisionId, form, isEditing])

    function onSubmit(values: ProfileValues) {
        startTransition(async () => {
            try {
                // If initialData exists, we update. Else create.
                const result = initialData
                    ? await updateProfile(values)
                    : await createProfile(values)

                if (result?.error) {
                    form.setError("root", { message: result.error })
                } else {
                    setIsEditing(false)
                }
            } catch (error) {
                form.setError("root", { message: "Κάτι πήγε στραβά." })
            }
        })
    }

    if (!isEditing && initialData) {
        return (
            <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-blue-500 shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Το Προφίλ μου</CardTitle>
                            <CardDescription>Τα στοιχεία της τρέχουσας θέσης σας.</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            Επεξεργασία
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Τομέας</span>
                            <p className="font-semibold">{SECTOR_NAME_EDUCATION}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Βαθμίδα</span>
                            <p className="font-semibold">{initialData.division.name}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <span className="text-sm font-medium text-muted-foreground">Ειδικότητα</span>
                            <p className="font-semibold">{initialData.specialty.code} - {initialData.specialty.name}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Περιφέρεια</span>
                            <p className="font-semibold">{initialData.currentZone.region.name}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Περιοχή / Ζώνη</span>
                            <p className="font-semibold">{initialData.currentZone.name}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? "Επεξεργασία Προφίλ" : "Ρύθμιση Επαγγελματικού Προφίλ"}</CardTitle>
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
                        <div className="space-y-4 border p-4 rounded-2xl bg-slate-50">
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

                        {form.formState.errors.root && (
                            <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
                        )}

                        <div className="flex gap-4">
                            {initialData && (
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="w-full">
                                    Ακύρωση
                                </Button>
                            )}
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Αποθήκευση..." : (initialData ? "Ενημέρωση Προφίλ" : "Δημιουργία Προφίλ")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
