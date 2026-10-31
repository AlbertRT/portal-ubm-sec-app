import "server-only";

import {randomUUID} from "node:crypto";
import {mkdir, writeFile, unlink} from "node:fs/promises";
import path from "node:path";

import {pool} from "@/lib/db";
import {getSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {Session} from "@/lib/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const STORAGE_DIR = path.join(
    process.cwd(),
    "storage",
    "assignments"
);


export async function getAssignments() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    if (session.role === "student") {
        const result = await pool.query(
            `SELECT a.id,
                    a.opens_at,
                    a.deadline_at,
                    a.created_at,

                    c.course_code,
                    c.name      AS course_name,

                    m.code      AS major_code,
                    m.name      AS major_name,

                    l.full_name AS lecturer_name

             FROM students s

                      JOIN courses c
                           ON c.major_id = s.major_id

                      JOIN assignments a
                           ON a.course_id = c.id

                      JOIN lecturers l
                           ON l.id = a.lecturer_id

                      JOIN majors m
                           ON m.id = s.major_id

             WHERE s.user_id = $1

             ORDER BY a.deadline_at ASC`,
            [session.id]
        );

        return result.rows;
    }

    if (session.role === "lecturer") {
        const result = await pool.query(
            `SELECT a.id,
                    a.opens_at,
                    a.deadline_at,
                    a.created_at,

                    c.course_code,
                    c.name      AS course_name,

                    m.code      AS major_code,
                    m.name      AS major_name,

                    l.full_name AS lecturer_name

             FROM lecturers l

                      JOIN assignments a
                           ON a.lecturer_id = l.id

                      JOIN courses c
                           ON c.id = a.course_id

                      LEFT JOIN majors m
                                ON m.id = c.major_id

             WHERE l.user_id = $1

             ORDER BY a.deadline_at ASC`,
            [session.id]
        );

        return result.rows;
    }

    return [];
}

export async function createAssignment(formData: FormData) {
    "use server"
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "lecturer") {
        redirect("/");
    }

    const opensAt = formData.get("waktu-buka");
    const deadlineAt = formData.get("batas-upload");
    const file = formData.get("soal");

    if (!opensAt || !deadlineAt) {
        throw new Error("Waktu buka dan batas upload wajib diisi.");
    }

    if (deadlineAt < opensAt) {
        throw new Error("Batas upload tidak boleh sebelum waktu buka.");
    }

    if (!(file instanceof File) || file.size === 0) {
        throw new Error("File soal wajib diunggah.");
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error("Ukuran file maksimal 10 MB.");
    }

    /*
     * Jangan menerima lecturer_id atau course_id dari form.
     * Ambil keduanya berdasarkan akun dosen yang terautentikasi.
     */
    const lecturerResult = await pool.query(
        `SELECT id, course_id
         FROM lecturers
         WHERE user_id = $1
         LIMIT 1`,
        [session.id]
    );

    const lecturer = lecturerResult.rows[0];

    if (!lecturer || lecturer.course_id == null) {
        throw new Error("Akun dosen belum terhubung ke mata kuliah.");
    }

    const assignmentId = randomUUID();
    const storageKey = `${randomUUID()}.${file.type.split("/")[1]}`;
    const filePath = path.join(STORAGE_DIR, storageKey);

    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(STORAGE_DIR, {recursive: true});

    // Tulis ke lokasi yang ditentukan server, bukan nama/path dari user.
    await writeFile(filePath, buffer, {flag: "wx"});

    const client = await pool.connect();
    let transactionStarted = false;

    try {
        await client.query("BEGIN");
        transactionStarted = true;

        const assignmentResult = await client.query(
            `INSERT INTO assignments (course_id,
                                      lecturer_id,
                                      opens_at,
                                      deadline_at)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [
                lecturer.course_id,
                lecturer.id,
                opensAt,
                deadlineAt,
            ]
        );

        const assignment = assignmentResult.rows[0];

        await client.query(
            `INSERT INTO uploaded_files (assignment_id,
                                         uploaded_by,
                                         file_type,
                                         original_filename,
                                         storage_key,
                                         mime_type,
                                         size_bytes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                assignment.id,
                session.id,
                "question",
                path.basename(file.name),
                storageKey,
                file.type,
                file.size,
            ]
        );

        await client.query("COMMIT");
        transactionStarted = false;
    } catch (error) {
        if (transactionStarted) {
            await client.query("ROLLBACK");
        }

        await unlink(filePath).catch(() => undefined);

        console.error("Gagal membuat tugas:", error);

        throw new Error("Tugas gagal disimpan. Silakan coba lagi.");
    } finally {
        client.release();
    }

    redirect("/tugas");
}

export async function getLatestAssignments(
    session: Session,
    limit = 5
) {
    if (session.role === "student") {
        const result = await pool.query(
            `SELECT a.id,
                    a.deadline_at,
                    c.course_code,
                    c.name      AS course_name,
                    l.full_name AS lecturer_name

             FROM students s

                      JOIN courses c
                           ON c.major_id = s.major_id

                      JOIN assignments a
                           ON a.course_id = c.id

                      JOIN lecturers l
                           ON l.id = a.lecturer_id

             WHERE s.user_id = $1

             ORDER BY a.created_at DESC, a.id DESC
             LIMIT $2`,
            [session.id, limit]
        );

        return result.rows;
    }

    const result = await pool.query(
        `SELECT a.id,
                a.deadline_at,
                a.created_at,
                c.course_code,
                c.name      AS course_name,
                l.full_name AS lecturer_name

         FROM lecturers l

                  JOIN assignments a
                       ON a.lecturer_id = l.id

                  JOIN courses c
                       ON c.id = a.course_id

         WHERE l.user_id = $1

         ORDER BY a.created_at DESC, a.id DESC
         LIMIT $2`,
        [session.id, limit]
    );

    return result.rows;
}