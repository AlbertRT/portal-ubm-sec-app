import Link from 'next/link'
import "@/styles/globals.css"

export default function NotFound() {
    return (
        <div className={"w-full h-screen overflow-hidden flex flex-col items-center justify-center"}>
            <div>
                <h2 className={"font-bold text-2xl"}>Halaman Tidak Di Temukan.</h2>
                <Link href="/" className={"text-blue-800 hover:underline mt-4"}>Kembali</Link>
            </div>
        </div>
    )
}