"use client";

import { useState } from "react";
import { banUser } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function BanUserButton({ userId }: { userId: number }) {
    const [isPending, setIsPending] = useState(false);

    const handleBan = async () => {
        const reason = window.prompt("Παρακαλώ εισάγετε τον λόγο αποκλεισμού (Ban Reason):");
        if (!reason) return;

        setIsPending(true);
        try {
            await banUser(userId, reason);
            alert("Ο χρήστης αποκλείστηκε επιτυχώς.");
        } catch (error) {
            console.error(error);
            alert("Σφάλμα κατά τον αποκλεισμό του χρήστη.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleBan} 
            disabled={isPending}
            className="h-8 text-xs bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
        >
            {isPending ? "Αποκλεισμός..." : "Ban User"}
        </Button>
    );
}
