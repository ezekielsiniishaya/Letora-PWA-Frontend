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

  // Get ALL bookings from apartments (nested in each apartment)
  const allBookings = listings.flatMap(
    (apartment) =>
      apartment.bookings?.map((booking) => ({
        ...booking,
        apartment: {
          ...apartment,
          // Remove the bookings array from the apartment object to avoid circular reference
          bookings: undefined,
        },
      })) || []
  );

  // Filter bookings where the user is the HOST (all bookings here are for host's apartments)
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

  // Handler for booking clicks - always navigates to host booking details
  const handleBookingClick = (booking, displayStatus) => {
    navigate(`/host-booking-details/${booking.id}`, {
      state: {
        booking: booking,
        status: displayStatus,
        role: "host",
        currentUserId: user?.id,
      },
    });
  };

  // Empty state messages
  const emptyMessages = {
    myListings: {
      title: "No Current Listings",
      subtitle:
        "You have no current listing. List your apartment now and start earning",
    },
    ongoing: {
      title: "No Ongoing Bookings",
      subtitle: "There are no ongoing booking on your apartments yet",
    },
    completed: {
      title: "No Completed Bookings",
      subtitle: "There are no completed booking on your apartment yet.",
    },
    cancelled: {
      title: "No Cancelled Bookings",
      subtitle: "There are no cancellations on your apartments yet",
    },
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex px-[2px] flex-col min-h-screen bg-[#F9F9F9]">
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
      <main className="flex-1 mt-[15px] p-4 space-y-4">
        {activeTab === "myListings" ? (
          listings.length > 0 ? (
            listings.map((apt) => (
              <ApartmentCard
                role="host"
                key={apt.id}
                apt={apt}
                // Show booking count if needed
                bookingCount={apt.bookings?.length || 0}
              />
            ))
          ) : (
            <div className="mt-[195px] flex flex-col items-center">
              {/* Image stack */}
              <div className="relative w-full h-[180px]">
                <img
                  src="/icons/Rectangle1.png"
                  alt="Back"
                  className="absolute top-0 left-[70px] w-[131.37px] h-[151.83px] z-30"
                />
                <img
                  src="/icons/Rectangle2.png"
                  alt="Back"
                  className="absolute top-2 right-[82px] w-[111.37px] h-[141.83px] border-[2.5px] border-white z-20"
                />
                <img
                  src="/icons/Rectangle3.png"
                  alt="Back"
                  className="absolute top-7 right-[132px] w-[111.37px] h-[141.83px] rounded-[10px] border-[2.5px] border-white z-40"
                />
              </div>

              {/* Text below */}
              <h2 className="mt-3 ml-2 text-center text-[14px] font-medium text-[#505050]">
                {emptyMessages.myListings.title}
              </h2>
              <p className="text-[12px] text-[#807F7F] ml-2 text-center mt-2 w-[240px]">
                {emptyMessages.myListings.subtitle}
              </p>
            </div>
          )
        ) : bookingsWithLowercaseStatus.length > 0 ? (
          bookingsWithLowercaseStatus.map((booking) => (
            <MyBooking
              key={booking.id}
              booking={booking}
              status={booking.displayStatus} // Use the lowercase status
              // ADD THIS LINE - pass the user prop
              user={user}
              onClick={() => handleBookingClick(booking, booking.displayStatus)}
              completedButtonText={
                booking.displayStatus === "completed"
                  ? "Hold Security Deposit"
                  : undefined
              }
            />
          ))
        ) : (
          <div className="mt-[195px] flex flex-col items-center">
            {/* Image stack */}
            <div className="relative w-full h-[180px]">
              <img
                src="/icons/Rectangle1.png"
                alt="Back"
                className="absolute top-0 left-[70px] w-[131.37px] h-[151.83px] z-30"
              />
              <img
                src="/icons/Rectangle2.png"
                alt="Back"
                className="absolute top-2 right-[82px] w-[111.37px] h-[141.83px] border-[2.5px] border-white z-20"
              />
              <img
                src="/icons/Rectangle3.png"
                alt="Back"
                className="absolute top-7 right-[132px] w-[111.37px] h-[141.83px] rounded-[10px] border-[2.5px] border-white z-40"
              />
            </div>

            {/* Text below */}
            <h2 className="mt-3 ml-2 text-center text-[14px] font-medium text-[#505050]">
              {emptyMessages[activeTab].title}
            </h2>
            <p className="text-[12px] text-[#807F7F] ml-2 text-center mt-2 w-[240px]">
              {emptyMessages[activeTab].subtitle}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
