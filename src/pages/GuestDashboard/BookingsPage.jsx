import { useState, useEffect, useContext } from "react";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";
import Alert from "../../components/utils/Alerts"; // Import your Alert component
import { useUser } from "../../hooks/useUser";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [alert, setAlert] = useState({
    show: false,
    type: "error",
    message: "",
  });
  const { refreshUser } = useContext(UserContext);
  const navigate = useNavigate();
  // Use the user context to get actual bookings data
  const {
    loading: userLoading,
    isAuthenticated,
    user,
    getUserBookings,
  } = useUser();

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

  // Refresh user data when component mounts
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        await refreshUser?.();
      } catch (err) {
        console.error("Failed to refresh user data:", err);
        // Use custom alert instead of browser alert
        showAlert("error", "Failed to refresh user data. Please try again.");
      }
    };

    refreshUserData();
  }, [refreshUser]);

  const tabs = [
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Under Dispute" },
  ];

  // Get ALL bookings from TWO sources:
  // 1. User's own bookings as GUEST (from getUserBookings)
  const guestBookings = getUserBookings().map((booking) => ({
    ...booking,
    role: "guest", // Mark as guest booking
  }));

  // 2. Bookings on user's apartments (if user is a host)
  const hostApartmentBookings = (user?.apartments || []).flatMap(
    (apartment) =>
      apartment.bookings?.map((booking) => ({
        ...booking,
        apartment: {
          ...apartment,
          // Remove the bookings array from the apartment object to avoid circular reference
          bookings: undefined,
        },
        role: "host", // Mark as host booking
      })) || []
  );

  // Combine ALL bookings
  const allBookings = [...guestBookings, ...hostApartmentBookings];

  // Remove duplicates based on booking ID
  const uniqueBookings = allBookings.filter(
    (booking, index, self) =>
      index === self.findIndex((b) => b.id === booking.id)
  );

  // Filter bookings based on active tab AND status mapping
  const filteredBookings = uniqueBookings.filter((booking) => {
    // Map your actual booking statuses to the tab keys
    const statusMap = {
      ongoing: ["ONGOING", "ACTIVE", "CONFIRMED"],
      completed: ["COMPLETED", "ENDED", "FINISHED"],
      cancelled: ["CANCELLED", "CANCELED"],
    };

    return statusMap[activeTab]?.includes(booking.status?.toUpperCase());
  });

  // Convert booking status to lowercase for the Bookings component
  const bookingsWithLowercaseStatus = filteredBookings.map((booking) => ({
    ...booking,
    displayStatus: booking.status?.toLowerCase() || "ongoing",
  }));

  // Handler for booking clicks - navigates to appropriate booking details based on role
  const handleBookingClick = (booking) => {
    if (booking.role === "host") {
      // Navigate to host booking details for bookings on user's apartments
      navigate(`/host-booking-details/${booking.id}`, {
        state: {
          booking: booking,
          status: booking.displayStatus,
          role: "host",
          currentUserId: user?.id,
        },
      });
    } else {
      // Navigate to guest booking details for user's own bookings
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

  // Dynamic empty messages - updated to reflect both guest and host bookings
  const emptyMessages = {
    ongoing: {
      title: "No Ongoing Bookings",
      subtitle:
        user?.role === "HOST"
          ? "You have no ongoing bookings for your apartments or your own stays"
          : "Your next adventure is just around the corner. Start booking now",
    },
    completed: {
      title: "No Completed Bookings",
      subtitle:
        user?.role === "HOST"
          ? "You have no completed bookings for your apartments or your own stays"
          : "Your next adventure is just around the corner. Start booking now",
    },
    cancelled: {
      title: "No Cancelled Bookings",
      subtitle:
        user?.role === "HOST"
          ? "You have no cancelled bookings for your apartments or your own stays"
          : "Your next adventure is just around the corner. Start booking now",
    },
  };

  // Show loading state
  if (userLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
        <header className="px-[21px] pt-4 pb-[20px]">
          <h1 className="text-[24px] font-medium text-[#0D1321]">Bookings</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
        </div>
        <footer className="sticky bottom-0">
          <Navigation />
        </footer>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
        <header className="px-[21px] pt-4 pb-[20px]">
          <h1 className="text-[24px] font-medium text-[#0D1321]">Bookings</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Please login to view your bookings</p>
        </div>
        <footer className="sticky bottom-0">
          <Navigation />
        </footer>
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
      <header className="px-[21px] pt-4 pb-[20px]">
        <h1 className="text-[24px] font-medium text-[#0D1321]">Bookings</h1>
        <p className="text-[#666666] text-[14px]">
          Manage your Bookings here as a {user?.role?.toLowerCase() || "user"}
        </p>
      </header>

      {/* Filter buttons */}
      <div className="flex bg-white justify-around rounded-[5px] mx-4 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 rounded-[4px] h-[25px] w-[120px] text-[12px] font-medium ${
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
        {bookingsWithLowercaseStatus.length > 0 ? (
          bookingsWithLowercaseStatus.map((booking) => (
            <Bookings
              key={booking.id}
              booking={booking}
              status={booking.displayStatus}
              completedButtonText={
                booking.displayStatus === "completed"
                  ? booking.role === "guest"
                    ? "Rate your Stay"
                    : "Hold Security Deposit"
                  : undefined
              }
              // Pass the user prop
              user={user}
              // Pass the role to the Bookings component if needed
              role={booking.role}
              // Pass the showAlert function to Bookings component if it needs to show alerts
              onShowAlert={showAlert}
              // Add onClick handler
              onClick={() => handleBookingClick(booking)}
            />
          ))
        ) : (
          <div className="mt-[105px] flex flex-col items-center">
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

      <footer className="sticky bottom-0">
        <Navigation />
      </footer>
    </div>
  );
}
