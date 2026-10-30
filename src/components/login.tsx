"use client"
import {useActionState} from "react";
import {login} from "@/app/action/auth/action";

const initialState = {
    error: "",
};

export default function Login() {
    const [state, formAction, pending] = useActionState(
        login,
        initialState
    );

    return (
        <form action={formAction} className={"w-[25%]"}>
            <div
                className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center justify-center border border-gray-400">
                <h2 className="font-bold">Login Portal Mahasiswa</h2>
            </div>
            <div className="mt-4 space-y-2 flex flex-col items-center">
                <input type="text" name="username" placeholder="Username"
                       className="w-full px-2 border border-gray-300"/>
                <input type="password" name="password" placeholder="Password"
                       className="w-full px-2 border border-gray-300"/>
                <button
                    className="bg-linear-to-t from-gray-300 to-gray-200 p-1 w-[100px] border cursor-pointer border-gray-300">Login
                </button>
            </div>
        </form>
    )
}