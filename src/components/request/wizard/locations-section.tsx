"use client"

import { useEffect, useState, useTransition } from "react"
import { useFormContext } from "react-hook-form"
import { Reorder } from "framer-motion"
import { getRegions, getZones, getZonesByIds } from "@/actions/profile"
import { MapPin, Trash2, GripVertical, Plus, ChevronDown } from "lucide-react"

type Option = { id: number; name: string }

export function LocationsSection() {
    const { control, watch, setValue, getValues, formState: { errors } } = useFormContext()
    const [isPending, startTransition] = useTransition()

    // State
    const [regions, setRegions] = useState<Option[]>([])
    const [targetRegionId, setTargetRegionId] = useState<string>("")
    const [targetZoneOptions, setTargetZoneOptions] = useState<Option[]>([])
    const [loadedZonesMap, setLoadedZonesMap] = useState<Map<number, string>>(new Map())

    // Watch fields
    const divisionId = watch("divisionId")
    const currentZoneId = watch("currentZoneId")
    const targetZoneIds = watch("targetZoneIds") || []

    // Initial Load - Regions & Existing Target Zones Names
    useEffect(() => {
        startTransition(async () => {
            const regs = await getRegions()
            setRegions(regs)

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

    // Load Target Zones based on selected Target Region + Division
    useEffect(() => {
        if (targetRegionId && divisionId) {
            startTransition(async () => {
                const z = await getZones(Number(targetRegionId), Number(divisionId))
                setTargetZoneOptions(z.filter(zone => zone.id !== Number(currentZoneId)))
                
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


    const addTargetZone = (id: number) => {
        if (!targetZoneIds.includes(id)) {
            const newIds = [...targetZoneIds, id]
            setValue("targetZoneIds", newIds, { shouldValidate: true })
        }
        setTargetRegionId("") 
    }

    const removeTargetZone = (id: number) => {
        const newIds = targetZoneIds.filter((tid: number) => tid !== id)
        setValue("targetZoneIds", newIds, { shouldValidate: true })
    }

    const handleReorder = (newOrder: number[]) => {
        setValue("targetZoneIds", newOrder, { shouldValidate: true })
    }

    const getZoneName = (id: number) => loadedZonesMap.get(id) || `Περιοχή #${id}`

    return (
        <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-success-soft text-success">
                            <MapPin className="w-5 h-5" />
                        </div>
                        Περιοχές Προτίμησης
                    </h2>
                    <p className="text-xs font-medium text-muted-foreground mt-2 pl-12">Ορίστε τις περιοχές που επιθυμείτε με σειρά προτεραιότητας.</p>
                </div>
                <button 
                    type="button" 
                    onClick={() => setValue("targetZoneIds", [], { shouldValidate: true })}
                    className="text-[11px] font-bold text-muted-foreground hover:text-danger bg-muted hover:bg-danger-soft px-3 py-1.5 rounded-2xl transition-colors border border-border hover:border-danger/20 cursor-pointer"
                >
                    Καθαρισμός
                </button>
            </div>

            <div className="space-y-3 pl-0 sm:pl-12">
                <Reorder.Group axis="y" values={targetZoneIds} onReorder={handleReorder} className="space-y-3">
                    {targetZoneIds.map((id: number, index: number) => (
                        <Reorder.Item key={id} value={id} className="focus:outline-none">
                            <div className="group bg-card rounded-2xl p-2 shadow-soft border border-border hover:border-primary/30 transition-all flex items-center justify-between cursor-grab active:cursor-grabbing">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`h-8 w-8 rounded-2xl flex items-center justify-center text-xs font-bold border ${
                                        index === 0 ? 'bg-danger-soft text-danger border-danger/20' : 
                                        index === 1 ? 'bg-warning-soft text-warning border-warning/20' :
                                        'bg-muted text-muted-foreground border-border'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {getZoneName(id)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pr-2">
                                    <button 
                                        type="button" 
                                        onClick={() => removeTargetZone(id)}
                                        className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger-soft rounded-2xl transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <GripVertical className="w-5 h-5 text-muted-foreground/50" />
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div className="relative">
                        <select 
                            className="w-full h-12 pl-4 pr-10 border-dashed border-border border-2 rounded-2xl text-muted-foreground text-sm font-medium focus:border-primary focus:bg-primary-soft focus:text-primary transition-all bg-muted appearance-none cursor-pointer focus:outline-none"
                            value={targetRegionId}
                            onChange={(e) => setTargetRegionId(e.target.value)}
                        >
                            <option value="">Επιλογή Περιφέρειας...</option>
                            {regions.map(r => <option key={r.id} value={String(r.id)}>{r.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    
                    <div className="relative">
                        <select 
                            className="w-full h-12 pl-4 pr-10 border-dashed border-border border-2 rounded-2xl text-muted-foreground text-sm font-medium focus:border-primary focus:bg-primary-soft focus:text-primary transition-all bg-muted appearance-none cursor-pointer focus:outline-none disabled:opacity-50"
                            disabled={!targetRegionId || targetZoneOptions.length === 0}
                            value=""
                            onChange={(e) => addTargetZone(Number(e.target.value))}
                        >
                            <option value="">Προσθήκη Περιοχής...</option>
                            {targetZoneOptions.map(z => <option key={z.id} value={String(z.id)}>{z.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-quaternary pointer-events-none" />
                    </div>
                </div>
                {errors.targetZoneIds && (
                    <p className="text-danger text-xs font-bold mt-2 pl-12">
                        {errors.targetZoneIds?.message as string}
                    </p>
                )}
            </div>
        </div>
    )
}
