import { WizardContainer } from "@/components/request/wizard/wizard-container"
import { getTransferRequest, getUserProfile } from "@/actions/request"

export default async function CreateRequestPage() {
    const [request, profile] = await Promise.all([
        getTransferRequest(),
        getUserProfile()
    ])

    // Construct Initial Data
    const initialData = {
        fullName: (profile as any)?.user?.fullName || "", 
        divisionId: profile?.divisionId,
        specialtyId: profile?.specialtyId,
        currentRegionId: profile?.currentZone?.regionId,
        currentZoneId: profile?.currentZoneId,
        targetZoneIds: request?.targetZones.map(tz => tz.zoneId) // Map to IDs
    }

    return (
        <main className="min-h-screen bg-surface-dim">
            <WizardContainer initialData={initialData} requestId={request?.id} />
        </main>
    )
}
