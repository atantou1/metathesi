"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteAccount() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Δεν είστε συνδεδεμένοι!" };
    }

    const userId = parseInt(session.user.id, 10);

    try {
        // Find profile to delete related data bottom-up
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                transferRequests: {
                    select: { id: true }
                }
            }
        });

        // Use a transaction to ensure atomic deletion of all user data
        await prisma.$transaction(async (tx) => {
            if (profile) {
                const requestIds = profile.transferRequests.map(r => r.id);

                if (requestIds.length > 0) {
                    // Delete TargetZones associated with requests
                    await tx.targetZone.deleteMany({
                        where: { requestId: { in: requestIds } }
                    });

                    // Delete MatchParticipants associated with requests
                    await tx.matchParticipant.deleteMany({
                        where: { requestId: { in: requestIds } }
                    });

                    // Delete the TransferRequests
                    await tx.transferRequest.deleteMany({
                        where: { profileId: profile.id }
                    });
                }

                // Delete Messages sent by the user
                await tx.message.deleteMany({
                    where: { senderProfileId: profile.id }
                });

                // Delete Notifications for the user
                await tx.notification.deleteMany({
                    where: { profileId: profile.id }
                });

                // Delete the Profile
                await tx.profile.delete({
                    where: { id: profile.id }
                });
            }

            // Finally, delete the User.
            // (Accounts and Sessions will cascade delete as per Prisma schema)
            await tx.user.delete({
                where: { id: userId }
            });
        });

        // Log out user & redirect to home/login handled by UI after success response
        return { success: "Ο λογαριασμός σας διαγράφηκε επιτυχώς." };
    } catch (error) {
        console.error("Failed to delete account:", error);
        return { error: "Αποτυχία διαγραφής λογαριασμού. Παρακαλώ δοκιμάστε ξανά." };
    }
}
