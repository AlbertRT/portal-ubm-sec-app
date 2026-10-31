import Link from "next/link";
import {getAssignments} from "@/lib/assignment";
import {getSession} from "@/lib/auth";
import {redirect} from "next/navigation";
import {format} from "date-fns";

export default async function page() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const assignments = await getAssignments();

    console.log(assignments)

    return (
        <div className={'w-full p-10 flex flex-col items-center'}>
            <div
                className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center px-3 font-bold border border-gray-400">
                <p>Tugas Terbaru</p>
            </div>

            <div className={'mt-10 flex flex-col items-end'}>
                {session.role === "lecturer" && (
                    <div className={"mb-3"}>
                        <Link href={"/tugas/tambah"} className={"text-blue-800 text-sm hover:underline"}>Tambah Tugas</Link>
                    </div>
                )}

                <table>
                    <thead className={'bg-linear-to-b from-gray-300 to-gray-200 border border-gray-400 font-bold h-8'}>
                    <tr>
                        <th className={'w-[250px] border'}>
                            Mata Kuliah
                        </th>
                        <th className={'w-[160px] border'}>
                            Dosaen
                        </th>
                        <th className={'w-[25   0px] border'}>
                            Batas Upload
                        </th>
                        {session.role === "student" ? (
                            <>
                                <th className={'w-[100px] border'}>
                                    Soal
                                </th>
                                <th className={'w-[100px] border'}>
                                    Upload
                                </th>
                            </>
                        ) : (
                            <th className={'w-[100px] border'}></th>
                        )}
                    </tr>
                    </thead>
                    <tbody className={'text-sm'}>
                    {assignments.length !== 0 ? assignments.map(assignment => (
                        <tr key={assignment.id}>
                            <td className={'border p-1'}>
                                <span className="text-blue-500 font-bold text-sm">
                                    {assignment.course_code} - {assignment.course_name}
                                </span>
                            </td>
                            <td className={'border p-1'}>
                                {assignment.lecturer_name}
                            </td>
                            <td className={'border p-1'}>
                                {format(assignment.deadline_at, "dd MMMM yyyy hh:mm:ss")}
                            </td>
                            {session.role === "student" ? (
                                    <>
                                        <td className={'border p-1 text-center'}>
                                            <Link href={''} className={'font-bold text-blue-500 hover:underline'}>Soal</Link>
                                        </td>
                                        <td className={'border p-1 text-center'}>
                                            <button className={'font-bold text-blue-500 hover:underline cursor-pointer'}>Upload</button>
                                        </td>
                                    </>
                            ) : (
                                <td className={'border p-1 text-center'}>
                                    <button className={'font-bold text-blue-500 hover:underline cursor-pointer'}>Jawaban</button>
                                </td>
                            )}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className={'border p-1 text-center'}>
                                Tidak ada tugas saat ini.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}