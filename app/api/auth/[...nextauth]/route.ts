import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import UrlConfig from "@/config/UrlConfig";
import ApiResponse from "@/utils/ApiResponse";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            authorize: async (credentials) => {
                const { username, password } = credentials as any;
                return await axios
                    .post(UrlConfig.authentication.login, {
                        username: username,
                        password: password,
                    })
                    .then((res) => {
                        if (res.status === 200)
                            return {
                                ...res.data.data.user,
                                ...res.data.data.token,
                            };
                        // This is the object that will be encoded in JWT
                        //  wrong credentials
                        else {
                            throw res.data;
                        }
                    })
                    .catch((err: any) => {
                        throw err.response.data;
                    });
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
        async jwt({ token, user }) {
            // console.log("user", user);
            // console.log("token", token);
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
    // pages: {
    //     signIn: "/",
    // },
    adapter: MongoDBAdapter(clientPromise) as Adapter,
});

export { handler as GET, handler as POST };
