import { useState } from "react";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function ChooseType() {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!selectedRole) {
      setError(true);
      setTimeout(() => setError(false), 3000); // ⏱ clear error after 5 seconds
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
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-6">
      <Header />

      {/* Greeting */}
      <div className="flex flex-col items-center mt-[41px] text-center">
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
      <div className="flex flex-col space-y-[29px] mt-[53px] w-full">
        {/* Host button */}
        <button
          onClick={() => handleSelect("host")}
          className="flex items-center w-full h-[100px] bg-[#DDE9FC] rounded-[5px] overflow-hidden relative transition-all duration-200"
        >
          <img
            src="/icons/host-select.png"
            alt="Host"
            className="w-[108px] h-[91px] translate-y-1"
          />
          <span className="text-left max-w-[190px] font-medium text-[14px]">
            I Want to List My Apartment as Shortlet
          </span>

          <div
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full flex items-center justify-center border-[4px] ${
              selectedRole === "host"
                ? "border-[#A20BA2]"
                : "border-[#A1A1A1] bg-[#D9D9D9]"
            }`}
          >
            {selectedRole === "host" && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#FBD0FB]" />
            )}
          </div>
        </button>

        {/* Guest button */}
        <button
          onClick={() => handleSelect("guest")}
          className="flex items-center w-full h-[100px] bg-[#FAB52142] rounded-[5px] overflow-hidden relative transition-all duration-200"
        >
          <img
            src="/icons/guest-select.png"
            alt="Guest"
            className="w-[133px] h-full"
          />
          <span className="text-left ml-[-25px] w-[181px] font-medium text-[14px]">
            I Want to Book a Shortlet Apartment
          </span>

          <div
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full flex items-center justify-center border-[4px] ${
              selectedRole === "guest"
                ? "border-[#A20BA2]"
                : "border-[#A1A1A1] bg-[#D9D9D9]"
            }`}
          >
            {selectedRole === "guest" && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#FBD0FB]" />
            )}
          </div>
        </button>
      </div>
      {/* Error message */}
      <span className="flex items-left w-full mt-3">
        {error && (
          <p className="text-red-500 text-sm font-medium text-left">
            Please select an option to proceed.
          </p>
        )}
      </span>
      {/* Proceed Button */}
      <div className="mt-[88px] w-full">
        <Button text="Proceed" onClick={handleProceed} className="mt-4" />
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
