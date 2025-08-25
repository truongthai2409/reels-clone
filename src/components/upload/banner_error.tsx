import React from 'react'

interface BannerErrorProps {
    type: "success" | "error";
    msg: string | React.ReactNode;
}

const BannerError: React.FC<BannerErrorProps> = ({ type, msg }) => {
    return (
        <div
            role="status"
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100"
                : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
        >
            {msg}
        </div>
    )
}
export default BannerError