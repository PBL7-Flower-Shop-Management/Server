import Header from "@/components/Header/Header";
import SideMenu from "@/components/SideMenu/SideMenu";
import Login from "./login/Login";
import Dashboard from "./dashboard/Dashboard";
import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                <title>Data dashboard</title>
            </Head>
            <main>
                <Header />
                <SideMenu />
                <Login />
                <Dashboard />
            </main>
        </>
    );
}
