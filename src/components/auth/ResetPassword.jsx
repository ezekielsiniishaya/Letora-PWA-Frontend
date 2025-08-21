import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import Header from "../Header";
import PasswordInput from "./PasswordInput";
import ShowSuccess from "../ShowSuccess";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    navigate("/sign-in");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px] relative">
      <Header />

      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Reset Password
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Please Enter your new password
        </p>

        {/* Added onSubmit to form to prevent default behavior */}
        <form
          className="space-y-[30px] mt-[21px]"
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

      {/* Changed from onClick to type="submit" if Button is a submit button, 
          or keep onClick but ensure Button doesn't have type="submit" */}
      <Button
        text="Reset Password"
        className="mt-[119px] w-full"
        onClick={handleCreateAccount}
        type="button" // Explicitly set as button to prevent form submission
      />
      {isSuccessOpen && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Successful Password Change"
          buttonText="Sign in"
          onClose={handleOkay}
        />
      )}
    </div>
  );
}
