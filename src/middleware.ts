import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAdminPath = req.nextUrl.pathname.startsWith("/admin")

        if (isAdminPath && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: [
        "/admin/:path*",
        "/team/create",
        "/team/edit/:path*",
        "/api/admin/:path*",
    ],
}
