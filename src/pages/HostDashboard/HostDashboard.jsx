import { useState, useEffect } from "react";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import MyBooking from "../../components/dashboard/Bookings";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState("myListings");
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    loading: userLoading,
    isAuthenticated,
    refreshUser,
  } = useUser();
  // Refresh user data when component mounts
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
  }, []);
  // Use actual listings from user context
  const listings = user?.apartments || [];

  // Get ALL bookings from user context (both as guest and as host)
  const allBookings = user?.bookings || [];

  // Filter bookings where the user is the HOST
  // This means the apartment's hostId should match the current user's ID
  const hostBookings = allBookings.filter(
    (booking) => booking.apartment?.hostId === user?.id
  );

  const tabs = [
    { key: "myListings", label: "My Listings" },
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Filter bookings based on active tab AND convert status to lowercase for the component
  const filteredBookings = hostBookings.filter((booking) => {
    if (activeTab === "myListings") return false;

    // Map your actual booking statuses to the tab keys
    const statusMap = {
      ongoing: ["ONGOING", "ACTIVE", "CONFIRMED"],
      completed: ["COMPLETED", "ENDED", "FINISHED"],
      cancelled: ["CANCELLED", "CANCELED"],
    };

    return statusMap[activeTab]?.includes(booking.status?.toUpperCase());
  });

  // Convert booking status to lowercase for the MyBooking component
  const bookingsWithLowercaseStatus = filteredBookings.map((booking) => ({
    ...booking,
    displayStatus: booking.status.toLowerCase(), // Convert ONGOING -> ongoing, COMPLETED -> completed
  }));

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex px-[2px] flex-col min-h-screen bg-gray-50">
      {/* Heading */}
      <div className="w-full px-[20px] py-[25px]">
        <div className="flex items-center space-x-5">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-[16.33px] cursor-pointer"
            onClick={() => navigate("/host-homepage")}
          />
          <span className="font-medium text-[13.2px] text-[#333333]">
            My Dashboard
          </span>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex bg-white justify-around rounded-[5px] mx-4 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-[4px] h-[25px] w-[88px] text-[12px] text-center font-medium whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-[#A20BA2] text-white"
                : "bg-[#E9E9E9] text-[#666666]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 mt-[15px] p-4 space-y-1">
        {activeTab === "myListings" ? (
          listings.length > 0 ? (
            listings.map((apt) => (
              <ApartmentCard role="host" key={apt.id} apt={apt} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No listings found</p>
              <button
                onClick={() => navigate("/create-listing")}
                className="bg-[#A20BA2] text-white px-4 py-2 rounded-md text-sm"
              >
                Create Your First Listing
              </button>
            </div>
          )
        ) : bookingsWithLowercaseStatus.length > 0 ? (
          bookingsWithLowercaseStatus.map((booking) => (
            <MyBooking
              key={booking.id}
              booking={booking}
              status={booking.displayStatus} // Use the lowercase status
              onClick={() =>
                navigate(`/host-booking/${booking.id}`, {
                  state: {
                    booking: booking,
                    status: booking.displayStatus,
                    role: "host",
                  },
                })
              }
              completedButtonText={
                booking.displayStatus === "completed"
                  ? "Hold Security Deposit"
                  : undefined
              }
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No {activeTab} bookings found</p>
            <p className="text-xs text-gray-400 mt-2">
              {hostBookings.length === 0
                ? "You don't have any bookings for your properties yet."
                : `You have ${hostBookings.length} total bookings, but none match "${activeTab}" status.`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
