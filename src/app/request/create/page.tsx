import { WizardContainer } from "@/components/request/wizard/wizard-container"
import { getTransferRequest, getUserProfile } from "@/actions/request"

export default async function CreateRequestPage() {
    const [request, profile] = await Promise.all([
        getTransferRequest(),
        getUserProfile()
    ])

    // Construct Initial Data
    const initialData = {
        fullName: profile?.fullName || "", // Or user name if we had it available in this query, but profile update handles it
        divisionId: profile?.divisionId,
        specialtyId: profile?.specialtyId,
        currentRegionId: profile?.currentZone?.regionId,
        currentZoneId: profile?.currentZoneId,
        targetZoneIds: request?.targetZones.map(tz => tz.zoneId) // Map to IDs
    }

    return (
        <div className="container mx-auto py-8 pt-24">
            <WizardContainer initialData={initialData} />
        </div>
    )
}
