import { getPendingDrafts } from "@/app/actions/drafts";
import { DraftCard } from "@/components/drafts/draft-card";
import { ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DraftsPage() {
    const drafts = await getPendingDrafts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Drafts</h1>
                        <p className="text-muted-foreground">
                            Review and approve {drafts.length} pending AI-extracted orders
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {drafts.length > 0 ? (
                    drafts.map((draft) => <DraftCard key={draft.id} draft={draft} />)
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/50 text-muted-foreground">
                        <ListChecks className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No pending drafts</p>
                        <p className="text-sm">Incoming voice calls and messages will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
