import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess";

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    recent: [
      {
        id: 1,
        title: "Payment Confirmed!!",
        message: "Your guest, Tunde, has completed payment...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/money-2.svg",
          heading: "Payment Confirmed",
          message:
            "Your guest, Tunde, has completed payment for the 2-Bedroom Apartment. Review the details to prepare for their arrival.",
          buttonText: "See Dashboard",
        },
      },
      {
        id: 2,
        title: "Guest Checked Out",
        message: "Tunde has successfully checked out of your",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/stopwatch.svg",
          heading: "Guest Checked Out",
          message:
            "Tunde has successfully checked out of your 2-Bedroom Apartment. You can now prepare the space for your next guest.",
          buttonText: "See Dashboard",
        },
      },
      {
        id: 3,
        title: "Apartment Upload Successful!",
        message: "Your upload was successful. Your apartment is",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/success.svg",
          heading: "Apartment Upload Successful",
          message:
            " Your upload was successful. Your apartment is now visible to guests .",
          buttonText: "See Dashboard",
        },
      },
      {
        id: 4,
        title: "Apartment Upload Failed",
        message: "We were unable to upload your apartment. Ensure",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/cancel-2.svg",
          heading: "Apartment Upload Failed",
          message:
            "We were unable to upload your apartment. Please ensure all required fields are filled correctly and try again.",
          buttonText: "See Dashboard",
        },
      },
      {
        id: 5,
        title: "Verification Complete",
        message: "You can now list your apartment, manage bookin..",
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
        id: 6,
        title: "Verification Failed",
        message: "We couldn't verify your account. Please update yo..",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/rejected.svg",
          heading: "Verification Failed",
          message:
            "We couldn’t verify your account. Please update your details or upload clearer documents to proceed..",
        },
      },
      {
        id: 7,
        title: "Cancelled Booking!",
        message: "We've cancelled your booking for the 2-Bedroom",
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
    lastWeek: [
      {
        id: 8,
        title: "Popular Choice",
        message: "Guests are loving your 2-Bedroom Apartment. Ch...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/trending.svg",
          heading: "Popular Choice",
          message:
            "Guests are loving your 2-Bedroom Apartment. Check out the growing interest and potential bookings.",
          buttonText: "See Dashboard",
        },
      },
      {
        id: 9,
        title: "Wallet Credited",
        message: "Your wallet has been credited with N456,666...",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/money-2.svg",
          heading: "Wallet Credited",
          message:
            "Your wallet has been credited with ₦456,000 after 24 hours of non-issues. The amount is now available for withdrawal",
          buttonText: "See Revenue History",
          revenue: true,
        },
      },
      {
        id: 10,
        title: "Wallet Debited",
        message: "#456,000 has been deducted from your wallet fo",
        time: "12:30AM",
        read: false,
        popup: {
          image: "/icons/money-2.svg",
          heading: "Wallet Debited",
          message:
            "Your wallet has been credited with ₦456,000 after 24 hours of non-issues. The amount is now available for withdrawal.",
          buttonText: "See Revenue History",
          revenue: true,
        },
      },
    ],
  });

  const [activePopup, setActivePopup] = useState(null);

  const handleNotificationClick = (section, id) => {
    const n = notifications[section].find((item) => item.id === id);

    setNotifications((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    }));

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
        <h2 className="mt-4 mb-2 text-[14px] font-medium text-[#333333]">
          Recent
        </h2>
        <div className="space-y-[5px]">
          {notifications.recent.map((n) => renderNotification(n, "recent"))}
        </div>

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
          button={!!activePopup.buttonText}
          buttonText={activePopup.buttonText}
          onClose={() => setActivePopup(null)}
          onConfirm={() => {
            if (activePopup.booking) {
              navigate("/bookings");
            } else if (activePopup.revenue) {
              navigate("/revenue");
            } else {
              navigate("/host-dashboard");
            }
            setActivePopup(null);
          }}
          // 👇 height only when no buttonText
          height={activePopup.buttonText ? undefined : "233px"}
        />
      )}
    </div>
  );
}
