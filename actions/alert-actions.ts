"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fetches the most recent active emergency alert that hasn't expired.
 */
export async function getActiveAlert() {
    try {
        const alert = await prisma.emergencyAlert.findFirst({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return alert;
    } catch (error) {
        console.error("Error fetching active alert:", error);
        return null;
    }
}

/**
 * Creates a new emergency alert.
 */
export async function createEmergencyAlert(data: {
    title: string;
    message: string;
    severity: string;
    expiresAt?: Date | null;
}) {
    try {
        const alert = await prisma.emergencyAlert.create({
            data: {
                ...data,
                isActive: true
            }
        });

        revalidatePath('/');
        return alert;
    } catch (error) {
        console.error("Error creating alert:", error);
        throw new Error("Failed to create alert");
    }
}

/**
 * Deactivates all active alerts.
 */
export async function clearAllAlerts() {
    try {
        await prisma.emergencyAlert.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });

        revalidatePath('/');
    } catch (error) {
        console.error("Error clearing alerts:", error);
    }
}
