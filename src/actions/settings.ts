"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { changePasswordSchema, ChangePasswordValues } from "@/lib/schemas";

export async function changePassword(values: ChangePasswordValues) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Δεν είστε συνδεδεμένοι!" };
    }

    const validatedFields = changePasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Μη έγκυρα δεδομένα." };
    }

    const { currentPassword, newPassword } = validatedFields.data;
    const userId = parseInt(session.user.id, 10);

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user || !user.passwordHash) {
        return { error: "Ο χρήστης δεν βρέθηκε ή δεν έχει κωδικό πρόσβασης (π.χ. Google/Facebook login)." };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordsMatch) {
        return { error: "Ο τρέχων κωδικός πρόσβασης είναι λανθασμένος." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedPassword }
    });

    return { success: "Ο κωδικός πρόσβασης ενημερώθηκε επιτυχώς!" };
}

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
                    // Find all matchIds for these requests before deleting them
                    const matchParticipants = await tx.matchParticipant.findMany({
                        where: { requestId: { in: requestIds } },
                        select: { matchId: true }
                    });
                    const matchIds = matchParticipants.map(m => m.matchId);

                    // Delete TargetZones associated with requests
                    await tx.targetZone.deleteMany({
                        where: { requestId: { in: requestIds } }
                    });

                    // Delete MatchParticipants associated with requests
                    await tx.matchParticipant.deleteMany({
                        where: { requestId: { in: requestIds } }
                    });

                    // Check and delete orphaned matches
                    for (const mId of matchIds) {
                        const remainingCount = await tx.matchParticipant.count({
                            where: { matchId: mId }
                        });
                        if (remainingCount < 2) {
                            // Delete remaining participants
                            await tx.matchParticipant.deleteMany({
                                where: { matchId: mId }
                            });
                            
                            // Delete notifications
                            await tx.notification.deleteMany({
                                where: { matchId: mId }
                            });
                            
                            // Delete the match
                            await (tx as any).match.delete({
                                where: { id: mId }
                            });
                        }
                    }

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

import { getGenderFromName, getRandomColorForGender } from "@/lib/avatar-utils";

export async function updateName(newName: string, color?: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Δεν είστε συνδεδεμένοι!" };
    }

    const userId = parseInt(session.user.id, 10);
    
    let colorToUse = color;
    if (!colorToUse) {
        const gender = getGenderFromName(newName);
        colorToUse = getRandomColorForGender(gender);
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { 
                fullName: newName,
                avatarColor: colorToUse
            }
        });
        return { success: true, avatarColor: colorToUse };
    } catch (error) {
        console.error("Failed to update name:", error);
        return { error: "Αποτυχία ενημέρωσης ονόματος." };
    }
}

export async function updateAvatarColor(newColor: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Δεν είστε συνδεδεμένοι!" };
    }

    const userId = parseInt(session.user.id, 10);

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { 
                avatarColor: newColor
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update avatar color:", error);
        return { error: "Αποτυχία ενημέρωσης χρώματος." };
    }
}


