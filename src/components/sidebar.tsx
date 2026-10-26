import Link from "next/link";

export default function SideBar() {
    return (
        <div className="w-full h-full py-10 px-3 bg-gradient-to-b from-gray-100 to-gray-200">
            <div>
                <ul className="space-y-1">
                    <li className="bg-gradient-to-b from-blue-700 to-blue-500 w-full h-7 flex items-center hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-400">
                        <Link href="/" className="w-full font-bold h-full px-2 text-white">Home</Link>
                    </li>
                    <li className="bg-gradient-to-b from-blue-700 to-blue-500 w-full h-7 flex items-center hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-400">
                        <Link href="/src/app/(root)/profile/32240006" className="w-full font-bold h-full px-2 text-white">Profile</Link>
                    </li>
                </ul>
            </div>
            <div className="mt-10">
                <ul className="space-y-1">
                    <li className="bg-gradient-to-b from-blue-700 to-blue-500 w-full h-7 flex items-center hover:bg-gradient-to-b hover:from-blue-500 hover:to-blue-400">
                        <Link href="/tugas" className="w-full font-bold h-full px-2 text-white">Tugas</Link>
                    </li>
                </ul>
            </div>
            <div className="mt-10">
                <ul className="space-y-1">
                    <li className="bg-gradient-to-b from-red-700 to-red-600 w-full h-7 flex items-center hover:bg-gradient-to-b hover:from-red-500 hover:to-red-400">
                        <Link href="/tugas" className="w-full font-bold h-full px-2 text-white">Logout</Link>
                    </li>
                </ul>
            </div>      
        </div>
    )
}