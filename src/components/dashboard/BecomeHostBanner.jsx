// components/dashboard/BecomeHostBanner.jsx
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const BecomeHostBanner = () => {
  const { user, loading } = useUser();

  // Don't render anything if still loading user data
  if (loading) {
    return null;
  }

  // Only show for GUEST role
  if (user?.role !== "GUEST") {
    return null;
  }

  return (
    <Link to="/identity-id">
      <div className="relative overflow-hidden px-[22px]">
        <div className="relative bg-gradient-to-r from-[#910A91] to-[#F711F7] rounded-[8px] px-[12px] flex items-center justify-between overflow-hidden h-[106.04px]">
          <div className="text-white max-w-[70%] z-10">
            <h3 className="font-semibold text-[16px] mb-1">Become a Host</h3>
            <p className="text-[12px] leading-snug">
              Ready to cash in on your space? <br />
              Verify your identity and list today.
            </p>
            <button className="mt-2 font-medium text-[10px]">Click here to begin</button>
          </div>
          <div className="absolute right-[0px] bottom-0 h-full flex items-end justify-end">
            <img
              src="/images/background/become-host.png"
              alt="Become a Host"
              className="h-[117px] object-contain transform scale-x-[-1] relative z-10"
            />
            <img
              src="/icons/star.svg"
              alt="star"
              className="absolute top-[15px] right-[114.3px] w-[9px] h-[9px] z-20"
            />
            <img
              src="/icons/doodle.svg"
              alt="doodle"
              className="absolute bottom-[12.27px] right-[121.73px] w-[6.3px] h-[5.4px] z-20"
            />
          </div>
        </div>{" "}
        <img
          src="/icons/logo.svg"
          alt="Logo"
          className="absolute top-2 right-0 w-[112px] opacity-40 h-[119.88px]"
        />
      </div>
    </Link>
  );
};

export default BecomeHostBanner;
