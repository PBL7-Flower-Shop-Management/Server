import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name: string;
            email: string;
            _id: string;
            citizenId: string;
            phoneNumber: string;
            role: string;
            avatar: string;
            createdAt: date;
            createdBy: string;
            isDeleted: boolean;
            // __v: string;
            accessToken: string;
            accessTokenExpiresAt: date;
            refreshToken: string;
            refreshTokenExpireAt: date;
            // iat: string;
            // exp: date;
            // jti: string;
        };
    }
}
