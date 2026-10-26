import TimeUpload from "@/components/time-upload";

export default function page() {
    return (
        <div className={'w-full p-10'}>
            <div className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center px-3 font-bold border border-gray-400">
                <p>Tambah Tugas - TIG13 - SECURE APPLICATIONS DEVELOPMENT </p>
            </div>
            <div className="mt-5">
                <form action="" className={''}>
                    <TimeUpload title={"waktu-buka"} label={"Waktu Buka"} />
                    <TimeUpload title={"batas-upload"} label={"Batas Upload"} />
                    <div className={'flex items-center'}>
                        <label htmlFor="soal" className={'w-[180px] font-bold'}>Soal</label>
                        <input
                            type="file"
                            id="soal"
                            name="soal"
                            className="block w-full text-sm text-gray-500
                            file:mr-4 file:border-1
                            file:bg-linear-to-b file:from-gray-300 file:to-gray-200 file:p-1 px-2 file:border
                            file:text-sm file:font-semibold file:cursor-pointer"
                        />
                    </div>
                    <div className={'mt-10'}>
                        <button className={'bg-linear-to-b from-gray-300 to-gray-200 w-[100px] text-sm h-7 border-1 cursor-pointer'}>Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    )
}