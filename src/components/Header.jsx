import React from "react";

export default function Header() {
  return (
    <div className="flex flex-col items-center mt-[72px]">
      <div className="flex items-center space-x-2">
        <img
          src="/icons/logo-pink.svg"
          alt="Letora Logo"
          className="w-[42.78px] h-[42.78px]"
        />
        <span className="text-[#A20BA2] font-semibold text-[28.86px]">
          Letora
        </span>
      </div>
    </div>
  );
}
