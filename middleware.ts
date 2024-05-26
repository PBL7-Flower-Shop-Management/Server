import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
    const { pathname } = request.nextUrl;

    const commonPaths = [
        "/login",
        "/forgot-password",
        "/reset-password",
        "/_next",
        "/api-doc",
        "/api",
    ];
    const protectedPaths = ["/admin", "/employee", "/customer"];
    let matchesCommonsPath = commonPaths.find((path) =>
        pathname.startsWith(path)
    );
    let matchesProtectedPath = protectedPaths.find((path) =>
        pathname.startsWith(path)
    );
    const token = await getToken({ req: request });
    if (!token || token.error) {
        if (!matchesCommonsPath) {
            const url = new URL(`/login`, request.url);
            // url.searchParams.set("callbackUrl", encodeURI(request.url));
            return NextResponse.redirect(url);
        }
    } else if (matchesProtectedPath) {
        matchesProtectedPath = matchesProtectedPath.slice(1);
        // console.log("token", token);
        if (
            token.role !==
            matchesProtectedPath.charAt(0).toUpperCase() +
                matchesProtectedPath.slice(1)
        ) {
            const url = new URL(`/`, request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}
