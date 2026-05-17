import { getTransferRequestsList } from "@/actions/admin";
import { ApplicationsTable } from "@/components/admin/applications-table";

export default async function AdminApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; sort?: string }>;
}) {
    const params = await searchParams;
    const applications = await getTransferRequestsList();

    // Filter in memory for now
    let filteredApplications = applications;
    if (params.status === "active") {
        filteredApplications = applications.filter((app) => app.status === "active");
    } else if (params.status === "matched") {
        filteredApplications = applications.filter((app: any) => 
            app.matchParticipations && app.matchParticipations.some((mp: any) => mp.match.status === "active")
        );
    } else if (params.status) {
        filteredApplications = applications.filter((app) => app.status === params.status);
    }

    if (params.sort === "asc") {
        filteredApplications.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else {
        filteredApplications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">Αιτήσεις</h2>
                <p className="text-muted-foreground dark:text-text-quaternary mt-2">Διαχείριση και επισκόπηση όλων των αιτήσεων μετάθεσης.</p>
            </div>

            <ApplicationsTable applications={filteredApplications} />
        </div>
    );
}
