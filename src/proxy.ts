import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function proxy(req) {
        const token = req.nextauth.token
        const isAdminPath = req.nextUrl.pathname.startsWith("/admin")

        // Diagnostic log for production sessions
        if (process.env.NODE_ENV === "production" && req.nextUrl.pathname !== "/_next/data") {
            console.log(`PROXY_DEBUG: [${req.nextUrl.pathname}] Token present: ${!!token}, Role: ${token?.role || 'N/A'}`);
        }

        if (isAdminPath && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
)

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/team",
        "/team/:path*",
        "/account",
        "/account/:path*",
        "/api/admin/:path*",
    ],
}
