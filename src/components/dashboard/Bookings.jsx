// MyBooking.jsx
import { useState, useEffect, useCallback } from "react";
import CancelBookingPopup from "./CancelBookingPopup";
import ConfirmCancelPopup from "./ConfirmCancelPopup";
import ShowSuccess from "../ShowSuccess";
import RatingPopup from "./RatingPopup";
import Alert from "../../components/utils/Alerts.jsx";
import { useNavigate } from "react-router-dom";
import {
  createDepositHold,
  checkDepositHoldStatus,
  cancelBooking,
} from "../../services/userApi.js";
import { useUser } from "../../hooks/useUser.js";

export default function MyBooking({
  booking,
  status,
  completedButtonText = "Rate your Stay",
  onClick,
  onShowAlert,
  user, // This should be the current user object from useUser hook
}) {
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showHoldSuccess, setShowHoldSuccess] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [canHoldDeposit, setCanHoldDeposit] = useState(true);
  const [isCheckingHold, setIsCheckingHold] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "error",
    message: "",
  });

  const bookingId = booking?.id;

  // FIXED: Get current user ID and apartment host ID correctly
  const currentUserId = user?.id; // Current user's ID from useUser hook
  const apartmentHostId = booking?.apartment?.hostId; // Apartment owner's ID from booking data

  const navigate = useNavigate();
  const { refreshUser } = useUser();

  // Debug logging to check the values
  useEffect(() => {
    console.log("Current User ID:", currentUserId);
    console.log("Apartment Host ID:", apartmentHostId);
    console.log("Is Apartment Owner:", currentUserId === apartmentHostId);
  }, [currentUserId, apartmentHostId]);

  const statusMap = {
    ongoing: { label: "Ongoing", bg: "bg-[#FFEFD7]", text: "text-[#FB9506]" },
    completed: {
      label: "Completed",
      bg: "bg-[#D7FFEA]",
      text: "text-[#059669]",
    },
    cancelled: {
      label: "Under Dispute",
      bg: "bg-[#FFE2E2]",
      text: "text-[#E11D48]",
    },
  };

  const currentStatus = statusMap[status];

  // Show alert function
  const showAlert = (type, message, timeout = 5000) => {
    if (onShowAlert) {
      onShowAlert(type, message, timeout);
    } else {
      setAlert({ show: true, type, message });

      if (timeout > 0) {
        setTimeout(() => {
          setAlert((prev) => ({ ...prev, show: false }));
        }, timeout);
      }
    }
  };

  // Dismiss alert function
  const dismissAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  // Check if review exists when component mounts
  useEffect(() => {
    if (status === "completed" && completedButtonText === "Rate your Stay") {
      const hasReview = !!booking?.review || !!booking?.reviewId;
      setHasReviewed(hasReview);

      if (booking?.reviewId && !booking?.review) {
        setHasReviewed(true);
      }
    }
  }, [booking, status, completedButtonText]);

  // UPDATED: Cancellation function with custom alerts
  const handleCancelBooking = async (reasons) => {
    try {
      setIsCancelling(true);
      const response = await cancelBooking(bookingId, reasons.join(", "));

      if (response.success) {
        setShowCancelSuccess(true);
        // Optionally refresh parent component data
        await refreshUser();
        if (onClick) {
          onClick(); // Trigger parent refresh
        }
      } else {
        showAlert("error", response.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      showAlert("error", error.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const checkHoldStatus = useCallback(async () => {
    try {
      setIsCheckingHold(true);
      const response = await checkDepositHoldStatus(bookingId);

      if (response.success) {
        setCanHoldDeposit(response.data.canRequestHold);

        if (response.data.hasExistingHold) {
          setActionCompleted(true);
        }
      }
    } catch (error) {
      console.error("Error checking hold status:", error);
      setCanHoldDeposit(false);
      if (onShowAlert) {
        onShowAlert("error", "Failed to check deposit hold status");
      } else {
        setAlert({
          show: true,
          type: "error",
          message: "Failed to check deposit hold status",
        });
      }
    } finally {
      setIsCheckingHold(false);
    }
  }, [bookingId, onShowAlert]);

  // Check deposit hold status when component mounts
  useEffect(() => {
    if (
      status === "completed" &&
      completedButtonText === "Hold Security Deposit"
    ) {
      checkHoldStatus();
    }
  }, [bookingId, status, completedButtonText, checkHoldStatus]);

  // UPDATED: handleHoldDeposit with custom alerts
  const handleHoldDeposit = async () => {
    try {
      const response = await createDepositHold(bookingId);

      if (response.success) {
        setShowHoldSuccess(true);
        setCanHoldDeposit(false); // Disable button after successful hold
        setActionCompleted(true);
      } else {
        showAlert("error", response.message || "Failed to hold deposit");
      }
    } catch (error) {
      console.error("Error holding deposit:", error);
      showAlert("error", error.message || "Failed to hold deposit");
    }
  };

  // Helper functions to handle backend data structure
  const getPrimaryImage = (bookingData) => {
    if (!bookingData?.apartment?.images) return "/images/default-apartment.jpg";
    const primaryImage = bookingData.apartment.images.find(
      (img) => img.isPrimary
    );
    return (
      primaryImage?.url ||
      bookingData.apartment.images[0]?.url ||
      "/images/default-apartment.jpg"
    );
  };

  const getTitle = (bookingData) => {
    return bookingData?.apartment?.title || "Unknown Apartment";
  };

  const getLocation = (bookingData) => {
    const apartment = bookingData?.apartment;
    if (!apartment) return "Location not specified";
    if (apartment.town && apartment.state) {
      return `${apartment.town}, ${apartment.state}`;
    }
    return apartment.state || "Location not specified";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get button text based on review status
  const getCompletedButtonText = () => {
    if (completedButtonText === "Rate your Stay") {
      if (hasReviewed) return "Rate your Stay";
      return "Rate your Stay";
    }

    // For deposit hold button
    if (isCheckingHold) return "Checking...";
    if (actionCompleted) return "Deposit Held";
    if (!canHoldDeposit) return "Hold Expired";
    return completedButtonText;
  };

  // Get cancel button text with loading state
  const getCancelButtonText = () => {
    if (isCancelling) return "Cancelling...";
    return "Cancel Booking";
  };

  // UPDATED: Navigation handler with role-based redirection
  const handleNavigation = () => {
    if (onClick) {
      onClick(); // Use the passed onClick function
    } else {
      // Fallback to default navigation
      navigate(`/bookings/${bookingId}`, { state: { booking, status } });
    }
  };

  // UPDATED: Handle success popup close with role-based navigation
  const handleSuccessClose = () => {
    setShowCancelSuccess(false);

    // Determine user role and navigate accordingly
    const userRole = user?.role?.toLowerCase();

    if (userRole === "verified host" || userRole === "host") {
      navigate("/host-dashboard");
    } else {
      // Default to bookings page for guests and other roles
      navigate("/bookings");
    }
  };

  // Handle card click
  const handleCardClick = () => {
    if (status !== "ongoing") {
      handleNavigation();
    }
  };

  // Handle view booking button click
  const handleViewBookingClick = (e) => {
    e.stopPropagation();
    handleNavigation();
  };

  // Handle completed button click
  const handleCompletedButtonClick = (e) => {
    e.stopPropagation();

    if (completedButtonText === "Rate your Stay") {
      setShowRating(true);
    } else if (completedButtonText === "Hold Security Deposit") {
      if (hasReviewed || actionCompleted || !canHoldDeposit) return;
      handleHoldDeposit();
    }
  };

  // Handle hold success close
  const handleHoldSuccessClose = () => {
    setShowHoldSuccess(false);
    setActionCompleted(true);
  };

  // Handle rating popup close
  const handleRatingClose = () => {
    setShowRating(false);
    setHasReviewed(true); // Set review as submitted
    setActionCompleted(true);
    if (onClick) onClick(); // force parent reload of booking data
  };

  return (
    <div className="bg-white rounded-[5px] w-full h-[158px] pt-[10px] px-[10px] relative">
      {/* Alert Container - Only show if using local alerts */}
      {alert.show && !onShowAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert
            type={alert.type}
            message={alert.message}
            onDismiss={dismissAlert}
            timeout={5000}
          />
        </div>
      )}

      <div
        className={`flex gap-[6px] ${
          status !== "ongoing" ? "cursor-pointer" : ""
        }`}
        onClick={handleCardClick}
      >
        {/* Apartment Image */}
        <img
          src={getPrimaryImage(booking)}
          alt={getTitle(booking)}
          className="w-[105.32px] h-[86px] min-w-[105.32px] rounded-[2.3px] object-cover flex-shrink-0"
        />

        {/* Apartment Info */}
        <div className="mt-1 ml-1 text-[#333333] flex flex-col">
          {/* Title + Status */}
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-[12px] truncate w-[160px]">
              {getTitle(booking)}
            </h4>
            {status !== "cancelled" && currentStatus && (
              <span
                className={`text-[10px] px-2 py-0.5 font-medium rounded-full whitespace-nowrap ${currentStatus.bg} ${currentStatus.text}`}
              >
                {currentStatus.label}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-[2px] mb-[5px]">
            <img
              src="/icons/location.svg"
              alt="Location"
              className="w-[11px] h-[13px]"
            />
            <p className="text-[12px]">{getLocation(booking)}</p>
          </div>

          {/* Check-in / Check-out */}
          <div className="flex gap-[40px] mt-[0px] text-[12px] text-[#505050]">
            <div className="flex flex-col items-start">
              <span className="font-medium">Check-in</span>
              <span className="text-[#666666]">
                {formatDate(booking?.startDate)}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span>Check-out</span>
              <span className="text-[#666666]">
                {formatDate(booking?.endDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="absolute left-0 right-0 mt-[6px] border-t border-[#E6E6E6]"></div>

      {/* Buttons Section */}
      <div className="flex justify-center mt-4 space-x-2">
        {status === "ongoing" && (
          <div className="w-full flex justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmCancel(true);
              }}
              disabled={isCancelling}
              className={`border-[#A20BA2] border bg-white text-[#A20BA2] text-[12px] font-semibold w-[129px] h-[35px] rounded-[5px] ${
                isCancelling ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {getCancelButtonText()}
            </button>
            <button
              onClick={handleViewBookingClick}
              className="w-[129px] h-[35px] rounded-[5px] text-[12px] font-semibold flex items-center text-white justify-center bg-[#A20BA2]"
            >
              View Booking
            </button>
          </div>
        )}
        {status === "completed" && (
          <button
            onClick={handleCompletedButtonClick}
            disabled={
              completedButtonText === "Hold Security Deposit"
                ? hasReviewed ||
                  actionCompleted ||
                  !canHoldDeposit ||
                  isCheckingHold
                : hasReviewed // Only disable Rate your Stay if already reviewed
            }
            className={`w-[177px] h-[35px] rounded-[5px] text-[12px] font-medium ${
              (completedButtonText === "Hold Security Deposit" &&
                (hasReviewed || actionCompleted || !canHoldDeposit)) ||
              (completedButtonText === "Rate your Stay" && hasReviewed)
                ? "bg-[#FBD0FB] text-white cursor-not-allowed"
                : "bg-[#A20BA2] text-white"
            }`}
          >
            {getCompletedButtonText()}
          </button>
        )}
        {status === "cancelled" && (
          <button className="bg-[#FFF1F0] border border-[#F81A0C] text-[#F81A0C] w-[179px] h-[35px] rounded-[5px] text-[12px] font-semibold">
            Under Dispute
          </button>
        )}
      </div>

      {/* Cancel & Rating Popups */}
      {showConfirmCancel && (
        <ConfirmCancelPopup
          onClose={() => setShowConfirmCancel(false)}
          onConfirm={() => {
            setShowConfirmCancel(false);
            setShowCancelBooking(true);
          }}
        />
      )}

      {showCancelBooking && (
        <CancelBookingPopup
          onClose={() => setShowCancelBooking(false)}
          onSubmit={(reasons) => {
            handleCancelBooking(reasons);
            setShowCancelBooking(false);
          }}
          currentUserId={currentUserId}
          apartmentHostId={apartmentHostId}
        />
      )}

      {showCancelSuccess && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Booking Successfully Cancelled!"
          message="Your booking has been cancelled. If you're eligible for a refund, it will be processed within 7–10 business days."
          buttonText="Done"
          onClose={handleSuccessClose}
          height="auto"
        />
      )}

      {showRating && (
        <RatingPopup
          apartmentId={booking?.apartment?.id}
          bookingId={booking?.id}
          onClose={handleRatingClose}
          onShowAlert={showAlert}
        />
      )}

      {showHoldSuccess && (
        <ShowSuccess
          image="/icons/lock.png"
          heading="Security Deposit Held"
          message="Your request to withhold the guest's security deposit has been approved. This booking is now officially in dispute."
          buttonText="Done"
          width="w-[70px]"
          onClose={handleHoldSuccessClose}
          height="auto"
        />
      )}
    </div>
  );
}
