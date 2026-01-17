import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import ShowSuccess from "../../components/ShowSuccess";
import { getNotificationConfig } from "../utils/notificationConfig/index";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext";

export default function NotificationsPage() {
  const { setBackgroundColor } = useBackgroundColor();
  useEffect(() => {
    setBackgroundColor("#F9F9F9");

    if (window.Capacitor || window.capacitor) {
      StatusBar.setBackgroundColor({ color: "#F9F9F9" });
      StatusBar.setStyle({ style: Style.Light });
    }
  }, [setBackgroundColor]);

  const navigate = useNavigate();
  const { user, getUserNotifications, markAsRead, deleteReadNotifications } =
    useUser();

  const [notifications, setNotifications] = useState({
    recent: [],
    lastWeek: [],
  });
  const [activePopup, setActivePopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get actual notifications from context and organize them
  useEffect(() => {
    const userNotifications = getUserNotifications();

    // Sort notifications by date (newest first)
    const sortedNotifications = [...userNotifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    // Categorize notifications by time
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent = sortedNotifications.filter(
      (n) => new Date(n.createdAt) >= oneWeekAgo,
    );

    const lastWeek = sortedNotifications.filter(
      (n) => new Date(n.createdAt) < oneWeekAgo,
    );

    setNotifications({
      recent,
      lastWeek,
    });
    setLoading(false);
  }, [getUserNotifications]);

  // Check if there are any read notifications
  const hasReadNotifications = () => {
    const allNotifications = [
      ...notifications.recent,
      ...notifications.lastWeek,
    ];
    return allNotifications.some((notification) => notification.isRead);
  };

  // Handle delete all read notifications
  const handleDeleteReadNotifications = async () => {
    if (!hasReadNotifications()) {
      setActivePopup({
        image: "/icons/info.svg",
        heading: "No Read Notifications",
        message: "There are no read notifications to delete.",
        buttonText: "Okay",
      });
      return;
    }

    try {
      setDeleting(true);
      const result = await deleteReadNotifications();

      if (result.success) {
        // Update local state by removing all read notifications
        const filterUnreadNotifications = (notificationList) =>
          notificationList.filter((notification) => !notification.isRead);

        setNotifications({
          recent: filterUnreadNotifications(notifications.recent),
          lastWeek: filterUnreadNotifications(notifications.lastWeek),
        });

        setActivePopup({
          image: "/icons/success.svg",
          heading: "Success!",
          message: `Successfully deleted ${result.deletedCount} read notification(s)`,
          buttonText: "Okay",
        });
      } else {
        throw new Error(result.message || "Failed to delete notifications");
      }
    } catch (error) {
      console.error("Error deleting read notifications:", error);
      setActivePopup({
        image: "/icons/error.svg",
        heading: "Error",
        message:
          error.message ||
          "Failed to delete read notifications. Please try again.",
        buttonText: "Okay",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Show confirmation popup for deleting read notifications
  const showDeleteConfirmation = () => {
    if (!hasReadNotifications()) {
      setActivePopup({
        image: "/icons/info.svg",
        heading: "No Read Notifications",
        message: "There are no read notifications to delete.",
        buttonText: "Okay",
      });
      return;
    }

    const readCount = [
      ...notifications.recent,
      ...notifications.lastWeek,
    ].filter((n) => n.isRead).length;

    setActivePopup({
      image: "/icons/warning.svg",
      heading: "Delete Read Notifications?",
      message: `Are you sure you want to delete ${readCount} read notification(s)? This action cannot be undone.`,
      buttonText: "Delete",
      isDeleteConfirmation: true,
    });
  };

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

  const handleNotificationClick = async (
    section,
    notificationId,
    notification,
  ) => {
    // Check if this is an availability-related notification
    const isAvailabilityNotification =
      notification.type === "APARTMENT_AVAILABILITY" ||
      notification.type === "AVAILABILITY_REQUEST" || // Add this line
      notification.title?.toLowerCase().includes("availability request") ||
      notification.message?.toLowerCase().includes("availability request");

    // If it's an availability notification, navigate directly without popup
    if (isAvailabilityNotification) {
      // Mark as read first (if not already read)
      if (!notification.isRead) {
        try {
          setMarkingRead(true);
          await markAsRead(notificationId);
          // Update local state
          setNotifications((prev) => ({
            ...prev,
            [section]: prev[section].map((item) =>
              item.id === notificationId ? { ...item, isRead: true } : item,
            ),
          }));
        } catch (error) {
          console.error("Error marking notification as read:", error);
          // Still navigate even if marking read fails
        } finally {
          setMarkingRead(false);
        }
      }

      // Navigate to apartment availability page with the notification data
      navigate(`/apartment-availability`, {
        state: { notification }, // Pass the entire notification object
      });
      return; // Exit early - no popup will be shown
    }

    // Existing logic for other notification types (with popups)
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
            item.id === notificationId ? { ...item, isRead: true } : item,
          ),
        }));

        // Get notification config and show popup (for non-availability notifications)
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

    // Handle delete confirmation
    if (activePopup.isDeleteConfirmation) {
      handleDeleteReadNotifications();
      return;
    }

    // Handle "Okay" button after successful delete - just close popup
    if (
      activePopup.buttonText === "Okay" &&
      activePopup.heading === "Success!"
    ) {
      setActivePopup(null);
      return;
    }

    // Special handling for availability confirmation popup
    if (activePopup.booking && activePopup.apartmentId) {
      navigate(`/shortlet-overview/${activePopup.apartmentId}`);
      setActivePopup(null);
      return;
    }

    // Handle different navigation based on button text and notification type
    switch (activePopup.buttonText) {
      case "See Dashboard":
        navigate(
          user?.role === "HOST" && user?.hostVerification?.status === "VERIFIED"
            ? "/host-dashboard"
            : "/guest-homepage",
        );
        break;
      case "See Bookings":
        navigate(
          user?.role === "HOST" && user?.hostVerification?.status === "VERIFIED"
            ? "/host-dashboard"
            : "/bookings",
        );
        break;
      case "See Booking Details":
        // UPDATED: Navigate to specific booking details page
        if (activePopup.bookingId) {
          navigate(`/bookings/${activePopup.bookingId}`);
        } else if (
          activePopup.relatedId &&
          activePopup.relatedType === "BOOKING"
        ) {
          navigate(`/bookings/${activePopup.relatedId}`);
        } else {
          navigate("/bookings");
        }
        break;
      case "See Revenue History":
        navigate("/revenue");
        break;
      case "Check Availability":
        navigate("/apartment-availability");
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
      case "Browse Around":
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
      case "View Details":
        // UPDATED: Enhanced navigation for deposit hold and booking details
        if (activePopup.bookingId) {
          // Navigate to specific booking details
          navigate(`/bookings/${activePopup.bookingId}`);
        } else if (activePopup.apartmentId && activePopup.booking) {
          // Navigate to apartment-specific bookings
          navigate(`/apartments/${activePopup.apartmentId}/bookings`);
        } else if (
          activePopup.relatedType === "BOOKING" &&
          activePopup.relatedId
        ) {
          // Use related booking ID
          navigate(`/bookings/${activePopup.relatedId}`);
        } else {
          navigate("/bookings");
        }
        break;
      default:
        // For "Okay" buttons and any other cases, just close the popup
        setActivePopup(null);
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
        !notification.isRead ? "" : ""
      } ${markingRead ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() =>
        handleNotificationClick(section, notification.id, notification)
      }
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
          <div className="absolute right-5">
            <img
              src="/icons/bin.svg"
              alt="Delete read notifications"
              className={`w-5 h-5 ${
                !hasReadNotifications()
                  ? "opacity-40 cursor-not-allowed"
                  : deleting
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:opacity-70"
              }`}
              title={
                !hasReadNotifications()
                  ? "No read notifications to delete"
                  : deleting
                    ? "Deleting..."
                    : "Delete read notifications"
              }
              onClick={showDeleteConfirmation}
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
                renderNotification(notification, "recent"),
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
                renderNotification(notification, "lastWeek"),
              )}
            </div>
          </>
        )}

        {notifications.recent.length === 0 &&
          notifications.lastWeek.length === 0 && (
            <div className="flex flex-col mt-80 items-center justify-center">
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
          imgHeight={activePopup.imgHeight}
          width={activePopup.width}
          // Add danger style for delete confirmation
          buttonStyle={activePopup.isDeleteConfirmation ? "danger" : "primary"}
        />
      )}
    </div>
  );
}
