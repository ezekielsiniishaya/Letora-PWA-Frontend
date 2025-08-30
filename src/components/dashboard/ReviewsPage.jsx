import ReviewsSections from "./ReviewsSections";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="flex flex-col min-h-screen md:pt-[36px] relative">
      <div className="relative z-10">
        <div className="mt-[21.87px] md:hidden mb-[22px] flex pr-14 items-center">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-[27px] p-1 ml-[20px] md:hidden h-[33px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-[14px] ml-1 font-medium">Reviews</h1>
          <div />
        </div>
        <div className="md:hidden">
          <h1 className="font-semibold  ml-[20px] mb-[1px] text-[#333333] text-[14px]">
            Reviews (20)
          </h1>

          <div className="px-[21px] md:px-[31px] mb-[60px]">
            <ReviewsSections />
          </div>
        </div>
      </div>
    </div>
  );
}
