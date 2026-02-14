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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reorder, useDragControls } from "framer-motion"
import { getRegions, getZones, getZonesByIds } from "@/actions/profile" // Reuse profile actions for fetching
import { MapPin, Building2, Plus, X, GripVertical, AlertCircle } from "lucide-react"

type Option = { id: number; name: string }

export function Step2Locations() {
    const { control, watch, setValue, getValues, formState: { errors } } = useFormContext()
    const [isPending, startTransition] = useTransition()

    // State
    const [regions, setRegions] = useState<Option[]>([])
    const [currentZones, setCurrentZones] = useState<Option[]>([]) // For Current Position dropdown

    // Target Selection State
    const [targetRegions, setTargetRegions] = useState<Option[]>([]) // Reuse regions
    const [targetRegionId, setTargetRegionId] = useState<string>("")
    const [targetZoneOptions, setTargetZoneOptions] = useState<Option[]>([])

    // Watch fields
    const divisionId = watch("divisionId")
    const currentRegionId = watch("currentRegionId") // Helper field for UX (not in schema)
    const currentZoneId = watch("currentZoneId")
    const targetZoneIds = watch("targetZoneIds") || []

    // We need to fetch zone details for selected target IDs to display names
    // We will maintain a local map of loaded zones to display names.
    const [loadedZonesMap, setLoadedZonesMap] = useState<Map<number, string>>(new Map())

    // Initial Load - Regions & Existing Target Zones Names
    useEffect(() => {
        startTransition(async () => {
            const regs = await getRegions()
            setRegions(regs)
            setTargetRegions(regs)

            // Fetch names for existing targetZoneIds if any (Edit Mode)
            const initialIds = getValues("targetZoneIds") as number[]
            if (initialIds && initialIds.length > 0) {
                const zones = await getZonesByIds(initialIds)
                setLoadedZonesMap(prev => {
                    const next = new Map(prev)
                    zones.forEach(zone => next.set(zone.id, zone.name))
                    return next
                })
            }
        })
    }, [getValues])

    // Load Current Zones based on selected Region + Division (from Step 1)
    useEffect(() => {
        if (currentRegionId && divisionId) {
            startTransition(async () => {
                const z = await getZones(Number(currentRegionId), Number(divisionId))
                setCurrentZones(z)
                // Cache names
                setLoadedZonesMap(prev => {
                    const next = new Map(prev)
                    z.forEach(zone => next.set(zone.id, zone.name))
                    return next
                })
            })
        } else {
            setCurrentZones([])
        }
    }, [currentRegionId, divisionId])

    // Load Target Zones based on selected Target Region + Division
    useEffect(() => {
        if (targetRegionId && divisionId) {
            startTransition(async () => {
                const z = await getZones(Number(targetRegionId), Number(divisionId))
                setTargetZoneOptions(z.filter(zone => zone.id !== Number(currentZoneId))) // Exclude current zone
                // Cache names
                setLoadedZonesMap(prev => {
                    const next = new Map(prev)
                    z.forEach(zone => next.set(zone.id, zone.name))
                    return next
                })
            })
        } else {
            setTargetZoneOptions([])
        }
    }, [targetRegionId, divisionId, currentZoneId])


    const addTargetZone = (zoneIdStr: string) => {
        const id = Number(zoneIdStr)
        if (!targetZoneIds.includes(id)) {
            const newIds = [...targetZoneIds, id]
            setValue("targetZoneIds", newIds, { shouldValidate: true })
        }
        setTargetRegionId("") // Reset selection
    }

    const removeTargetZone = (id: number) => {
        const newIds = targetZoneIds.filter((tid: number) => tid !== id)
        setValue("targetZoneIds", newIds, { shouldValidate: true })
    }

    const handleReorder = (newOrder: number[]) => {
        setValue("targetZoneIds", newOrder, { shouldValidate: true })
    }

    // Helper to get name from ID
    const getZoneName = (id: number) => loadedZonesMap.get(id) || `Zone #${id}`

    return (
        <div className="max-w-xl mx-auto w-full pb-10 min-h-[550px]">

            <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-slate-900">Transfer Locations</h1>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md uppercase tracking-wide">Step 2 of 2</span>
                </div>
                {/* Progress Bar */}
                <div className="relative pt-2">
                    <div className="flex mb-2 items-center justify-between text-xs font-medium text-slate-500">
                        <span>Profile Info</span>
                        <span className="text-blue-600">Preferences</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-full shadow-[0_0_10px_rgba(29,78,216,0.3)]"></div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Section 1: Current Position */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">1</div>
                        <h2 className="text-base font-semibold text-slate-900">Current Position</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-soft border border-slate-200 overflow-hidden">
                        {/* Current Region Selector (Helper) */}
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                            <FormLabel className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Current Region</FormLabel>
                            <Select onValueChange={(val) => setValue("currentRegionId", val)} value={currentRegionId}>
                                <SelectTrigger className="border-none bg-transparent shadow-none p-0 h-auto text-sm font-medium text-slate-900 flex items-center gap-2 focus:ring-0">
                                    <SelectValue placeholder="Select Region..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4">
                            <FormField
                                control={control}
                                name="currentZoneId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-slate-700 mb-2">Posting Zone</FormLabel>
                                        <div className="relative">
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={field.value ? String(field.value) : undefined}
                                                disabled={!currentRegionId}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full pl-4 pr-10 py-3 text-sm border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 rounded-lg bg-white text-slate-900 h-auto shadow-sm">
                                                        <SelectValue placeholder="Select Zone" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {currentZones.map(z => <SelectItem key={z.id} value={String(z.id)}>{z.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Target Locations */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">2</div>
                            <h2 className="text-base font-semibold text-slate-900">Target Locations</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setValue("targetZoneIds", [])}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-xs text-blue-900/70 leading-relaxed">
                            Select zones. Top item is highest priority. Drag to reorder.
                        </p>
                    </div>

                    {/* List of Selected Zones with Reorder */}
                    <div className="space-y-3 relative mb-4">
                        <Reorder.Group axis="y" values={targetZoneIds} onReorder={handleReorder} className="space-y-3">
                            {targetZoneIds.map((id: number, index: number) => (
                                <Reorder.Item key={id} value={id} className="focus:outline-none">
                                    <div className="group bg-white rounded-xl p-1 shadow-sm border border-slate-200 hover:border-blue-600/30 transition-all flex items-center justify-between relative overflow-hidden cursor-grab active:cursor-grabbing">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${index === 0 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                        <div className="flex items-center gap-3 p-3 pl-4 flex-1">
                                            <div className="h-6 w-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold font-mono">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{getZoneName(id)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center pr-2 border-l border-slate-50 pl-1 h-full py-2 gap-1">
                                            <GripVertical className="w-5 h-5 text-slate-300" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    // Prevent drag start if clicking remove
                                                    // Framer motion usually handles this but good to be safe
                                                    removeTargetZone(id)
                                                }}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10 relative" // Ensure clickability
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>

                    {/* Add New Mockup / Real input */}
                    <div className="grid grid-cols-2 gap-3">
                        <Select onValueChange={setTargetRegionId} value={targetRegionId}>
                            <SelectTrigger className="h-12 border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all bg-white shadow-sm">
                                <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent>
                                {targetRegions.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={addTargetZone}
                            disabled={!targetRegionId || targetZoneOptions.length === 0}
                            value=""
                        >
                            <SelectTrigger className="h-12 border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all bg-white shadow-sm">
                                <SelectValue placeholder="Add Location +" />
                            </SelectTrigger>
                            <SelectContent>
                                {targetZoneOptions.map(z => <SelectItem key={z.id} value={String(z.id)}>{z.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {errors.targetZoneIds && <p className="text-red-500 text-sm mt-2">{errors.targetZoneIds.message as string}</p>}
                </section>
            </div>
        </div>
    )
}
