import "server-only";

import {cookies} from "next/headers";
import {jwtVerify} from "jose";
import {pool} from "@/lib/db";
import {Session} from "@/lib/types";

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET belum dikonfigurasi.");
    }

    let payload;

    try {
        const result = await jwtVerify(
            token,
            new TextEncoder().encode(secret)
        );

        payload = result.payload;
    } catch {
        return null;
    }

    if (!payload.sub) {
        return null;
    }

    const result = await pool.query(
        `SELECT u.id,
                u.username,
                u.role,
                s.nim,
                s.full_name AS student_name,
                l.lecturer_number,
                l.full_name AS lecturer_name
         FROM users u
                  LEFT JOIN students s
                            ON s.user_id = u.id
                  LEFT JOIN majors m
                            ON m.id = s.major_id
                  LEFT JOIN lecturers l
                            ON l.user_id = u.id
         WHERE u.id = $1
         LIMIT 1`,
        [payload.sub]
    );

    const user = result.rows[0];

    if (!user) {
        return null;
    }

    if (user.role === "student") {
        if (!user.nim) {
            return null;
        }

        const session: Session = {
            id: user.id,
            username: user.username,
            role: "student",
            profile: {
                nim: user.nim,
                fullName: user.student_name,
            },
        };

        return session;
    }

    if (user.role === "lecturer") {
        if (!user.lecturer_number) {
            return null;
        }

        const session: Session = {
            id: user.id,
            username: user.username,
            role: "lecturer",
            profile: {
                lecturerNumber: user.lecturer_number,
                fullName: user.lecturer_name,
            },
        };

        return session;
    }

    return null;
}