import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { getLatestAssignments } from "@/lib/assignment";

export default async function Home() {
    const user = await getSession();

    if (!user) {
        redirect("/login");
    }

    const assignments = await getLatestAssignments(user, 5);

    return (
        <div className="flex w-full flex-col p-10">
            <div className="flex items-center justify-between">
                <p>
                    Selamat datang, {user.profile.fullName}
                </p>

                <p className="text-xs capitalize">
                    {user.role}
                </p>
            </div>

            <div className="mt-4 h-auto w-full border">
                <div className="flex h-10 w-full items-center border border-gray-400 bg-linear-to-b from-gray-300 to-gray-200 px-3 font-bold">
                    <p>Tugas Terbaru</p>
                </div>

                <div className="w-full p-3">
                    {assignments.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Belum ada tugas terbaru.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {assignments.map((assignment) => (
                                <li
                                    key={assignment.id}
                                    className="flex items-start"
                                >
                                    <div className="w-[150px] shrink-0">
                                        <p className="text-xs">
                                            {new Date(
                                                assignment.deadline_at
                                            ).toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                    timeZone: "Asia/Jakarta",
                                                }
                                            )}
                                        </p>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <a
                                            href="/tugas"
                                            className="text-sm font-bold text-blue-500 hover:underline"
                                        >
                                            {assignment.course_code} -{" "}
                                            {assignment.course_name}
                                        </a>

                                        <p className="text-xs text-gray-500">
                                            {assignment.lecturer_name}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-4 border-t pt-3">
                        <a
                            href="/tugas"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Lihat semua tugas →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}