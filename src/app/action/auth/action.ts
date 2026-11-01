"use server";

import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
    error?: string;
    labResult?: string[];
};

export async function login(
    _prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const username = formData.get("username");
    const password = formData.get("password");

    // if (
    //     typeof username !== "string" ||
    //     typeof password !== "string" ||
    //     username.length < 1 ||
    //     username.length > 10 ||
    //     password.length < 1 ||
    //     password.length > 72
    // ) {
    //     return { error: "Username atau password tidak valid." };
    // }

    // Autentikasi normal menggunakan parameterized query.
    const result = await pool.query(
        `SELECT id, username, password, role
         FROM users
         WHERE username = $1
         LIMIT 1`,
        [username]
    );

    const user = result.rows[0];

    // if (!user || !(await bcrypt.compare(password, user.password))) {
    //     return { error: "Username atau password salah." };
    // }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET belum dikonfigurasi.");
    }

    const token = await new SignJWT({
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(secret));

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2,
    });

    redirect("/");
}


export async function logout() {
    "use server";

    const cookieStore = await cookies();

    cookieStore.delete("session");

    redirect("/login");
}