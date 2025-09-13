import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess"; // assuming same folder

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    recent: [
      {
        id: 1,
        title: "Successful Booking!!!",
        message: "Well done, your stay at the Two-Bedroom Short-L...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/firework.svg",
          heading: "Successful Booking!!!",
          message:
            "Well done, your stay at the 2-Bedroom Short-Let Apartment is locked in. Check your booking details anytime in your dashboard.",
          buttonText: "See Booking Details",
          booking: true,
        },
      },
      {
        id: 2,
        title: "Payment Received!!!",
        message: "Your payment for the Two-Bedroom Short-let ap...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/money-2.svg",
          heading: "Payment Received",
          message:
            "Your payment for the 2-Bedroom Short-Let Apartment has been received. We’ve sent your booking details to the host.",
        },
      },
      {
        id: 3,
        title: "Verification Complete",
        message: "You can now list your apartment, manage bookin...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/correction.svg",
          heading: "Verification Complete",
          message:
            "You can now list your apartment, manage bookings, and start welcoming guests through Letora.",
        },
      },
      {
        id: 4,
        title: "Verification Failed",
        message: "We couldn’t verify your account. Please update yo...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/rejected.svg",
          heading: "Verification Failed",
          message:
            "You can now list your apartment, manage bookings, and start welcoming guests through Letora.",
        },
      },
    ],
    lastWeek: [
      {
        id: 5,
        title: "Check-out Reminder",
        message: "It’s check-out day. We hope you had a great stay...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/stopwatch.svg",
          heading: "Check-out Reminder",
          message:
            "You can now list your apartment, manage bookings, and start welcoming guests through Letora.",
        },
      },
      {
        id: 6,
        title: "Rate & Review",
        message: "How was your stay? Give a review of your stay",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/rating.svg",
          heading: "Rate & Review",
          message:
            "Share your thoughts on your recent stay so the host can improve and guests can make informed choices.",
        },
      },
      {
        id: 7,
        title: "Your booking has been cancelled",
        message: "We’ve cancelled your booking for the 2-bedroom...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/cancelled.svg",
          heading: "Cancelled Booking",
          message:
            "We’ve cancelled your booking for the 2-Bedroom Short-Let Apartment. Refunds will be issued as outlined in our Guest Refund Policy.",
        },
      },
    ],
  });

  const [activePopup, setActivePopup] = useState(null);

  const handleNotificationClick = (section, id) => {
    // Find the clicked notification
    const n = notifications[section].find((item) => item.id === id);

    // Mark it as read
    setNotifications((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    }));

    // Show popup
    setActivePopup(n.popup);
  };

  const renderNotification = (n, section) => (
    <div
      key={n.id}
      className="flex bg-white h-[59px] rounded-[5px] px-2 items-start gap-2 py-3 cursor-pointer"
      onClick={() => handleNotificationClick(section, n.id)}
    >
      <img
        src="/icons/logo-small.svg"
        alt="icon"
        className="w-[33px] h-[33px]"
      />
      <div className="flex-1 relative">
        <h3
          className={`text-[12px] font-semibold ${
            n.read ? "text-[#797777]" : "text-[#333333]"
          }`}
        >
          {n.title}
        </h3>
        <p className="text-[12px] mt-1 text-[#686464]">{n.message}</p>
        <div className="absolute items-center right-0 top-0 text-[9px] text-[#333333] font-medium flex">
          {n.time}
          {!n.read && (
            <div className="rounded-full ml-1 bg-[#008751] w-[5px] h-[5px]"></div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="w-full px-[21px] py-[11px]">
        <div className="flex items-center space-x-5">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-5 h-5 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <span className="font-medium text-[14px]">Notifications</span>
          <div className="absolute right-5">
            <img
              src="/icons/bin.svg"
              alt="Delete"
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-[21px]">
        {/* Recent */}
        <h2 className="mt-4 mb-2 text-[14px] font-medium text-[#333333]">
          Recent
        </h2>
        <div className="space-y-[5px]">
          {notifications.recent.map((n) => renderNotification(n, "recent"))}
        </div>

        {/* Last Week */}
        <h2 className="mt-[29px] mb-2 text-[14px] font-medium text-[#333333]">
          Last Week
        </h2>
        <div className="space-y-[5px]">
          {notifications.lastWeek.map((n) => renderNotification(n, "lastWeek"))}
        </div>
      </div>

      {/* Popup */}
      {activePopup && (
        <ShowSuccess
          image={activePopup.image}
          heading={activePopup.heading}
          message={activePopup.message}
          button={!!activePopup.booking}
          buttonText="See Booking Details"
          onClose={() => setActivePopup(null)}
          onConfirm={
            activePopup.booking
              ? () => {
                  navigate("/bookings");
                  setActivePopup(null);
                }
              : undefined
          }
          height={activePopup.booking ? undefined : "233px"} // 👈 only non-bookings fixed height
        />
      )}
    </div>
  );
}
