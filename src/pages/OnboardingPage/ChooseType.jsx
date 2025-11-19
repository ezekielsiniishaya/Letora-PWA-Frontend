import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function ChooseType() {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!selectedRole) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }
    setError(false);
    navigate(`/sign-up?role=${selectedRole}`);
  };

  const handleSelect = (role) => {
    setSelectedRole(role);
    setError(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-6 w-full">
      {/* Greeting */}
      <div className="w-full max-w-md px-4 mt-[30px]">
        <div className="flex flex-col items-center mt-[63px] font-medium text-[#333333] text-center">
          <p className="text-[#333333] text-[16px] font-medium">
            I am registering as
          </p>
          <p className="text-[#666666] text-[13px]">
            Select one that applies to you
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-[29px] mt-[45px] w-full">
          {/* HOST CARD */}
          <button
            onClick={() => handleSelect("host")}
            className="relative flex items-center w-full min-w-full h-[200px] bg-[#21C96B] rounded-[10px] overflow-hidden transition-all duration-200"
          >
            {/* faint logo */}
            <img
              src="/icons/logo-bg.png"
              alt="bg-logo"
              className="absolute right-[-10px] top-[0px] w-[156px]  pointer-events-none"
            />

            {/* host label text */}
            <p className="absolute top-[20px] right-[20px] text-white font-semibold text-[18px] z-20">
              Host
            </p>

            {/* host image */}
            <img
              src="/icons/man.png"
              alt="Host"
              className="h-[190px] translate-x-[-20px] translate-y-[8px] relative z-10"
            />

            {/* HOST CARD selector */}
            <div
              className={`absolute right-4 bottom-4 w-[20px] h-[20px] rounded-full flex items-center justify-center ${
                selectedRole === "host"
                  ? "border-[4px] border-[#A20BA2] bg-[#FBD0FB]"
                  : "border-[4px] border-[#A1A1A1] bg-[#D9D9D9]"
              }`}
            >
              {selectedRole === "host" && (
                <div className="w-[12px] h-[12px] rounded-full bg-[#FBD0FB]" />
              )}
            </div>
          </button>

          {/* GUEST CARD */}
          <button
            onClick={() => handleSelect("guest")}
            className="relative flex items-center w-full min-w-full h-[200px] bg-[#FF703F] rounded-[10px] overflow-hidden transition-all duration-200"
          >
            {/* faint logo */}
            <img
              src="/icons/logo-bg.png"
              alt="bg-logo"
              className="absolute right-[-10px] top-[0px] w-[156px] pointer-events-none"
            />

            {/* guest label text */}
            <p className="absolute top-[20px] right-[20px] text-white font-semibold text-[18px] z-20">
              Guest
            </p>

            {/* guest image */}
            <img
              src="/icons/woman.png"
              alt="Guest"
              className="w-[176px] translate-x-[4px] translate-y-1 relative z-10"
            />

            {/* selector */}
            <div
              className={`absolute right-4 bottom-4 w-[20px] h-[20px] rounded-full flex items-center justify-center border-[4px] ${
                selectedRole === "guest"
                  ? "border-[4px] border-[#A20BA2] bg-[#FBD0FB]"
                  : "border-[4px] border-[#A1A1A1] bg-[#D9D9D9]"
              }`}
            >
              {selectedRole === "guest" && (
                <div className="w-[12px] h-[12px] rounded-full bg-[#FBD0FB]" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Error message */}
      <div className="w-full max-w-md mt-3">
        {error && (
          <p className="text-red-500 text-sm font-medium text-left">
            Please select an option to proceed.
          </p>
        )}
      </div>

      {/* Proceed Button */}
      <div className="w-full max-w-md mt-[88px]">
        <Button
          text="Proceed"
          onClick={handleProceed}
          className="mt-4 w-full"
        />
      </div>

      {/* Footer */}
      <div className="mt-8">
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
