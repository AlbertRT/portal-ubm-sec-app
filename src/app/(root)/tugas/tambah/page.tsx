import { createAssignment } from "@/lib/assignment";
import { TimeUpload } from "@/components/time-upload";

export default function page() {
    return (
        <div className="w-full p-10">
            <div className="flex h-10 w-full items-center border border-gray-400 bg-linear-to-b from-gray-300 to-gray-200 px-3 font-bold">
                <p>Tambah Tugas - TIG13 - SECURE APPLICATIONS DEVELOPMENT</p>
            </div>

            <form action={createAssignment} className="mt-5 space-y-5">
                <TimeUpload
                    title="waktu-buka"
                    label="Waktu Buka"
                />

                <TimeUpload
                    title="batas-upload"
                    label="Batas Upload"
                />

                <div className="flex items-center">
                    <label
                        htmlFor="soal"
                        className="w-[180px] shrink-0 font-bold"
                    >
                        File Soal
                    </label>

                    <input
                        type="file"
                        id="soal"
                        name="soal"
                        required
                        className="block w-full px-2 text-sm text-gray-500 file:mr-4 file:cursor-pointer file:border file:border-gray-400 file:bg-linear-to-b file:from-gray-300 file:to-gray-200 file:p-1 file:text-sm file:font-semibold"
                    />
                </div>

                <div className="mt-10">
                    <button
                        type="submit"
                        className="h-7 w-[100px] cursor-pointer border border-gray-400 bg-linear-to-b from-gray-300 to-gray-200 text-sm"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}