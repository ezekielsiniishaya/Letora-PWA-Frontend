import { useState } from "react";
import Button from "../Button";
import PasswordInput from "./PasswordInput";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSignIn = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      <div className="w-full flex justify-start">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-[16.67px] mt-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="w-full max-w-sm mt-[26.42px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Forget Password
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Enter your email and we'll send a code to your inbox to reset your
          password.
        </p>

        <form className="space-y-[175px]" onSubmit={handleSignIn}>
          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mt-[40px]">
              Email Address <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border mt-[8px] w-full h-[48px] rounded-md mb-[175px] px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none"
            />
          </div>

          {/* Sign in button */}
          <Link to="/reset-password ">
            <Button text="Proceed" type="submit" />
          </Link>
        </form>
      </div>
    </div>
  );
}
