import { useState } from "react";
import ApartmentSlider from "../../components/dashboard/ApartmentSlider";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import ShowSuccess from "../../components/ShowSuccess";
import { Link } from "react-router-dom";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";
import { useApartmentListing } from "../../hooks/useApartmentListing";
import { useUser } from "../../hooks/useUser";

export default function Dashboard() {
  const [showSuccess, setShowSuccess] = useState(false);

  // Use the apartment listing context
  const {
    apartments,
    hotApartments,
    nearbyApartments,
    hotApartmentsLoading,
    nearbyApartmentsLoading,
    error,
  } = useApartmentListing();

  // Use the user context
  const {
    user,
    loading: userLoading,
    isAuthenticated,
    getUserBookings,
    getUnreadNotificationsCount,
  } = useUser();

  console.log("User context:", user); // Debug log to check user data
  const unreadCount = getUnreadNotificationsCount();

  // Get user's actual bookings
  const userBookings = getUserBookings();

  // Use first booking or fallback to hardcoded data
  const currentBooking = userBookings.length > 0 ? userBookings[0] : null;

  // Show loading state for user data
  if (userLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  // Show error state only for critical errors
  if (error && apartments.length === 0 && hotApartments.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div>Error loading apartments: {error}</div>
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
      <div
        className="relative h-[270px] text-white px-[21.5px] pt-[60px] bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/background/guest-bg-homepage.png)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-75"></div>

        {/* Top row: Image + Notification */}
        <div className="relative flex flex-row justify-between items-center z-10">
          <img
            src={user?.profilePic || "/images/profile-image.png"}
            alt={user?.firstName || "Guest"}
            className="w-[43.77px] h-[43.77px] rounded-full object-cover"
          />

          <Link to="/notifications">
            <div className="relative w-[30px] h-[30px] bg-[#1A1A1A] rounded-full flex items-center justify-center">
              <img
                src="/icons/notification.svg"
                alt="Notifications"
                className="w-[17px] h-[17px] cursor-pointer"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#1A1A1A] text-white text-[9px] font-medium rounded-full w-[18px] h-[18px] flex items-center justify-center border">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Guest name + Discover text */}
        <div className="relative mt-[20px] z-10">
          <h2 className="text-[16px] font-semibold">
            {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
          </h2>
          <p className="text-[12.02px]">Discover wonderful Apartments</p>
        </div>

        {/* Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[32px] w-[90%] h-[42.91px] z-10">
          <div className="bg-white rounded-full flex items-center px-[17px] py-[13px] shadow">
            <img
              src="/icons/search.svg"
              alt="Search"
              className="w-[14px] h-[14px] mr-[14.3px]"
            />
            <input
              type="text"
              placeholder="Search Apartments, Apartment type, Location..."
              className="flex-1 text-[11px] text-[#666666] outline-none"
            />
          </div>
        </div>
      </div>

      {/* My Booking Section - Show empty state when no booking */}
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
              alt="No bookings"
              className="w-[42px] h-[42px] mb-2 grayscale"
            />
            <p className="text-[#505050] mt-2 text-[12px] font-medium w-[125px] text-center">
              No Hot Apartments at the moment
            </p>
          </div>
        )}
      </div>

      {/* Become a Host - Only show for guests */}
      {user?.role === "GUEST" && (
        <Link to="/identity-id">
          <div className="px-[22px]">
            <div className="relative bg-gradient-to-r from-[#910A91] to-[#F711F7] rounded-[8px] px-[12px] flex items-center justify-between overflow-hidden h-[106.04px]">
              <div className="text-white max-w-[70%] z-10">
                <h3 className="font-semibold text-[16px] mb-1">
                  Become a Host
                </h3>
                <p className="text-[12px] leading-snug">
                  Ready to cash in on your space? <br />
                  Verify your identity and list today.
                </p>
                <button className="mt-2 text-[10px]">
                  Click here to begin
                </button>
              </div>
              <div className="absolute right-[-10px] bottom-0 h-full flex items-end justify-end">
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
            </div>
          </div>
        </Link>
      )}
      {/* Nearby Apartments */}
      <div className="px-[22px]">
        <div className="flex justify-between items-center">
          <h3 className="font-medium mt-6 mb-4 text-[14px]">
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
                alt="No bookings"
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
