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
  user,
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

  // Error handling states
  const [holdCheckAttempts, setHoldCheckAttempts] = useState(0);
  const [maxHoldCheckAttempts] = useState(3);
  const [isBackendDown, setIsBackendDown] = useState(false);

  const bookingId = booking?.id;
  const currentUserId = user?.id;
  const apartmentHostId = booking?.apartment?.hostId;

  const navigate = useNavigate();
  const { refreshUser } = useUser();

  // Debug logging
  useEffect(() => {
    console.log("Current User ID:", currentUserId);
    console.log("Apartment Host ID:", apartmentHostId);
    console.log("Is Apartment Owner:", currentUserId === apartmentHostId);
  }, [currentUserId, apartmentHostId]);

  // Status mapping
  const statusMap = {
    ongoing: { label: "Ongoing", bg: "bg-[#FFEFD7]", text: "text-[#FB9506]" },
    completed: {
      label: "Completed",
      bg: "bg-[#D7FFEA]",
      text: "text-[#059669]",
    },
    cancelled: {
      label:
        booking?.cancellationDispute?.status === "RESOLVED"
          ? "Settled"
          : "Under Dispute",
      bg:
        booking?.cancellationDispute?.status === "RESOLVED"
          ? "bg-[#F5F5F5]"
          : "bg-[#FFE2E2]",
      text:
        booking?.cancellationDispute?.status === "RESOLVED"
          ? "text-[#666666]"
          : "text-[#E11D48]",
    },
  };

  const currentStatus = statusMap[status];

  // Alert functions
  // Show alert function - wrap in useCallback
  const showAlert = useCallback(
    (type, message, timeout = 5000) => {
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
    },
    [onShowAlert]
  ); // Add onShowAlert as dependency

  const dismissAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  // Check review status
  useEffect(() => {
    if (status === "completed" && completedButtonText === "Rate your Stay") {
      const hasReview = !!booking?.review || !!booking?.reviewId;
      setHasReviewed(hasReview);
      if (booking?.reviewId && !booking?.review) {
        setHasReviewed(true);
      }
    }
  }, [booking, status, completedButtonText]);

  // Cancellation function
  const handleCancelBooking = async (reasons) => {
    try {
      setIsCancelling(true);
      const response = await cancelBooking(bookingId, reasons.join(", "));

      if (response.success) {
        setShowCancelSuccess(true);
        await refreshUser();
        if (onClick) {
          onClick();
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

  // Check hold status with proper error handling
  const checkHoldStatus = useCallback(async () => {
    if (isBackendDown || holdCheckAttempts >= maxHoldCheckAttempts) {
      setIsCheckingHold(false);
      return;
    }

    try {
      setIsCheckingHold(true);
      const response = await checkDepositHoldStatus(bookingId);

      if (response.success) {
        setCanHoldDeposit(response.data.canRequestHold);
        setHoldCheckAttempts(0);
        setIsBackendDown(false);

        if (response.data.hasExistingHold) {
          setActionCompleted(true);
        }
      } else {
        console.error("Hold status check failed:", response.message);
        setCanHoldDeposit(false);
      }
    } catch (error) {
      console.error("Error checking hold status:", error);
      setHoldCheckAttempts((prev) => prev + 1);

      if (holdCheckAttempts + 1 >= maxHoldCheckAttempts) {
        setIsBackendDown(true);
        showAlert(
          "error",
          "Unable to check deposit status. Please try again later.",
          5000
        );
      }
      setCanHoldDeposit(false);
    } finally {
      setIsCheckingHold(false);
    }
  }, [
    bookingId,
    holdCheckAttempts,
    maxHoldCheckAttempts,
    isBackendDown,
    showAlert,
  ]);

  // Check deposit hold status on mount
  useEffect(() => {
    if (
      status === "completed" &&
      completedButtonText === "Hold Security Deposit" &&
      !isBackendDown &&
      holdCheckAttempts < maxHoldCheckAttempts
    ) {
      checkHoldStatus();
    }
  }, [
    bookingId,
    status,
    completedButtonText,
    checkHoldStatus,
    isBackendDown,
    holdCheckAttempts,
    maxHoldCheckAttempts,
  ]);

  // Handle deposit hold with error handling
  const handleHoldDeposit = async () => {
    if (
      hasReviewed ||
      actionCompleted ||
      !canHoldDeposit ||
      isCheckingHold ||
      isBackendDown
    ) {
      console.log("Button disabled due to:", {
        hasReviewed,
        actionCompleted,
        canHoldDeposit,
        isCheckingHold,
        isBackendDown,
      });
      return;
    }

    try {
      console.log("🔄 Starting deposit hold process for booking:", bookingId);
      setIsCheckingHold(true);

      const response = await createDepositHold(bookingId);

      if (response.success) {
        console.log("✅ Deposit hold successful");
        setShowHoldSuccess(true);
        setCanHoldDeposit(false);
        setActionCompleted(true);
        setIsBackendDown(false);

        await refreshUser();
        if (onClick) onClick();
      } else {
        console.log("❌ Deposit hold failed:", response.message);
        showAlert("error", response.message || "Failed to hold deposit");
      }
    } catch (error) {
      console.error("💥 Error holding deposit:", error);

      if (
        error.message?.includes("Network Error") ||
        error.message?.includes("Failed to fetch") ||
        error.code === "NETWORK_ERROR"
      ) {
        setIsBackendDown(true);
        showAlert(
          "error",
          "Network error. Please check your connection and try again.",
          5000
        );
      } else {
        showAlert("error", error.message || "Failed to hold deposit");
      }
    } finally {
      setIsCheckingHold(false);
    }
  };

  // Retry mechanism
  const handleRetryHoldCheck = () => {
    setHoldCheckAttempts(0);
    setIsBackendDown(false);
    checkHoldStatus();
  };

  // Button text helper
  const getCompletedButtonText = () => {
    if (completedButtonText === "Rate your Stay") {
      return "Rate your Stay";
    }

    if (isBackendDown) return "Retry Connection";
    if (isCheckingHold) return "Processing...";
    if (actionCompleted) return "Deposit Held";
    if (!canHoldDeposit) return "Hold Expired";
    return completedButtonText;
  };

  // Handle completed button click
  const handleCompletedButtonClick = (e) => {
    e.stopPropagation();

    if (completedButtonText === "Rate your Stay") {
      setShowRating(true);
    } else if (completedButtonText === "Hold Security Deposit") {
      if (isBackendDown) {
        handleRetryHoldCheck();
        return;
      }

      if (hasReviewed || actionCompleted || !canHoldDeposit || isCheckingHold) {
        console.log("Button disabled due to:", {
          hasReviewed,
          actionCompleted,
          canHoldDeposit,
          isCheckingHold,
          isBackendDown,
        });
        return;
      }

      handleHoldDeposit();
    }
  };

  // Get cancel button text
  const getCancelButtonText = () => {
    if (isCancelling) return "Cancelling...";
    return "Cancel Booking";
  };

  // Navigation
  const handleNavigation = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/bookings/${bookingId}`, { state: { booking, status } });
    }
  };

  const handleSuccessClose = () => {
    setShowCancelSuccess(false);
    const userRole = user?.role?.toLowerCase();
    if (userRole === "verified host" || userRole === "host") {
      navigate("/host-dashboard");
    } else {
      navigate("/bookings");
    }
  };

  const handleCardClick = () => {
    if (status !== "ongoing") {
      handleNavigation();
    }
  };

  const handleViewBookingClick = (e) => {
    e.stopPropagation();
    handleNavigation();
  };

  const handleHoldSuccessClose = () => {
    setShowHoldSuccess(false);
    setActionCompleted(true);
  };

  const handleRatingClose = () => {
    setShowRating(false);
    setHasReviewed(true);
    setActionCompleted(true);
    if (onClick) onClick();
  };

  // Helper functions
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

  return (
    <div className="bg-white rounded-[5px] w-full h-[158px] pt-[10px] px-[10px] relative">
      {/* Alert Container */}
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

          <div className="flex items-center gap-1 mt-[2px] mb-[5px]">
            <img
              src="/icons/location.svg"
              alt="Location"
              className="w-[11px] h-[13px]"
            />
            <p className="text-[12px]">{getLocation(booking)}</p>
          </div>

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
                  isCheckingHold ||
                  isBackendDown
                : hasReviewed
            }
            className={`w-[177px] h-[35px] rounded-[5px] text-[12px] font-medium ${
              (completedButtonText === "Hold Security Deposit" &&
                (hasReviewed ||
                  actionCompleted ||
                  !canHoldDeposit ||
                  isCheckingHold ||
                  isBackendDown)) ||
              (completedButtonText === "Rate your Stay" && hasReviewed)
                ? "bg-[#FBD0FB] text-white cursor-not-allowed"
                : "bg-[#A20BA2] text-white"
            }`}
          >
            {getCompletedButtonText()}
          </button>
        )}
        {status === "cancelled" && (
          <button
            className={`border w-[179px] h-[35px] rounded-[5px] text-[12px] font-semibold ${
              booking?.cancellationDispute?.status === "RESOLVED"
                ? "bg-[#E9E9E9] border-[#E9E9E9] text-[#666666]"
                : "bg-[#FFF1F0] border-[#F81A0C] text-[#F81A0C]"
            }`}
          >
            {booking?.cancellationDispute?.status === "RESOLVED"
              ? "Settled"
              : "Under Dispute"}
          </button>
        )}
      </div>

      {/* Popups */}
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
