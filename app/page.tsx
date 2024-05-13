"use client";
import Dashboard from "./dashboard/Dashboard";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const Home = () => {
    const { data: session } = useSession();
    useEffect(() => console.log("session", session), [session]);
    return (
        <>
            <Head>
                <title>Data dashboard</title>
            </Head>
            <main>
                {session?.user?.name}
                <button onClick={() => signOut()}>Log out</button>
                <Dashboard />
            </main>
        </>
    );
};

export default Home;
