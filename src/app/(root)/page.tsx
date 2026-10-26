export default function Home() {
  return (
    <div className="flex flex-col w-full p-10">
      <div>
        <p>Selamat datang, User.</p>
      </div>
      <div className="w-full border h-auto mt-4">
        <div className="w-full h-10 bg-linear-to-b from-gray-300 to-gray-200 flex items-center px-3 font-bold border border-gray-400">
          <p>Tugas Terbaru</p>
        </div>
        <div className="w-full h-auto p-3">
          <ul>
            <li className="flex">
              <div className="flex items-center w-[150px]">
                <p className="col-span-1 text-xs">2 November 2026</p>
              </div>
              <div className="col-span-3">
                <a href="/tugas" className="text-blue-500 hover:underline font-bold text-sm">
                  TIG13 - SECURE APPLICATIONS DEVELOPMENT
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
