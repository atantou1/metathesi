"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Role, UserStatus } from "@prisma/client";

const verifyAdmin = async () => {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        throw new Error("Unauthorized access");
    }
    return session.user;
};

export async function getAdminDashboardStats() {
    await verifyAdmin();
    
    const [totalUsers, activeRequests, totalMatches] = await Promise.all([
        prisma.user.count(),
        prisma.transferRequest.count({ where: { status: "active" } }),
        prisma.match.count()
    ]);

    return { totalUsers, activeRequests, totalMatches };
}

export async function getUsersList() {
    await verifyAdmin();
    return await prisma.user.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            banReason: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50, // Just for admin dashboard simplicity right now
    });
}

export async function banUser(userId: number, reason: string) {
    const admin = await verifyAdmin();
    
    await prisma.user.update({
        where: { id: userId },
        data: {
            status: "BANNED",
            banReason: reason,
            bannedAt: new Date()
        }
    });

    await prisma.adminAuditLog.create({
        data: {
            adminId: parseInt(admin.id, 10),
            targetUserId: userId,
            action: "USER_BANNED",
            details: { reason }
        }
    });

    revalidatePath("/admin/users");
    return { success: true };
}

// Dev helper to quickly elevate current logged user to SUPERADMIN
export async function elevateSelfToAdmin() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not logged in");

    await prisma.user.update({
        where: { id: parseInt(session.user.id, 10) },
        data: { role: "SUPERADMIN" }
    });
    
    return { success: true };
}
