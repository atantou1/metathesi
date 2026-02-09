"use client"

import { useTransition, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { requestSchema, RequestValues } from "@/lib/schemas"
import { createTransferRequest, getUserProfile, getAvailableZones, deleteTransferRequest } from "@/actions/request"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, CheckCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Option = { id: number; name: string }

type TransferRequestWithZones = {
    id: number
    status: string
    targetZones: {
        id: number
        priorityOrder: number
        zone: {
            name: string
        }
    }[]
}

type Props = {
    initialRequest?: TransferRequestWithZones | null
}

export function RequestForm({ initialRequest }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isDeleting, startDeleteTransition] = useTransition()

    const [currentZone, setCurrentZone] = useState<Option | null>(null)

    const [selectedZones, setSelectedZones] = useState<Option[]>([])
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [success, setSuccess] = useState(false)

    const form = useForm<RequestValues>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            targetZoneIds: [] as number[],
        },
    })

    // Load Profile and Available Zones
    useEffect(() => {
        async function loadData() {
            try {
                const profile = await getUserProfile()
                if (profile) {
                    setCurrentZone(profile.currentZone)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoadingProfile(false)
            }
        }
        loadData()
    }, [])

    // Region state for adding new target
    const [regions, setRegions] = useState<Option[]>([]) // Need to fetch regions
    const [selectedRegionId, setSelectedRegionId] = useState<string>("")
    const [zoneOptions, setZoneOptions] = useState<Option[]>([])

    // Fetch regions on mount (could import getRegions from profile actions)
    useEffect(() => {
        // We can reuse getRegions from actions/profile. 
        // Just implicit import would work if I export it? 
        // I'll import it.
        import("@/actions/profile").then(({ getRegions }) => {
            getRegions().then(setRegions)
        })
    }, [])

    // Fetch zones when region changes
    useEffect(() => {
        if (selectedRegionId) {
            // We need division ID to filter zones correctly?
            // `getUserProfile` returns division.
            // We should store divisionId from profile.
            const fetchZones = async () => {
                const profile = await getUserProfile() // This is redundant call, optimized later
                if (profile) {
                    const z = await getAvailableZones(Number(selectedRegionId), profile.divisionId)
                    // Filter out current zone and already selected zones
                    const filtered = z.filter((zone: Option) =>
                        zone.id !== profile.currentZoneId &&
                        !selectedZones.some((sz: Option) => sz.id === zone.id)
                    )
                    setZoneOptions(filtered)
                }
            }
            fetchZones()
        } else {
            setZoneOptions([])
        }
    }, [selectedRegionId, selectedZones])

    const addZone = (zoneIdStr: string) => {
        const zoneId = Number(zoneIdStr)
        const zone = zoneOptions.find(z => z.id === zoneId)
        if (zone) {
            const newSelected = [...selectedZones, zone]
            setSelectedZones(newSelected)
            form.setValue("targetZoneIds", newSelected.map(z => z.id))
            // Reset selection
            setSelectedRegionId("")
        }
    }

    const removeZone = (zoneId: number) => {
        const newSelected = selectedZones.filter(z => z.id !== zoneId)
        setSelectedZones(newSelected)
        form.setValue("targetZoneIds", newSelected.map(z => z.id))
    }

    function onSubmit(values: RequestValues) {
        if (selectedZones.length === 0) {
            form.setError("root", { message: "Επιλέξτε τουλάχιστον μία περιοχή." })
            return
        }
        startTransition(async () => {
            try {
                const result = await createTransferRequest(values)
                if (result?.error) {
                    form.setError("root", { message: result.error })
                } else if (result?.success) {
                    setSuccess(true)
                    router.refresh() // Refresh to update server state (though we show success UI locally)
                }
            } catch (error) {
                form.setError("root", { message: "Κάτι πήγε στραβά." })
            }
        })
    }

    function handleDelete() {
        if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε την αίτηση;")) return;

        startDeleteTransition(async () => {
            const result = await deleteTransferRequest()
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error)
            }
        })
    }

    if (loadingProfile) return <div>Φόρτωση...</div>

    // SUCCESS STATE
    if (success) {
        return (
            <Card className="w-full max-w-2xl mx-auto border-green-200 bg-green-50">
                <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                    <h2 className="text-2xl font-bold text-green-800">Επιτυχής Καταχώρηση!</h2>
                    <p className="text-green-700">Η αίτησή σας υποβλήθηκε με επιτυχία.</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                        Επιστροφή
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // EXISTING REQUEST STATE
    if (initialRequest) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center text-xl">
                        <span>Ενεργή Αίτηση</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {initialRequest.status === 'active' ? 'Ενεργή' : initialRequest.status}
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Έχετε ήδη υποβάλει αίτηση μετάθεσης.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Επιλεγμένες Περιοχές (με σειρά προτεραιότητας):</h4>
                        <div className="space-y-2">
                            {initialRequest.targetZones.map((tz) => (
                                <div key={tz.id} className="p-2 bg-slate-50 border rounded flex items-center gap-3">
                                    <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0">
                                        {tz.priorityOrder}
                                    </Badge>
                                    <span className="font-medium">{tz.zone.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Διαγραφή..." : "Διαγραφή Αίτησης"}
                            <Trash2 className="w-4 h-4 ml-2" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            * Για να υποβάλετε νέα αίτηση, πρέπει πρώτα να διαγράψετε την τρέχουσα.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // NEW REQUEST FORM (Existing Rendering)
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Αίτηση Μετάθεσης</CardTitle>
                <CardDescription>
                    Τρέχουσα Οργανική: <span className="font-semibold">{currentZone?.name || "-"}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                            <h3 className="font-medium">Προσθήκη Επιλογών (Κατά σειρά προτίμησης)</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormItem>
                                    <FormLabel>Περιφέρεια</FormLabel>
                                    <Select
                                        onValueChange={setSelectedRegionId}
                                        value={selectedRegionId}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Επιλογή..." />
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

                                <FormItem>
                                    <FormLabel>Περιοχή</FormLabel>
                                    <Select
                                        onValueChange={addZone}
                                        disabled={!selectedRegionId || zoneOptions.length === 0}
                                        value="" // Always reset?
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Επιλογή..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {zoneOptions.map((zone) => (
                                                <SelectItem key={zone.id} value={String(zone.id)}>
                                                    {zone.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Επιλεγμένες Περιοχές:</h4>
                            {selectedZones.length === 0 && <p className="text-sm text-muted-foreground italic">Καμία επιλογή.</p>}
                            <div className="flex flex-wrap gap-2">
                                {selectedZones.map((zone, index) => (
                                    <Badge key={zone.id} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2">
                                        {index + 1}. {zone.name}
                                        <X
                                            className="w-4 h-4 cursor-pointer hover:text-red-500"
                                            onClick={() => removeZone(zone.id)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {form.formState.errors.root && (
                            <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
                        )}

                        {form.formState.errors.targetZoneIds && (
                            <div className="text-red-500 text-sm">{form.formState.errors.targetZoneIds.message}</div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Υποβολή..." : "Υποβολή Αίτησης"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
