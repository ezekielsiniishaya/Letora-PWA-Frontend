import React from "react";

const alertStyles = {
  error: {
    bg: "bg-red-600",
    icon: "/icons/failed-error.svg",
  },
  success: {
    bg: "bg-green-600",
    icon: "/icons/otp.svg",
  },
  network: {
    bg: "bg-gray-500",
    icon: "/icons/network-error.svg",
  },
};

export default function Alert({ type = "error", message }) {
  const style = alertStyles[type] || alertStyles.error;

  return (
    <div
      className={`flex items-center gap-2 ${style.bg} h-[40px] text-white font-medium text-[12px] px-4 py-2 rounded-md w-fit`}
    >
      <img src={style.icon} alt={`${type} icon`} className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}
