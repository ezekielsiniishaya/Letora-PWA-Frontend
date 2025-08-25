import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header2({ title }) {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#A20BA2] px-[20px] py-[11px]">
      <div className="flex items-center space-x-5">
        <img
          src="/icons/arrow-left-white.svg"
          alt="Back"
          className="w-5 h-5 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-white font-medium text-[13px]">{title}</span>
      </div>
    </div>
  );
}
