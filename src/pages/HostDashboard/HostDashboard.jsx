import { useState, useEffect } from "react";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import MyBooking from "../../components/dashboard/Bookings";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { apiRequest } from "../../services/apiRequest";
import Alert from "../../components/utils/Alerts";

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState("myListings");
  const [apartments, setApartments] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    type: "error",
    message: "",
  });
  const [isLoadingApartments, setIsLoadingApartments] = useState(false);

  const navigate = useNavigate();
  const {
    user,
    isLoading: userLoading,
    isAuthenticated,
    refreshUser,
    getUserBookings,
  } = useUser();

  // Show alert function
  const showAlert = (type, message, timeout = 5000) => {
    setAlert({ show: true, type, message });

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

  // Refresh user data when component mounts
  useEffect(() => {
    const refreshUserData = async () => {
      if (isAuthenticated() && !userLoading) {
        try {
          await refreshUser();
          console.log("✅ User data refreshed successfully");
        } catch (error) {
          console.error("❌ Failed to refresh user data:", error);
          showAlert("error", "Failed to refresh user data. Please try again.");
        }
      }
    };

    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch apartments from API
  useEffect(() => {
    if (!user?.id) return;

    const fetchHostApartments = async () => {
      setIsLoadingApartments(true);
      try {
        console.log("🔍 Fetching apartments for host:", user.id);

        const response = await apiRequest(`/api/apartments/host/${user.id}`, {
          method: "GET",
        });

        console.log("📦 API Response:", response);

        if (response?.success) {
          console.log("✅ Apartments loaded:", response.data.length);
          console.log("📊 Apartments data:", response.data);

          // Log bookings for each apartment
          response.data.forEach((apt, index) => {
            console.log(`🏠 Apartment ${index + 1} (${apt.title}):`, {
              id: apt.id,
              bookings: apt.bookings,
              bookingCount: apt.bookings?.length || 0,
            });
          });

          setApartments(response.data);
        } else {
          console.warn("⚠️ API response not successful:", response);
          showAlert("error", "Failed to load your apartments");
        }
      } catch (error) {
        console.error("❌ Failed to load host apartments:", error);
        showAlert("error", "Failed to load apartments. Please try again.");
      } finally {
        setIsLoadingApartments(false);
      }
    };

    fetchHostApartments();
  }, [user?.id]);

  // Get ALL bookings from TWO sources
  console.log("🔍 === BOOKING AGGREGATION DEBUG ===");

  // 1. User's own bookings as GUEST
  const guestBookings = getUserBookings().map((booking) => ({
    ...booking,
    role: "guest",
  }));
  console.log("👤 Guest bookings (user's own stays):", guestBookings);
  console.log("👤 Guest bookings count:", guestBookings.length);

  // 2. Bookings on user's apartments as HOST
  const hostApartmentBookings = apartments.flatMap((apartment) => {
    const bookings =
      apartment.bookings?.map((booking) => ({
        ...booking,
        apartment: {
          ...apartment,
          bookings: undefined,
        },
        role: "host",
      })) || [];

    console.log(`🏠 Apartment "${apartment.title}" bookings:`, bookings);
    return bookings;
  });

  console.log("🏠 Host apartment bookings:", hostApartmentBookings);
  console.log(
    "🏠 Host apartment bookings count:",
    hostApartmentBookings.length
  );

  // Combine ALL bookings
  const allBookings = [...guestBookings, ...hostApartmentBookings];
  console.log("📋 All bookings (combined):", allBookings);
  console.log("📋 All bookings count:", allBookings.length);

  // Remove duplicates based on booking ID
  const uniqueBookings = allBookings.filter(
    (booking, index, self) =>
      index === self.findIndex((b) => b.id === booking.id)
  );
  console.log("🎯 Unique bookings:", uniqueBookings);
  console.log("🎯 Unique bookings count:", uniqueBookings.length);

  const tabs = [
    { key: "myListings", label: "My Listings" },
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Under Dispute" },
  ];

  // Filter bookings based on active tab
  const filteredBookings = uniqueBookings.filter((booking) => {
    if (activeTab === "myListings") return false;

    const statusMap = {
      ongoing: ["ONGOING", "ACTIVE", "CONFIRMED"],
      completed: ["COMPLETED", "ENDED", "FINISHED"],
      cancelled: ["CANCELLED", "CANCELED"],
    };

    const bookingStatus = booking.status?.toUpperCase();
    const isMatch = statusMap[activeTab]?.includes(bookingStatus);

    console.log(`🔍 Filtering booking ${booking.id}:`, {
      status: bookingStatus,
      activeTab,
      expectedStatuses: statusMap[activeTab],
      isMatch,
    });

    return isMatch;
  });

  console.log(`📊 Filtered bookings for tab "${activeTab}":`, filteredBookings);
  console.log(`📊 Filtered bookings count:`, filteredBookings.length);

  // Convert booking status to lowercase for the component
  const bookingsWithLowercaseStatus = filteredBookings.map((booking) => ({
    ...booking,
    displayStatus: booking.status?.toLowerCase() || "ongoing",
  }));

  // Handler for booking clicks
  const handleBookingClick = (booking) => {
    console.log("🖱️ Booking clicked:", booking);

    if (booking.role === "host") {
      navigate(`/host-booking-details/${booking.id}`, {
        state: {
          booking: booking,
          status: booking.displayStatus,
          role: "host",
          currentUserId: user?.id,
        },
      });
    } else {
      navigate(`/bookings/${booking.id}`, {
        state: {
          booking: booking,
          status: booking.displayStatus,
          role: "guest",
          currentUserId: user?.id,
        },
      });
    }
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
      subtitle:
        "There are no ongoing bookings for your apartments or your own stays",
    },
    completed: {
      title: "No Completed Bookings",
      subtitle:
        "There are no completed bookings for your apartments or your own stays",
    },
    cancelled: {
      title: "No Cancelled Bookings",
      subtitle:
        "There are no cancellations for your apartments or your own stays",
    },
  };

  // Show loading state
  if (userLoading || isLoadingApartments) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
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
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Please login to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex px-[2px] flex-col min-h-screen bg-[#F9F9F9]">
      {/* Alert Container */}
      {alert.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert
            type={alert.type}
            message={alert.message}
            onDismiss={dismissAlert}
            timeout={5000}
          />
        </div>
      )}

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
      <div className="flex bg-white rounded-[5px] mx-4 p-[3px] gap-[5px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-[4px] h-[25px] text-[12px] text-center font-medium whitespace-nowrap ${
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
          apartments.length > 0 ? (
            apartments.map((apt) => (
              <ApartmentCard
                role="host"
                key={apt.id}
                apt={apt}
                bookingCount={apt.bookings?.length || 0}
              />
            ))
          ) : (
            <div className="mt-[195px] flex flex-col items-center">
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
              status={booking.displayStatus}
              user={user}
              role={booking.role}
              onClick={() => handleBookingClick(booking)}
              onShowAlert={showAlert}
              completedButtonText={
                booking.displayStatus === "completed"
                  ? booking.role === "guest"
                    ? "Rate your Stay"
                    : "Hold Security Deposit"
                  : undefined
              }
            />
          ))
        ) : (
          <div className="mt-[195px] flex flex-col items-center">
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
