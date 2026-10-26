export default function page() {
    return (
        <div className={'w-full p-10'}>
            <div className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center px-3 font-bold border border-gray-400">
                <p>Profil</p>
            </div>
            <div className="mt-4">
                <ul>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">NIM</p>
                        </div>
                        <div className="text-xs">
                            <span>1234567890</span>
                        </div>
                    </li>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">Nama</p>
                        </div>
                        <div className="text-xs">
                            <span>User</span>
                        </div>
                    </li>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">Jurusan</p>
                        </div>
                        <div className="text-xs">
                            <span>Informatika</span>
                        </div>
                    </li>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">Angkatan</p>
                        </div>
                        <div className="text-xs">
                            <span>2021</span>
                        </div>
                    </li>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">Nomor HP</p>
                        </div>
                        <div className="text-xs">
                            <span>081234567890</span>
                        </div>
                    </li>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">Email</p>
                        </div>
                        <div className="text-xs">
                            <span>user@domain.com</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}