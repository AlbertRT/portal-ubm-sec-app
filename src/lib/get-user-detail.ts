import "server-only";

import {pool} from "@/lib/db";
import {getSession} from "@/lib/auth";
import type {
    StudentDetail,
    LecturerDetail,
    UserDetail,
} from "@/lib/types";

export async function getUserDetail(
    identifier: string
): Promise<UserDetail | null> {
    const session = await getSession();

    if (!session) {
        return null;
    }

    if (session.role === "student") {
        const result = await pool.query(
            `SELECT s.id,
                    s.nim,
                    s.full_name,
                    s.enrollment_year,
                    s.phone,
                    s.email,
                    m.id   AS major_id,
                    m.code AS major_code,
                    m.name AS major_name
             FROM students s
                      LEFT JOIN majors m
                                ON m.id = s.major_id
             WHERE s.nim = $1
             LIMIT 1`,
            [identifier]
        );

        const row = result.rows[0];

        if (!row) {
            return null;
        }

        const detail: StudentDetail = {
            id: row.id,
            nim: row.nim,
            fullName: row.full_name,
            enrollmentYear: row.enrollment_year,
            phone: row.phone,
            email: row.email,
            major: row.major_id
                ? {
                    id: row.major_id,
                    code: row.major_code,
                    name: row.major_name,
                }
                : null,
        };

        return {
            role: "student",
            detail,
        };
    }

    if (session.role === "lecturer") {
        const result = await pool.query(
            `SELECT id,
                    lecturer_number,
                    full_name
             FROM lecturers
             WHERE lecturer_number = $1
             LIMIT 1`,
            [identifier]
        );

        const row = result.rows[0];

        if (!row) {
            return null;
        }

        const detail: LecturerDetail = {
            id: row.id,
            lecturerNumber: row.lecturer_number,
            fullName: row.full_name,
        };

        return {
            role: "lecturer",
            detail,
        };
    }

    return null;
}