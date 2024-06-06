import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import UrlConfig from "@/config/UrlConfig";
import { FetchApi } from "@/utils/FetchApi";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            authorize: async (credentials) => {
                const { username, password } = credentials as any;
                const response = await FetchApi(
                    UrlConfig.authentication.login,
                    "POST",
                    false,
                    {
                        username: username,
                        password: password,
                    }
                );

                if (response.succeeded) {
                    // saveToken(response);
                    return {
                        ...response.data.user,
                        ...response.data.token,
                    };
                } else {
                    throw new Error(response.message || "Invalid credentials");
                }
            },
        }),
        // // OAuth authentication providers...
        // AppleProvider({
        //     clientId: process.env.APPLE_ID,
        //     clientSecret: process.env.APPLE_SECRET,
        // }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_ID,
        //     clientSecret: process.env.FACEBOOK_SECRET,
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        // Passwordless / email sign in
        // EmailProvider({
        //     server: process.env.MAIL_SERVER,
        //     from: "NextAuth.js <no-reply@example.com>",
        // }),
    ],
    callbacks: {
        // This callback is called whenever a JWT is created. `user` will only be defined during sign in.
        async jwt({ token, user, account }) {
            // console.log("user", user);
            // console.log("token", token);
            if (account?.id_token) {
                const response = await FetchApi(
                    UrlConfig.authentication.google,
                    "POST",
                    false,
                    {
                        accessToken: account?.id_token,
                    }
                );
                console.log(response);
                if (response.succeeded) {
                    return {
                        ...token,
                        ...user,
                        ...response.data.user,
                        ...response.data.token,
                    };
                } else {
                    token.error = response.message || "Invalid credentials";
                }
            }
            return { ...token, ...user };
        },
        async session({ session, token }) {
            (session as any).user = token; //token = returned value of jwt()
            // console.log("session", session);
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        error: "/login", // Custom error page to handle errors
    },
    adapter: MongoDBAdapter(clientPromise) as Adapter,
});

export { handler as GET, handler as POST };
