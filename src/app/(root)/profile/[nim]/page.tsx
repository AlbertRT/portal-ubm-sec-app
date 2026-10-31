import {getUserDetail} from "@/lib/get-user-detail";
import { notFound } from "next/navigation";

type PageProps = {
    params: Promise<{
        nim: string;
    }>;
};

export default async function page({ params }: PageProps) {
    const { nim } = await params;

    const user = await getUserDetail(nim);
    console.log(user)

    if (!user) {
        notFound();
    }

    if (user.role === "student") {
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
                                <span>{user.detail.nim}</span>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="flex items-center w-[150px]">
                                <p className="text-xs font-bold">Nama</p>
                            </div>
                            <div className="text-xs">
                                <span>{user.detail.fullName}</span>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="flex items-center w-[150px]">
                                <p className="text-xs font-bold">Jurusan</p>
                            </div>
                            <div className="text-xs">
                                <span>{user.detail.major?.name}</span>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="flex items-center w-[150px]">
                                <p className="text-xs font-bold">Angkatan</p>
                            </div>
                            <div className="text-xs">
                                <span>{user.detail.enrollmentYear}</span>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="flex items-center w-[150px]">
                                <p className="text-xs font-bold">Nomor HP</p>
                            </div>
                            <div className="text-xs">
                                <span>{user.detail.phone}</span>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="flex items-center w-[150px]">
                                <p className="text-xs font-bold">Email</p>
                            </div>
                            <div className="text-xs">
                                <span>{user.detail.email}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className={'w-full p-10'}>
            <div className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center px-3 font-bold border border-gray-400">
                <p>Profil</p>
            </div>
            <div className="mt-4">
                <ul>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">Lecturer Number</p>
                        </div>
                        <div className="text-xs">
                            <span>{user.detail.lecturerNumber}</span>
                        </div>
                    </li>
                    <li className="flex">
                        <div className="flex items-center w-[150px]">
                            <p className="text-xs font-bold">Nama</p>
                        </div>
                        <div className="text-xs">
                            <span>{user.detail.fullName}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}