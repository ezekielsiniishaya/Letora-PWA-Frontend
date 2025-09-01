import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

export default function IdentityWithPictureInfo() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[21px]">
      {/* Header */}
      <div className="w-full flex items-center justify-between mt-[20px]">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-[16px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      {/* Content */}
      <div className="w-full  mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">
          One Last Step.....
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          This is the last step...we promise
        </p>

        {/* Upload Box (now just an illustration) */}
        <div className="mt-[41px] text-[#333333] rounded-[5px] bg-white flex flex-col items-center h-[376px]">
          <img
            src="/images/verify.png"
            alt="ID Example"
            className="w-[335px] h-[202px] mt-[17px] object-cover rounded-[5px]"
          />
          <h3 className="font-medium mt-[15px] text-[15px] ">
            Upload Your ID Card with Face Visible
          </h3>
          <p className="text-[14px] w-full px-[12px] text-center mt-[11px] text-[#505050]">
            To continue, please upload a clear photo of your government-issued
            ID card with your face clearly visible next to it. No hats,
            sunglasses or filters please.
          </p>
        </div>
        <Link to="/identity-selfie">
          <div className="mt-[64px]">
            <Button text="Next" type="submit" />
          </div>
        </Link>
      </div>
    </div>
  );
}
