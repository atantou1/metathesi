"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Step1Identity } from "./step1-identity"
import { Step2Locations } from "./step2-locations"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Define Unified Schema
const wizardSchema = z.object({
    // Step 1
    fullName: z.string().min(3, "Full Name is required"),
    divisionId: z.number().min(1, "Required"),
    specialtyId: z.number().min(1, "Required"),

    // Step 2
    currentRegionId: z.string().optional(), // Helper, not sent to DB
    currentZoneId: z.number().min(1, "Required"),
    targetZoneIds: z.array(z.number()).min(1, "Select at least one target location"),
})

type WizardValues = z.infer<typeof wizardSchema>

import { submitWizardRequest } from "../../../actions/wizard"

// Initial Data Type (Partial)
type InitialData = {
    fullName?: string
    divisionId?: number
    specialtyId?: number
    currentRegionId?: number
    currentZoneId?: number
    targetZoneIds?: number[]
}

export function WizardContainer({ initialData, requestId }: { initialData?: InitialData, requestId?: number }) {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!requestId

    const methods = useForm<WizardValues>({
        resolver: zodResolver(wizardSchema),
        defaultValues: {
            fullName: initialData?.fullName || "",
            divisionId: initialData?.divisionId || 0,
            specialtyId: initialData?.specialtyId || 0,
            currentRegionId: initialData?.currentRegionId ? String(initialData.currentRegionId) : "",
            currentZoneId: initialData?.currentZoneId || 0,
            targetZoneIds: initialData?.targetZoneIds || [],
        },
        mode: "onChange"
    })

    const { trigger, handleSubmit } = methods

    const nextStep = async (e?: React.MouseEvent) => {
        e?.preventDefault()
        // Validate Step 1 fields
        const valid = await trigger(["fullName", "divisionId", "specialtyId"])
        if (valid) {
            setStep(2)
        }
    }

    const prevStep = () => setStep(1)

    const onSubmit = async (data: WizardValues) => {
        setIsSubmitting(true)
        try {
            // Pass requestId along with data
            const payload = { ...data, requestId }
            const result = await submitWizardRequest(payload)
            if (result?.success) {
                // Redirect or show success
                window.location.href = "/dashboard"
            } else {
                alert(result?.error || "Error submitting request")
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="h-[calc(100vh-64px)] flex flex-col">
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 pb-0 md:p-8">
                    {step === 1 && <Step1Identity onNext={() => nextStep()} />}
                    {step === 2 && <Step2Locations />}
                </div>

                {/* Footer Controls - Hidden on Step 1 as it has its own button */}
                {step !== 1 && (
                    <div className="flex-none bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 pb-8 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] z-20">
                        <div className="max-w-xl mx-auto flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                                <span>Step {step} of 2</span>
                                <span>Locations</span>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={prevStep}
                                    variant="outline"
                                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-6 px-6 rounded-xl border border-slate-200 active:scale-[0.98] transition-all"
                                >
                                    Πίσω
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Processing..." : (isEditing ? "Αποθήκευση Αλλαγών" : "Υποβολή Αίτησης")} <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    )
}
