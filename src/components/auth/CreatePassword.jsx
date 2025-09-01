import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import Header from "../Header";
import PasswordInput from "./PasswordInput";
import ShowSuccess from "../ShowSuccess";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any event bubbling
    console.log("Opening success modal"); // Debug log
    setIsSuccessOpen(true);
  };

  const handleOkay = () => {
    console.log("Closing success modal"); // Debug log
    setIsSuccessOpen(false);
    navigate("/identity-id");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px] relative">
      <Header />

      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Create Password
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Passwords must be at least 8 characters long
        </p>

        {/* Added onSubmit to form to prevent default behavior */}
        <form
          className="space-y-[41px] mt-[21px]"
          onSubmit={handleCreateAccount}
        >
          <PasswordInput
            label="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </form>
      </div>

      <div className="flex flex-row pt-[15px] pb-[40px]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="appearance-none border border-[#CCCCCC] w-[20px] h-[20px] rounded-[5px] checked:bg-[#A20BA2] checked:border-[#A20BA2] flex-shrink-0 mt-[6px] relative
    checked:after:content-['✔'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-sm"
        />
        <span className="text-[#0D132180] leading-snug pb-[86px] font-medium text-[12px] ml-2">
          I have read Letora's{" "}
          <span className="text-[#A20BA2]">Terms and Conditions</span> and I
          agree to abide by it.
        </span>
      </div>

      {/* Changed from onClick to type="submit" if Button is a submit button, 
          or keep onClick but ensure Button doesn't have type="submit" */}
      <Button
        text="Create Account"
        className="mt-[20px] w-full"
        onClick={handleCreateAccount}
        type="button" // Explicitly set as button to prevent form submission
      />
      {isSuccessOpen && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Account Successfully Created"
          buttonText="Done"
          onClose={handleOkay}
        />
      )}
    </div>
  );
}
