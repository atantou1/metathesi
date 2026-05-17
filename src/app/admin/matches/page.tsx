import { getMatchesList } from "@/actions/admin";
import { MatchesTable } from "@/components/admin/matches-table";

export default async function AdminMatchesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; sort?: string }>;
}) {
    const params = await searchParams;
    const matches = await getMatchesList();

    // Filter in memory for now
    let filteredMatches = matches;
    if (params.status === "active") {
        filteredMatches = matches.filter((m) => m.status === "active");
    } else if (params.status === "inactive") {
        filteredMatches = matches.filter((m) => m.status !== "active");
    }

    if (params.sort === "asc") {
        filteredMatches.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else {
        filteredMatches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">Matches</h2>
                <p className="text-muted-foreground dark:text-text-quaternary mt-2">Διαχείριση και επισκόπηση όλων των matches.</p>
            </div>

            <MatchesTable matches={filteredMatches} />
        </div>
    );
}
