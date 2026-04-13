import { prisma } from "./prisma";

/**
 * Basic server-side rate limiter using the database.
 * @param ip IP address of the requester
 * @param endpoint The API endpoint being accessed
 * @param limit Maximum number of requests allowed in the duration
 * @param durationMs Time window in milliseconds
 * @returns boolean true if the request is allowed, false if ratelimited
 */
export async function checkRateLimit(ip: string, endpoint: string, limit: number, durationMs: number): Promise<boolean> {
    const windowStart = new Date(Date.now() - durationMs);

    try {
        // Count previous requests in the window
        const count = await prisma.apiRateLimit.count({
            where: {
                ip,
                endpoint,
                timestamp: {
                    gte: windowStart
                }
            }
        });

        if (count >= limit) {
            return false;
        }

        // Log the current request
        await prisma.apiRateLimit.create({
            data: {
                ip,
                endpoint,
                timestamp: new Date()
            }
        });

        // Cleanup old logs (async, don't wait)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        prisma.apiRateLimit.deleteMany({
            where: {
                timestamp: {
                    lt: dayAgo
                }
            }
        }).catch(err => console.error("CLEANUP_RATELIMIT_ERROR", err));

        return true;
    } catch (error) {
        console.error("RATELIMIT_ERROR", error);
        // Fallback to allowing request if DB fails to avoid blocking users
        return true;
    }
}

/**
 * Simple sanitizer for common text inputs to prevent XSS.
 * Removes HTML tags and trims whitespace.
 */
export function sanitizeInput(input: string): string {
    if (!input) return "";
    return input
        .replace(/<[^>]*>?/gm, "") // Remove HTML tags
        .trim();
}

/**
 * Check if a request has a valid client-side Honeypot value (should be empty).
 * @param honeypotValue The value from the hidden 'phone_confirm' field
 */
export function isBot(honeypotValue: string): boolean {
    return !!honeypotValue;
}
