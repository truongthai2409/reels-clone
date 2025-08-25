import { useState } from 'react'

interface BannerErrorProps {
    type: "success" | "error";
    msg: string | React.ReactNode;
}

export const useBanner = () => {
    const [banner, setBanner] = useState<BannerErrorProps | null>(null);
    const Banner = () => banner ? (
        <div
            role="status"
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${banner.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100"
                : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
        >
            {banner.msg}
        </div>
    ) : null
    return { banner, setBanner, Banner };

}
