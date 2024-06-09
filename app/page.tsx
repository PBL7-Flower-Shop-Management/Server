"use client";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = () => {
    const { data: session } = useSession();
    const router = useRouter();
    if (session?.user) {
        router.push("account");
    }
    return (
        <>
            <Head>
                <title>Data dashboard</title>
            </Head>
        </>
    );
};

export default Home;
