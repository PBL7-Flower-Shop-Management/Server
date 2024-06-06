"use client";
import Dashboard from "./dashboard/Dashboard";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { removeItems } from "@/utils/auth";

const Home = () => {
    const { data: session } = useSession();
    useEffect(() => console.log("session", session), [session]);
    async function logout() {
        // await router.push("/");
        await signOut();
        await removeItems();
    }
    return (
        <>
            <Head>
                <title>Data dashboard</title>
            </Head>
            <main>
                {session?.user?.name}
                <button onClick={() => logout()}>Log out</button>
                <Dashboard />
            </main>
        </>
    );
};

export default Home;
