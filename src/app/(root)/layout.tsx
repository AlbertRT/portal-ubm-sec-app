import type {ReactNode} from "react";
import type {Metadata} from "next";
import "@/styles/globals.css";
import SideBar from "@/components/sidebar";
import {getSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {SessionProvider} from "@/app/providers";

export const metadata: Metadata = {
    title: "Portal UBM",
    description: "Aplikasi portal UBM buat testing SQL Injection & Command Injection",
};

export default async function RootLayout({children}: Readonly<{
    children: ReactNode;
}>) {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    return (
        <html lang="en" className="antialiased">
        <body>
        <div className="flex h-screen w-full flex-col">
            <div className="flex h-full w-full flex-row">
                <div className="h-full w-[250px]">
                    <SideBar username={session.username}/>
                </div>

                <main className="h-full flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
        </body>
        </html>
    );
}
