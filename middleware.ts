import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
    const { pathname } = request.nextUrl;
    const protectedPaths = ["/admin", "/employee", "/customer"];
    let matchesProtectedPath = protectedPaths.find((path) =>
        pathname.startsWith(path)
    );
    if (matchesProtectedPath) {
        const token = await getToken({ req: request });
        if (!token) {
            const url = new URL(`/login`, request.url);
            // url.searchParams.set("callbackUrl", encodeURI(request.url));
            return NextResponse.redirect(url);
        }
        matchesProtectedPath = matchesProtectedPath.slice(1);
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
