"use client";
import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();
    return <div>Home</div>;
}
