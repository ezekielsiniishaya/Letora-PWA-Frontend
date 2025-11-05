import { useState } from "react";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

export default function ChooseType() {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-6">
      <Header />

      {/* Greeting */}
      <div className="flex flex-col items-center mt-[79.42px] text-center">
        <img
          src="/icons/greeting.png"
          alt="Letora Logo"
          className="w-[95px] h-[95px] mb-[14px]"
        />
        <p className="text-[#333333] text-[16px] font-medium">
          Hello there, What action do
          <br />
          you wanna carry out?
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-[43px] mt-[53px] w-full">
        {/* Host button */}
        <Link to="/sign-up?role=host">
          <button
            onClick={() => setSelectedRole("host")}
            className={`flex items-center w-full h-[100px] rounded-[5px] overflow-hidden relative transition-all duration-200 ${
              selectedRole === "host" ? "ring-2 ring-[#A20BA2]" : ""
            }`}
            style={{ backgroundColor: "#DDE9FC" }}
          >
            <img
              src="/icons/host-select.png"
              alt="Host"
              className="w-[108px] h-[91px] translate-y-1"
            />
            <span className="text-left max-w-[190px] font-medium text-[14px]">
              I Want to List My Apartment as Shortlet
            </span>

            {/* ✅ Always visible circle, filled if selected */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-[3px] border-[#A1A1A1] bg-[#D9D9D9] flex items-center justify-center">
              {selectedRole === "host" && (
                <div className="w-[10px] h-[10px] rounded-full border-[#A20BA2] bg-[#FBD0FB]" />
              )}
            </div>
          </button>
        </Link>

        {/* Guest button */}
        <Link to="/sign-up?role=guest">
          <button
            onClick={() => setSelectedRole("guest")}
            className={`flex items-center w-full h-[100px] rounded-[5px] overflow-hidden relative transition-all duration-200 ${
              selectedRole === "guest" ? "ring-2 ring-[#A20BA2]" : ""
            }`}
            style={{ backgroundColor: "#FAB52142" }}
          >
            <img
              src="/icons/guest-select.png"
              alt="Guest"
              className="w-[133px] h-full"
            />
            <span className="text-left ml-[-25px] w-[181px] font-medium text-[14px]">
              I Want to Book a Shortlet Apartment
            </span>

            {/* ✅ Always visible circle, filled if selected */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-[3px] border-[#A1A1A1] bg-[#D9D9D9] flex items-center justify-center">
              {selectedRole === "guest" && (
                <div className="w-[10px] h-[10px] rounded-full border-[#A20BA2] bg-[#FBD0FB]" />
              )}
            </div>
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-[172px]">
        <p className="text-sm text-[#000000] text-[14px] font-medium">
          Have an account?{" "}
          <Link to="/sign-in" className="text-[#8C068C]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
