import { NextApiRequest } from "next";

export default function middleware() {}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/api/:path*",
};
