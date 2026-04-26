"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Step1Identity } from "./step1-identity"
import { Step2Locations } from "./step2-locations"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"

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

    const { handleSubmit } = methods

    const onSubmit = async (data: WizardValues) => {
        setIsSubmitting(true)
        try {
            const payload = { ...data, requestId }
            const result = await submitWizardRequest(payload)
            if (result?.success) {
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
            <form onSubmit={handleSubmit(onSubmit)} className="text-foreground antialiased min-h-screen pb-20">
                {/* Sticky Navbar */}
                <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center gap-4">
                                <button 
                                    type="button"
                                    onClick={() => window.location.href = "/dashboard"}
                                    className="p-2 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                                        {isEditing ? "Επεξεργασία Αίτησης" : "Δημιουργία Αίτησης"}
                                    </h1>
                                    <p className="text-[11px] font-medium text-muted-foreground">Επιβεβαίωση στοιχείων και επιλογή περιοχών</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                    {/* Identity Section */}
                    <Step1Identity />

                    {/* Locations Section */}
                    <Step2Locations />

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-end pt-4">
                        <span className="text-[11px] text-muted-foreground font-medium mr-auto hidden sm:block">
                            Τα δεδομένα επεξεργάζονται με ασφάλεια βάσει GDPR.
                        </span>
                        <button 
                            type="button" 
                            onClick={() => window.location.href = "/dashboard"}
                            className="w-full sm:w-auto bg-card border border-border hover:bg-muted text-muted-foreground px-8 py-3.5 rounded-2xl text-sm font-semibold transition-colors cursor-pointer"
                        >
                            Ακύρωση
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-floating active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Επεξεργασία..." : (isEditing ? "Αποθήκευση Αλλαγών" : "Υποβολή Αίτησης")}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
