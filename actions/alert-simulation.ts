"use server";

import { createEmergencyAlert, clearAllAlerts } from "@/actions/alert-actions";

/**
 * Simulates the "Dangerous Snow Storm" scenario by creating a live alert.
 */
export async function simulateSnowStormAlert() {
    await clearAllAlerts(); // Clean up old alerts first

    return await createEmergencyAlert({
        title: "Dangerous Snow Storm: Red Warning",
        message: "Public transport is cancelled. Authorities warn to stay indoors—driving is extremely dangerous due to zero visibility and icy roads.",
        severity: "severe",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Valid for 24 hours
    });
}

/**
 * Ends all active alerts.
 */
export async function resolveAllEmergencySituations() {
    return await clearAllAlerts();
}
