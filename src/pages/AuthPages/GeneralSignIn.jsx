import { useState } from "react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import PasswordInput from "../../components/auth/PasswordInput";
import { Link, useNavigate, } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, just check rememberMe and navigate
    if (rememberMe) {
      navigate("/host-home");
    } else {
      navigate("/guest-dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      <Header />

      <div className="w-full max-w-sm mt-[26.42px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">Sign in</h2>
        <p className="text-[16px] text-[#666666] mt-[4px]">
          Sign in if you already have an account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none"
            />
          </div>

          {/* Password */}
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-[14px] pb-[32px] font-medium">
            <label className="flex items-center space-x-[8px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="appearance-none border border-[#CCCCCC] w-[18px] h-[18px] rounded-[5px] checked:bg-[#A20BA2] checked:border-[#A20BA2] relative 
  checked:after:content-['✔'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-xs"
              />

              <span className="text-[#999999]">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-[#4D4D4D]">
              Forgot Password?
            </Link>
          </div>

          {/* Sign in button */}
          <Button text="Sign in" type="submit" />
        </form>

        {/* OR divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-[#E6E6E6]" />
          <span className="px-2 text-sm text-[#666666]">OR</span>
          <hr className="flex-grow border-[#E6E6E6]" />
        </div>

        {/* Sign up button */}
        <Link to="/choose-type">
          <button className="w-full bg-[#E6E6E6] py-3 rounded-[10px] text-[#666666] mb-[140px] h-[56px] text-[16px] font-regular">
            Sign up
          </button>
        </Link>

        {/* Footer */}
        <div className="flex justify-center space-x-4 text-[14px] text-[#333333] pb-[-1px]">
          <Link to="/terms" className="hover:underline">
            Terms & Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
