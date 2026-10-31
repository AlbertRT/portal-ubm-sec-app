"use client";

import { useEffect, useState } from "react";

export function TimeUpload({title, label}: { title: string, label: string }) {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();

            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, "0");
            const dd = String(now.getDate()).padStart(2, "0");

            const hh = String(now.getHours()).padStart(2, "0");
            const min = String(now.getMinutes()).padStart(2, "0");

            setCurrentDate(`${yyyy}-${mm}-${dd}`);
            setCurrentTime(`${hh}:${min}`);
        };

        updateDateTime();

        // Perbarui batas waktu setiap menit
        const interval = setInterval(updateDateTime, 60_000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <label
                htmlFor={`${title}`}
                className="w-[150px] font-bold"
            >
                {label}
            </label>

            <input
                id={`${title}`}
                type="datetime-local"
                name={`${title}`}
                min={currentDate}
                required
            />
        </div>
    );
}