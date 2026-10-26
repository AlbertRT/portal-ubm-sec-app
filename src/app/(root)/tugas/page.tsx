import Link from "next/link";

export default function page() {
    return (
        <div className={'w-full p-10 flex flex-col items-center'}>
            <div className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center px-3 font-bold border border-gray-400">
                <p>Tugas Terbaru</p>
            </div>
            <div className={'mt-10'}>
                <table>
                    <thead className={'bg-linear-to-b from-gray-300 to-gray-200 border border-gray-400 font-bold h-8'}>
                        <tr>
                            <th className={'w-[250px] border'}>
                                Mata Kuliah
                            </th>
                            <th className={'w-[160px] border'}>
                                Dosaen
                            </th>
                            <th className={'w-[160px] border'}>
                                Batas Upload
                            </th>
                            <th className={'w-[100px] border'}>
                                Soal
                            </th>
                            <th className={'w-[100px] border'}>
                                Upload
                            </th>
                        </tr>
                    </thead>
                    <tbody className={'text-sm'}>
                        <tr>
                            <td className={'border p-1'}>
                                <span className="text-blue-500 font-bold text-sm">
                                    TIG13 - SECURE APPLICATIONS DEVELOPMENT
                                </span>
                            </td>
                            <td className={'border p-1'}>
                                Hizrawan Dwi Oka, S.Kom., M.Sc
                            </td>
                            <td className={'border p-1'}>
                                2 November 2026
                            </td>
                            <td className={'border p-1 text-center'}>
                                <Link href={''} className={'font-bold text-blue-500 hover:underline'}>Soal</Link>
                            </td>
                            <td className={'border p-1 text-center'}>
                                <button className={'font-bold text-blue-500 hover:underline cursor-pointer'}>Upload</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}