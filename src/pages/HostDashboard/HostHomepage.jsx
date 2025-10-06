import { useState } from "react";
import ApartmentSlider from "../../components/dashboard/ApartmentSlider";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import WithdrawPopup from "../../components/dashboard/WithdrawPopUp";
import ShowSuccess from "../../components/ShowSuccess";
import { Link } from "react-router-dom";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";
import { useApartmentListing } from "../../hooks/useApartmentListing";
import { useUser } from "../../hooks/useUser";

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };
  // Use the apartment listing context
  const {
    hotApartments,
    nearbyApartments,
    hotApartmentsLoading,
    nearbyApartmentsLoading,
  } = useApartmentListing();

  // Use the user context
  const {
    user,
    loading: userLoading,
    isAuthenticated,
    getUserBookings,
    // getUserApartments,
  } = useUser();

  // Get user's actual bookings and apartments
  const userBookings = getUserBookings();
  // const userApartments = getUserApartments();

  // Use first booking or fallback
  const currentBooking = userBookings.length > 0 ? userBookings[0] : null;

  // Get account balance from host profile
  const accountBalance = user?.hostProfile?.accountBalance || 0;
  const formattedBalance =
    accountBalance === 0
      ? "0.0"
      : accountBalance.toLocaleString("en-NG", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        });

  // Show loading state for user data
  if (userLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div>Please login to view dashboard</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] overflow-x-hidden pb-[80px]">
      {/* Header */}
      <div className="relative bg-[#8C068C] h-[252px] text-white px-[20px] pt-[14px]">
        {/* Header Row */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={user?.profilePic || "/images/profile-image.png"}
              alt={user?.firstName || "Host"}
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div>
              <h2 className="text-[16px] font-semibold">
                {user ? `${user.firstName} ${user.lastName}` : "Host"}
              </h2>
              <p className="text-[12px] text-[#FBD0F8]">
                {getTimeBasedGreeting()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/search">
              <img
                src="/icons/search-white.svg"
                alt="Search"
                className="w-[18.67px] h-[18.67px] cursor-pointer"
              />
            </Link>
            <Link to="/host-notifications">
              <div className="relative">
                <img
                  src="/icons/notification.svg"
                  alt="Notifications"
                  className="w-[18.65px] h-[18.65px] cursor-pointer"
                />
                <span className="absolute -top-1 -right-[6px] bg-white text-purple-600 text-[8.69px] font-medium rounded-full w-[16px] h-[16px] flex items-center justify-center shadow">
                  5
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Balance Section */}
        <div className="mt-[26px] flex flex-col items-center">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-[#FBD0FB]">
              Current Balance
            </p>
            <img
              src={showBalance ? "/icons/eye-open.svg" : "/icons/eye-close.svg"}
              alt="Toggle Balance"
              className="w-[18.58px] h-[18.58px] cursor-pointer z-10"
              onClick={() => setShowBalance(!showBalance)}
            />
          </div>
          <h1 className="text-[38px] font-semibold mt-[1px]">
            <span className="text-[28.43px]">₦</span>
            {showBalance ? (
              <>
                {formattedBalance.split(".")[0]}.
                <span className="text-[#FBD0FB] text-[25px] font-medium">
                  {formattedBalance.split(".")[2] || "00"}
                </span>
              </>
            ) : (
              <>
                ******.
                <span className="text-[#FBD0FB] text-[18px] font-medium">
                  ***
                </span>
              </>
            )}
          </h1>
          <button
            onClick={() => setShowWithdraw(true)}
            className="mt-[18px] bg-white text-[#8C167E] text-[14px] rounded-[5px] font-semibold flex items-center justify-center gap-2 w-[197.03px] h-[41.53px]"
          >
            <img
              src="/icons/arrow-slant.svg"
              alt="arrow-slant"
              className="w-[14px] h-[12px] object-cover"
            />
            <span>Withdraw</span>
          </button>

          <img
            src="/icons/logo.svg"
            alt="Logo"
            className="absolute -bottom-5 -right-10 opacity-10 w-[196px] h-[189.88px]"
          />
        </div>
      </div>

      {/* My Booking Section - Only show if there's a current booking */}
      {currentBooking && (
        <div className="px-[21px] mt-[25px]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-[14px]">My Booking 🗂</h3>
            <Link to="/bookings">
              <button className="text-[12px] font-medium text-[#A20BA2]">
                See all
              </button>
            </Link>
          </div>
          <Bookings
            booking={currentBooking}
            status={currentBooking.status?.toLowerCase() || "ongoing"}
          />
        </div>
      )}

      {/* Hot Apartments */}
      <div className="px-[22px] mt-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium my-4 text-[14px]">Hot Apartments 🔥</h3>
          <Link to="/hot-apartments">
            <button className="text-[12px] font-medium text-[#A20BA2]">
              See all
            </button>
          </Link>
        </div>
      </div>
      <div className="pl-[22px] pb-3">
        {hotApartmentsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
          </div>
        ) : (
          <ApartmentSlider apartments={hotApartments} />
        )}
      </div>

      {/* My Listed Apartments - Commented out as requested */}
      {/* {userApartments.length > 0 && (
        <div className="px-[22px]">
          <div className="flex justify-between items-center">
            <h3 className="font-medium my-4 text-[14px]">
              My Listed Apartments 🏠
            </h3>
            <Link to="/host-apartments">
              <button className="text-[12px] font-medium text-[#A20BA2]">
                Manage
              </button>
            </Link>
          </div>
          <div className="space-y-1">
            {userApartments.slice(0, 3).map((apt) => (
              <ApartmentCard key={apt.id} apt={apt} role="host" />
            ))}
          </div>
        </div>
      )} */}

      {/* Available Apartments */}
      <div className="px-[22px]">
        <div className="flex justify-between items-center">
          <h3 className="font-medium my-4 text-[14px]">
            Available in your Location 📍
          </h3>
          <Link to="/apartments">
            <button className="text-[12px] font-medium text-[#A20BA2]">
              See all
            </button>
          </Link>
        </div>
        <div className="space-y-1">
          {nearbyApartmentsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
            </div>
          ) : nearbyApartments.length > 0 ? (
            nearbyApartments.map((apt) => (
              <ApartmentCard key={apt.id} apt={apt} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No apartments available in your location
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navigation />

      {/* Withdraw Popup */}
      {showWithdraw && (
        <WithdrawPopup
          balance={formattedBalance}
          onClose={() => setShowWithdraw(false)}
          onSuccess={() => {
            setShowWithdraw(false);
            setShowSuccess(true);
          }}
        />
      )}

      {/* Show Success Popup */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Withdrawal Successful"
          message="₦550,000 has been moved from your Letora wallet to your bank account. Arrival time may vary by bank."
          buttonText="Done"
          onClose={() => setShowSuccess(false)}
          height="auto"
        />
      )}
    </div>
  );
}
