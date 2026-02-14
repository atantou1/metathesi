"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Step1Identity } from "./step1-identity"
import { Step2Locations } from "./step2-locations"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
// imports removed
// Actually, we can just call them in order. 
// Or create a new server action `submitWizard(data)` to handle transaction.
// For now, I'll assume we can use `createTransferRequest` but it takes `RequestValues`.
// I need a schema that covers BOTH steps.

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

export function WizardContainer({ initialData }: { initialData?: InitialData }) {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const { trigger, handleSubmit, formState: { isValid } } = methods

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
            const result = await submitWizardRequest(data)
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
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">

                <div className="flex-1">
                    {step === 1 && <Step1Identity />}
                    {step === 2 && <Step2Locations />}
                </div>

                {/* Footer Controls */}
                <div className="flex-none bg-white border-t border-slate-200 p-4 pb-8 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] z-20 sticky bottom-0">
                    <div className="max-w-xl mx-auto flex flex-col gap-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                            <span>Step {step} of 2</span>
                            <span>{step === 1 ? "Profile Setup" : "Locations"}</span>
                        </div>
                        <div className="flex gap-3">
                            {step === 2 && (
                                <Button
                                    type="button"
                                    onClick={prevStep}
                                    variant="outline"
                                    className="flex-1 rounded-xl py-6"
                                >
                                    Back
                                </Button>
                            )}

                            {step === 1 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 shadow-lg shadow-blue-500/20"
                                >
                                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 shadow-lg shadow-blue-500/20"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Request"} <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
