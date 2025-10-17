import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import ShowSuccess from "../../components/ShowSuccess";
import { getNotificationConfig } from "../utils/notificationConfig/index";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user, getUserNotifications, markAsRead } = useUser();

  const [notifications, setNotifications] = useState({
    recent: [],
    lastWeek: [],
  });
  const [activePopup, setActivePopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  // Get actual notifications from context and organize them
  useEffect(() => {
    const userNotifications = getUserNotifications();

    // Sort notifications by date (newest first)
    const sortedNotifications = [...userNotifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Categorize notifications by time
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent = sortedNotifications.filter(
      (n) => new Date(n.createdAt) >= oneWeekAgo
    );

    const lastWeek = sortedNotifications.filter(
      (n) => new Date(n.createdAt) < oneWeekAgo
    );

    setNotifications({
      recent,
      lastWeek,
    });
    setLoading(false);
  }, [getUserNotifications]);

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return date
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

const handleNotificationClick = async (section, notificationId, notification) => {
  // Don't do anything if already marking as read or if notification is already read
  if (markingRead || notification.isRead) {
    // Just show the popup for already read notifications without marking as read again
    const popupConfig = getNotificationConfig(notification, user?.role);
    setActivePopup(popupConfig);
    return;
  }

  try {
    setMarkingRead(true);

    // Mark as read in backend and update context
    const result = await markAsRead(notificationId);
    
    if (result.success) {
      // Update local state immediately for better UX
      setNotifications((prev) => ({
        ...prev,
        [section]: prev[section].map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item
        ),
      }));

      // Get notification config and show popup
      const popupConfig = getNotificationConfig(notification, user?.role);
      setActivePopup(popupConfig);
      
      console.log("Notification marked as read, showing popup:", popupConfig);
    } else {
      console.error("Failed to mark notification as read:", result.error);
      // Still show the popup even if marking read fails
      const popupConfig = getNotificationConfig(notification, user?.role);
      setActivePopup(popupConfig);
    }
  } catch (error) {
    console.error("Error handling notification click:", error);
    // Still show the popup even if there's an error
    const popupConfig = getNotificationConfig(notification, user?.role);
    setActivePopup(popupConfig);
  } finally {
    setMarkingRead(false);
  }
};

  const handlePopupAction = () => {
    if (!activePopup) return;

    // Handle different navigation based on button text and notification type
    switch (activePopup.buttonText) {
      case "See Dashboard":
        navigate(
          user?.role === "HOST" ? "/host-dashboard" : "/guest-dashboard"
        );
        break;
      case "See Bookings":
        navigate("/bookings");
        break;
      case "See Booking Details":
        navigate("/bookings");
        break;
      case "See Revenue History":
        navigate("/revenue");
        break;
      case "Check Availability":
        navigate("/apartments");
        break;
      case "Update Details":
        navigate("/profile");
        break;
      case "Try Again":
        navigate("/upload-apartment");
        break;
      case "View Offers":
        navigate("/promotions");
        break;
      case "Write Review":
        navigate("/reviews");
        break;
      case "Book Now":
        navigate("/apartments");
        break;
      case "Search Again":
        navigate("/search");
        break;
      case "See Requests":
        navigate("/availability-requests");
        break;
      case "See Details":
        navigate("/notifications");
        break;
      default:
        // Default navigation based on user role
        navigate(
          user?.role === "HOST" ? "/host-dashboard" : "/guest-dashboard"
        );
    }

    setActivePopup(null);
  };

  const handlePopupClose = () => {
    setActivePopup(null);
  };

  const renderNotification = (notification, section) => (
    <div
      key={notification.id}
      className={`flex bg-white h-[59px] rounded-[5px] px-2 items-start gap-2 py-3 cursor-pointer ${
        !notification.isRead ? "border-l-2 border-l-[#008751]" : ""
      } ${markingRead ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => handleNotificationClick(section, notification.id, notification)}
    >
      <img
        src="/icons/logo-small.svg"
        alt="icon"
        className="w-[33px] h-[33px]"
      />
      <div className="flex-1 relative">
        <h3
          className={`text-[12px] font-semibold ${
            notification.isRead ? "text-[#797777]" : "text-[#333333]"
          }`}
        >
          {notification.title}
        </h3>
        <p className="text-[12px] mt-1 text-[#686464] line-clamp-1">
          {notification.message}
        </p>
        <div className="absolute items-center right-0 top-0 text-[9px] text-[#333333] font-medium flex">
          {formatTime(notification.createdAt)}
          {!notification.isRead && (
            <div className="rounded-full ml-1 bg-[#008751] w-[5px] h-[5px]"></div>
          )}
        </div>
      </div>
      {markingRead && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#A20BA2]"></div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="w-full px-[21px] py-[20px]">
        <div className="flex items-center space-x-5">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-5 h-5 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <span className="font-medium text-[14px]">Notifications</span>
          <div className="absolute right-5 flex gap-3">
            <img
              src="/icons/bin.svg"
              alt="Delete all"
              className="w-5 h-5 cursor-pointer"
              title="Delete all notifications"
            />
          </div>
        </div>
                </div>

      {/* Content */}
      <div className="px-[21px]">
        {notifications.recent.length > 0 && (
          <>
            <h2 className="mt-4 mb-2 text-[14px] font-medium text-[#333333]">
              Recent
            </h2>
            <div className="space-y-[5px]">
              {notifications.recent.map((notification) =>
                renderNotification(notification, "recent")
              )}
            </div>
          </>
        )}

        {notifications.lastWeek.length > 0 && (
          <>
            <h2 className="mt-[29px] mb-2 text-[14px] font-medium text-[#333333]">
              Last Week
            </h2>
            <div className="space-y-[5px]">
              {notifications.lastWeek.map((notification) =>
                renderNotification(notification, "lastWeek")
              )}
            </div>
          </>
        )}

        {notifications.recent.length === 0 &&
          notifications.lastWeek.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20">
              <img
                src="/icons/empty-notifications.svg"
                alt="No notifications"
                className="w-24 h-24 mb-4 opacity-50"
              />
              <p className="text-[#797777] text-[14px]">No notifications yet</p>
              <p className="text-[#686464] text-[12px] mt-2">
                You'll see important updates here
              </p>
            </div>
          )}
      </div>

      {/* Success Popup */}
      {activePopup && (
        <ShowSuccess
          image={activePopup.image}
          heading={activePopup.heading}
          message={activePopup.message}
          button={!!activePopup.buttonText}
          buttonText={activePopup.buttonText || "Okay"}
          onClose={handlePopupClose}
          onConfirm={activePopup.buttonText ? handlePopupAction : undefined}
          height={activePopup.buttonText ? undefined : "233px"}
        />
      )}
    </div>
  );
}