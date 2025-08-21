import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(120);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer === 0) return;
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleKeyPress = (key) => {
    const newCode = [...code];
    const emptyIndex = newCode.findIndex((c) => c === "");
    if (key === "del") {
      const lastIndex = newCode.findIndex((c) => c === "") - 1;
      if (lastIndex >= 0) {
        newCode[lastIndex] = "";
      } else {
        newCode[4] = "";
      }
    } else if (emptyIndex !== -1) {
      newCode[emptyIndex] = key;
    }
    setCode(newCode);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      <Header />

      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Verify Email Address
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          We've sent a code to simplw@email.com, Enter the code below
        </p>

        {/* Enter verification code text */}
        <p className="text-[16px] text-[#666666] mt-[32px] mb-2">
          Enter verification code
        </p>

        {/* Verification Code Boxes */}
        <div className="flex justify-between">
          {code.map((c, i) => (
            <div
              key={i}
              className="w-[48px] h-[48px] bg-white flex items-center justify-center text-lg font-medium rounded-md"
            >
              {c}
            </div>
          ))}
        </div>

        {/* Resend code */}
        <p className="text-[16px] mt-[36px] mb-[24px] text-center">
          {resendTimer > 0 ? (
            <span className="text-[#505050]">
              Resend code in{" "}
              {`${Math.floor(resendTimer / 60)}:${String(
                resendTimer % 60
              ).padStart(2, "0")}`}
            </span>
          ) : (
            <button
              onClick={() => setResendTimer(90)} // reset timer
              className="text-[#A20BA2] underline"
            >
              Resend Code
            </button>
          )}
        </p>
        <Link to="/create-password">
          {/* Verify button */}
          <Button text="Verify" />
        </Link>

        {/* On-screen keyboard */}
        <div className="grid grid-cols-3  gap-4 mt-[48px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "del"].map(
            (key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-full h-[60px] text-[#0D1321] text-[24px] font-semibold flex items-center justify-center"
              >
                {key === "del" ? "⌫" : key}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
