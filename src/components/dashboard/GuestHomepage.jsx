// Updated Dashboard component (simplified version)
import { useState } from "react";
import ApartmentSlider from "../../components/dashboard/ApartmentSlider";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import ShowSuccess from "../../components/ShowSuccess";
import { Link } from "react-router-dom";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";
import BecomeHostBanner from "./BecomeHostBanner"; // Import the new component
import { useApartmentListing } from "../../hooks/useApartmentListing";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button";
import CurrentLocationDropdown from "../dashboard/SelectState";
import { useApartmentsByLocation } from "../../hooks/useApartmentsByLocation";
export default function Dashboard() {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    apartments,
    hotApartments,
    nearbyApartments,
    hotApartmentsLoading,
    nearbyApartmentsLoading,
    error,
    refetch: refetchApartments,
  } = useApartmentListing();

  const {
    user,
    loading: userLoading,
    isAuthenticated,
    error: userError,
    refetch: refetchUser,
    getUserBookings,
    getUnreadNotificationsCount,
  } = useUser();
  const { refetch } = useApartmentsByLocation();
  const unreadCount = getUnreadNotificationsCount();
  const userBookings = getUserBookings();

  const currentBooking = userBookings.find(
    (booking) => booking.status?.toLowerCase() !== "pending" || null
  );
  const handleLocationChange = (newLocation) => {
    console.log("📍 Location changed to:", newLocation);
    // The useApartmentsByLocation hook will automatically refetch due to the dependency
    // But you can also manually trigger if needed:
    refetch();
  };

  // --- Loading state ---
  if (userLoading || hotApartmentsLoading || nearbyApartmentsLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  // --- Handle server/db errors or missing user profile ---
  if (
    userError ||
    !user ||
    !isAuthenticated ||
    (error && apartments.length === 0 && hotApartments.length === 0)
  ) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center px-4 text-center">
        <img
          src="/icons/unconfirmed-payment.png"
          alt="Error"
          className="w-[60px] h-[60px] rounded-full mb-4 "
        />
        <h3 className="text-[#505050] font-semibold mb-2 text-[14px]">
          Oops! Something went wrong.
        </h3>
        <p className="text-[#777] text-[12px] mb-4 max-w-[240px]">
          {userError
            ? "We couldn't load your profile right now."
            : "We couldn't reach the server or load apartment data."}
        </p>
        <Button
          text="Retry"
          onClick={() => {
            window.location.reload();
            refetchUser?.();
            refetchApartments?.();
          }}
        />
      </div>
    );
  }

  // --- Render full dashboard ---
  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] overflow-x-hidden pb-[80px]">
      {/* Header */}
      <div
        className="relative h-[270px] text-white px-[21.5px] pt-[60px] bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/background/guest-bg-homepage.png)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-75"></div>

        {/* Profile + Notifications */}
        <div className="flex items-center">
          {/* Your other elements on the left */}

          <Link to="/notifications" className="ml-auto">
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

        {/* Select Guest Current Location */}
        <CurrentLocationDropdown onLocationChange={handleLocationChange} />

        {/* Guest name */}
        <div className="relative mb-[15px] z-10">
          <h2 className="text-[17px] font-semibold">
            {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
          </h2>
          <p className="text-[12.02px]">Discover wonderful Apartments</p>
        </div>

        {/* Search Bar */}
        <Link
          to="/search"
          className="absolute left-1/2 -translate-x-1/2 bottom-[32px] w-[90%] h-[42.91px] z-10"
        >
          <div className="bg-white rounded-full flex px-[17px] py-[13px] shadow cursor-pointer">
            <img
              src="/icons/search.svg"
              alt="Search"
              className="w-[14.3px]mt-1 h-[14.3px] mr-[14.3px]"
            />
            <div className="flex-1 text-[12px]  text-[#666666]">
              Search Apartments, Type, Location....
            </div>
          </div>
        </Link>
      </div>

      {/* My Bookings */}
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
        {hotApartments.length > 0 ? (
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

      {/* Become a Host Banner - Now self-contained */}
      <BecomeHostBanner />

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
          {nearbyApartments.length > 0 ? (
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

      {/* Success Modal */}
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
