"use client";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
    session,
}: Readonly<{
    children: React.ReactNode;
    session: any;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/assets/images/logo.svg" />
            </head>
            <body className={inter.className}>
                <SessionProvider session={session}>
                    <Layout>
                        <main className="app">{children}</main>
                    </Layout>
                </SessionProvider>
            </body>
        </html>
    );
}
