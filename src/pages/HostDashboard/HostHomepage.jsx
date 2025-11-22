// Updated Dashboard component (Host version - corrected)
import { useState, useEffect } from "react";
import ApartmentSlider from "../../components/dashboard/ApartmentSlider";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import WithdrawPopup from "../../components/dashboard/WithdrawPopUp";
import ShowSuccess from "../../components/ShowSuccess";
import { Link } from "react-router-dom";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";
import { useApartmentListing } from "../../hooks/useApartmentListing";
import { useUser } from "../../hooks/useUser";
import CurrentLocationDropdown from "../../components/dashboard/SelectState";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    type: "error",
    message: "",
  });

  // Show alert function
  const showAlert = (type, message, timeout = 5000) => {
    setAlert({ show: true, type, message });

    // Auto-dismiss after timeout
    if (timeout > 0) {
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, timeout);
    }
  };

  // Dismiss alert function
  const dismissAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };
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
    getUnreadNotificationsCount,
    refreshUser,
  } = useUser();

  const handleLocationChange = (newLocation) => {
    console.log("📍 Location changed to:", newLocation);
    window.location.reload();
  };
  const handleWithdrawalSuccess = (amount, data) => {
    setWithdrawalData(data); // Store the withdrawal data
    setShowWithdraw(false);
    setShowSuccess(true);

    // Refresh user data to update balance
    refreshUser();
  };

  // Format the withdrawal amount for display
  const getWithdrawalAmount = () => {
    if (withdrawalData) {
      return withdrawalData.amount.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "0.00";
  };

  // Format the new balance for display
  const getNewBalance = () => {
    if (withdrawalData) {
      // Use newAvailableBalance instead of newBalance
      const balance =
        withdrawalData.newAvailableBalance || withdrawalData.newBalance;
      return balance.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "0.00";
  };

  const unreadCount = getUnreadNotificationsCount();

  // Update bookings whenever user data changes
  useEffect(() => {
    const getAllBookings = () => {
      const userBookings = getUserBookings().map((booking) => ({
        ...booking,
        role: "guest", // ADD THIS - same as BookingsPage
      }));

      // Bookings where host's apartments are booked by others
      const hostApartmentBookings =
        user?.apartments?.flatMap(
          (apartment) =>
            apartment.bookings?.map((booking) => ({
              ...booking,
              isHostBooking: true, // Keep this for backward compatibility
              role: "host", // ADD THIS - same as BookingsPage
              apartment: {
                ...apartment,
                host: user, // Set current user as host
              },
            })) || []
        ) || [];

      // Combine both types of bookings and sort by creation date (newest first)
      const allBookingsCombined = [...userBookings, ...hostApartmentBookings]
        .filter((booking) => booking && booking.id) // Remove any null/undefined bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return allBookingsCombined;
    };

    if (user) {
      const bookings = getAllBookings();
      setAllBookings(bookings);
    }
  }, [user, getUserBookings]); // Add getUserBookings to dependencies

  // Get current/active booking (most recent non-cancelled booking)
  const currentBooking = allBookings.find(
    (booking) => booking.status?.toLowerCase() !== "pending" || null
  );
  // Get account balance from host profile
  // NEW:
  const accountBalance = user?.hostProfile?.availableBalance || 0;
  const withdrawableBalance = user?.hostProfile?.withdrawableBalance || 0;
  const formattedBalance =
    accountBalance === 0
      ? "0.0"
      : accountBalance.toLocaleString("en-NG", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        });

  useEffect(() => {
    const refreshUserData = async () => {
      if (isAuthenticated() && !userLoading) {
        try {
          await refreshUser();
          console.log("User data refreshed successfully");
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }
    };

    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once
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
      <div className="relative bg-[#8C068C] h-[298px] text-white px-[20px] pt-[14px]">
        {/* FIX: Move CurrentLocationDropdown to the top */}
        <div className="relative z-20 pt-[70px] mb-[-20px]">
          {" "}
          {/* Added pt-4 and higher z-index */}
          <CurrentLocationDropdown
            onLocationChange={handleLocationChange}
            className="host-location-dropdown" // Optional: for custom styling
          />
        </div>

        {/* Header Row */}
        <div className="flex flex-row justify-between items-center">
          {" "}
          {/* Reduced mt */}
          <div className="flex items-center gap-3">
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
            <Link to="/notifications">
              <div className="relative">
                <img
                  src="/icons/notification.svg"
                  alt="Notifications"
                  className="w-[20.65px] h-[20.65px] cursor-pointer"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-[8px] bg-white text-purple-600 text-[8.69px] font-medium rounded-full w-[16px] h-[16px] flex items-center justify-center shadow">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Rest of your host dashboard content... */}
        {/* Balance Section */}
        <div className="mt-[16px] flex flex-col items-center">
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
                  {formattedBalance.split(".")[1] || "00"}
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
      {/* Rest of your dashboard content remains the same... */}
      {/* My Booking Section */}
      {/* Alert Container */}
      {alert.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <alert
            type={alert.type}
            message={alert.message}
            onDismiss={dismissAlert}
            timeout={5000}
          />
        </div>
      )}
      <div className="px-[21px] mt-[25px]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-[14px]">My Booking 🗂</h3>
          <Link to="/bookings">
            <button className="text-[12px] font-medium text-[#A20BA2]">
              See all
            </button>
          </Link>
        </div>
        {currentBooking ? (
          <Bookings
            booking={currentBooking}
            status={currentBooking.status?.toLowerCase() || "ongoing"}
            isHostBooking={currentBooking.isHostBooking}
            completedButtonText={
              currentBooking.status?.toLowerCase() === "completed"
                ? currentBooking.role === "host"
                  ? "Hold Security Deposit" // For host's apartments
                  : "Rate your Stay" // For guest bookings
                : undefined
            }
            user={user}
            role={currentBooking.role} // ADD THIS - pass the role
            onShowAlert={showAlert} // You might need to add this function
            onClick={() => {
              // ADD THIS - navigate with proper role information
              if (currentBooking.role === "host") {
                navigate(`/host-booking-details/${currentBooking.id}`, {
                  state: {
                    booking: currentBooking,
                    status: currentBooking.status?.toLowerCase(),
                    role: "host",
                    currentUserId: user?.id,
                  },
                });
              } else {
                navigate(`/bookings/${currentBooking.id}`, {
                  state: {
                    booking: currentBooking,
                    status: currentBooking.status?.toLowerCase(),
                    role: "guest",
                    currentUserId: user?.id,
                  },
                });
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 rounded-lg">
            <img
              src="/icons/no-booking.png"
              alt="No bookings"
              className="w-[42px] h-[42px] mb-2 grayscale"
            />
            <p className="text-[#505050] mt-2 text-[12px] font-medium w-[125px] text-center">
              You Are Yet to Have a Booking
            </p>
          </div>
        )}
      </div>
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
        ) : hotApartments.length > 0 ? (
          <ApartmentSlider apartments={hotApartments} />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 rounded-lg">
            <img
              src="/icons/no-hot-apartment.png"
              alt="No hot apartments"
              className="w-[42px] h-[42px] mb-2 grayscale"
            />
            <p className="text-[#505050] mt-2 text-[12px] font-medium w-[125px] text-center">
              No Hot Apartments at the moment
            </p>
          </div>
        )}
      </div>
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
            <div className="flex flex-col items-center justify-center py-8 rounded-lg">
              <img
                src="/icons/no-apartment-location.png"
                alt="No apartments"
                className="w-[42px] h-[42px] mb-2 grayscale"
              />
              <p className="text-[#505050] mt-2 text-[12px] font-medium w-[125px] text-center">
                No Available Shortlets in your location
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Bottom Navigation */}
      <Navigation />
      {/* Withdraw Popup */}
      {showWithdraw && (
        <WithdrawPopup
          balance={withdrawableBalance.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          onClose={() => setShowWithdraw(false)}
          onSuccess={handleWithdrawalSuccess} // Use the updated callback
        />
      )}
      {/* Show Success Popup with actual data */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Withdrawal Successful"
          message={`₦${getWithdrawalAmount()} has been moved from your Letora wallet to your bank account. Your new balance is ₦${getNewBalance()}. Arrival time may vary by bank.`}
          buttonText="Done"
          onClose={() => {
            setShowSuccess(false);
            setWithdrawalData(null); // Reset withdrawal data
          }}
          height="auto"
        />
      )}
    </div>
  );
}
