import React, { useEffect } from "react";

const alertStyles = {
  error: {
    bg: "bg-[#C5190E]",
    icon: "/icons/failed-error.svg",
  },
  success: {
    bg: "bg-[#11A932]",
    icon: "/icons/otp.svg",
  },
  network: {
    bg: "bg-[#9C9998]",
    icon: "/icons/network-error.svg",
  },
};

export default function Alert({
  type = "error",
  message,
  onDismiss,
  timeout = 5000,
}) {
  const style = alertStyles[type] || alertStyles.error;

  useEffect(() => {
    if (onDismiss && timeout > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [onDismiss, timeout]);

  return (
    <div
      className={`flex items-center gap-2 ${style.bg} h-[40px] text-white font-medium text-[12px] px-4 py-2 rounded-md w-full`}
    >
      <img src={style.icon} alt={`${type} icon`} className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}
