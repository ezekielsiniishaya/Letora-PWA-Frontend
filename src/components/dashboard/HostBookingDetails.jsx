import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBookingById,
  createDepositHold,
  checkDepositHoldStatus,
  cancelBooking,
} from "../../services/userApi";
import CancelBookingPopup from "../dashboard/CancelBookingPopup";
import ShowSuccess from "../ShowSuccess";
import Button from "../Button";
import { useUser } from "../../hooks/useUser.js";

export default function HostBookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser, refreshUser } = useUser();

  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [depositHeld, setDepositHeld] = useState(false);
  const [canHoldDeposit, setCanHoldDeposit] = useState(true);
  const [isCheckingHold, setIsCheckingHold] = useState(false);
  const [showHoldSuccess, setShowHoldSuccess] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if current user is host or guest
  const [actualRole, setActualRole] = useState("host");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getBookingById(id);

        if (response.success) {
          setBooking(response.data);

          // Determine role: check if current user is the apartment host
          const isHostBooking =
            response.data.apartment?.hostId === currentUser?.id;
          setActualRole(isHostBooking ? "host" : "guest");
        } else {
          setError(response.message || "Failed to fetch booking");
        }
      } catch (err) {
        setError(
          err.message || "An error occurred while fetching booking details"
        );
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    } else {
      setError("No booking ID provided");
      setLoading(false);
    }
  }, [id, currentUser?.id]);

  const handleCancelBooking = async (bookingId, reasons) => {
    try {
      const response = await cancelBooking(bookingId, reasons.join(", "));

      if (response.success) {
        setShowCancelSuccess(true);
        await refreshUser();

        // Refresh booking data to show cancelled status
        const updatedBooking = await getBookingById(bookingId);
        if (updatedBooking.success) {
          setBooking(updatedBooking.data);
        }
      } else {
        alert(response.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      alert(error.message || "Failed to cancel booking");
    }
  };

  // Check deposit hold status when booking is loaded and user is host
  const checkHoldStatus = useCallback(async () => {
    if (!booking || actualRole !== "host") return;

    try {
      setIsCheckingHold(true);
      const response = await checkDepositHoldStatus(booking.id);

      if (response.success) {
        setCanHoldDeposit(response.data.canRequestHold);
        if (response.data.hasExistingHold) {
          setDepositHeld(true);
        }
      } else {
        setCanHoldDeposit(false);
      }
    } catch (error) {
      console.error("Error checking hold status:", error);
      setCanHoldDeposit(false);
    } finally {
      setIsCheckingHold(false);
    }
  }, [booking, actualRole]);

  useEffect(() => {
    if (
      booking &&
      actualRole === "host" &&
      getBookingStatus(booking) === "COMPLETED"
    ) {
      checkHoldStatus();
    }
  }, [booking, actualRole, checkHoldStatus]);

  const handleHoldDeposit = async () => {
    if (depositHeld || !canHoldDeposit) return;

    try {
      const response = await createDepositHold(booking.id);

      if (response.success) {
        setShowHoldSuccess(true);
        setCanHoldDeposit(false);
        setDepositHeld(true);
      } else {
        alert(response.message || "Failed to hold deposit");
      }
    } catch (error) {
      console.error("Error holding deposit:", error);
      alert(error.message || "Failed to hold deposit");
    }
  };

  // Get button text for hold deposit
  const getHoldDepositButtonText = () => {
    if (isCheckingHold) return "Checking...";
    if (depositHeld) return "Deposit Held";
    if (!canHoldDeposit) return "Hold Expired";
    return "Hold Security Deposit";
  };

  // Status styles
  const statusMap = {
    ONGOING: { label: "Ongoing", bg: "bg-[#FFEFD7]", text: "text-[#FB9506]" },
    COMPLETED: {
      label: "Completed",
      bg: "bg-[#D7FFEA]",
      text: "text-[#059669]",
    },
    CANCELLED: {
      label:
        booking?.cancellationDispute?.status === "RESOLVED"
          ? "Settled"
          : "Cancelled",
      bg:
        booking?.cancellationDispute?.status === "RESOLVED"
          ? "bg-[#E9E9E9]"
          : "bg-[#FFE2E2]",
      text:
        booking?.cancellationDispute?.status === "RESOLVED"
          ? "text-[#666666]"
          : "text-[#E11D48]",
    },
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

  const formatDateTime = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const twelveHour = hours % 12 || 12;
    return `${day}-${month}-${year} | ${twelveHour}:${minutes} ${ampm}`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getDuration = (bookingData) => {
    if (bookingData?.duration) {
      return `${bookingData.duration} night${
        bookingData.duration !== 1 ? "s" : ""
      }`;
    }
    if (!bookingData?.startDate || !bookingData?.endDate)
      return "Not specified";
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} night${diffDays !== 1 ? "s" : ""}`;
  };

  // Correct payment breakdown using actual API fields
  const getPaymentBreakdown = (bookingData) => {
    if (!bookingData) {
      return {
        baseAmount: 0,
        bookingFee: 0,
        convenienceFee: 0,
        securityDeposit: 0,
        hostAmount: 0,
        total: 0,
      };
    }

    return {
      baseAmount: parseFloat(bookingData.baseAmount) || 0,
      bookingFee: parseFloat(bookingData.bookingFee) || 0,
      convenienceFee: parseFloat(bookingData.convenienceFee) || 0,
      securityDeposit: parseFloat(bookingData.securityDeposit) || 0,
      hostAmount: parseFloat(bookingData.hostAmount) || 0,
      total: parseFloat(bookingData.totalPrice) || 0,
    };
  };

  const getDisplayName = (bookingData) => {
    if (actualRole === "host") {
      return (
        `${bookingData?.guest?.firstName || ""} ${
          bookingData?.guest?.lastName || ""
        }`.trim() || "Guest"
      );
    } else {
      return (
        `${bookingData?.apartment?.host?.firstName || ""} ${
          bookingData?.apartment?.host?.lastName || ""
        }`.trim() || "Host"
      );
    }
  };

  const getProfilePicture = (bookingData) => {
    if (actualRole === "host") {
      return bookingData?.guest?.profilePic || "/images/profile-image.png";
    } else {
      return (
        bookingData?.apartment?.host?.profilePic || "/images/profile-image.png"
      );
    }
  };

  const getBookingStatus = (bookingData) => {
    if (!bookingData?.status) return "ONGOING";
    return bookingData.status;
  };

  const currentStatus =
    statusMap[getBookingStatus(booking)] || statusMap.ONGOING;
  const paymentBreakdown = booking ? getPaymentBreakdown(booking) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A20BA2] mb-4"></div>
        <p className="text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-2">{error || "Booking not found"}</p>
        <p className="text-gray-500 text-sm mb-4">Booking ID: {id}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#A20BA2] text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Button visibility logic for HOST perspective
  const showHoldDepositButton =
    getBookingStatus(booking) === "COMPLETED" && actualRole === "host";

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md px-[21px] pb-[24px] pt-[11px]">
        <div className="flex items-center space-x-[15px]">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-[16.67px] h-[8.33px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <span className="text-[#333333] font-medium text-[13.2px]">
            Booking Details
          </span>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="w-full max-w-md space-y-2 px-[21px] pb-[75px]">
        {/* Header (image + guest avatar) */}
        <div className="relative overflow-visible">
          <div className="rounded-[5px] overflow-hidden h-[172px] relative">
            <img
              src={getPrimaryImage(booking)}
              alt={getTitle(booking)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <img
            src={getProfilePicture(booking)}
            alt="Guest"
            className="absolute left-[5px] -bottom-3 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10 object-cover"
          />
        </div>

        {/* Info card */}
        <div className="pt-[37px] pb-[15px] px-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-[12px] font-medium text-[#333333]">
                {getDisplayName(booking)}
              </h2>

              <div className="flex items-center text-sm text-black font-medium mt-[6px]">
                <img
                  src="/icons/tick-black.svg"
                  alt="Verified"
                  className="w-4 h-4 mr-1"
                />
                <div className="truncate" style={{ maxWidth: "190px" }}>
                  <span>{getTitle(booking)}</span>
                </div>
              </div>

              <p className="text-[12px] text-[#333333] mt-1">
                {getLocation(booking)}
              </p>
            </div>

            {/* Status + Price Per Night */}
            <div className="flex flex-col items-end">
              <span
                className={`text-[10px] px-3 rounded-full font-medium mb-[32px] text-center h-[16px] ${currentStatus.bg} ${currentStatus.text}`}
              >
                {currentStatus.label}
              </span>
              <p className="text-[14px] font-semibold text-right">
                {formatCurrency(booking.apartment?.price || 0)}/Night
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking Date</span>
              <span>{formatDateTime(booking.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Check in</span>
              <span>{formatDate(booking.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Check out</span>
              <span>{formatDate(booking.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{getDuration(booking)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details - Corrected with actual API fields */}
        {paymentBreakdown && (
          <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Base Amount</span>
                <span>{formatCurrency(paymentBreakdown.baseAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Fee</span>
                <span>{formatCurrency(paymentBreakdown.bookingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span>{formatCurrency(paymentBreakdown.convenienceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span>{formatCurrency(paymentBreakdown.securityDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount Paid</span>
                <span>{formatCurrency(paymentBreakdown.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Guest Details - For Host View */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <h3 className="font-medium mb-2">Guest Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Name</span>
              <span>
                {booking?.guest?.firstName} {booking?.guest?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phone Number</span>
              <span>{booking?.guest?.phone || "Not provided"}</span>
            </div>
            {booking?.guest?.phone2 && (
              <div className="flex justify-between">
                <span>Phone Number</span>
                <span>{booking?.guest?.phone2}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cancelled extra details */}
        {getBookingStatus(booking) === "CANCELLED" && (
          <>
            <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
              <h3 className="font-medium mb-2">Cancellation Details</h3>
              <div className="flex justify-between">
                <span>Cancellation Date</span>
                <span>{formatDate(booking.cancelledAt)}</span>
              </div>
              {booking.cancelledBy && (
                <div className="flex justify-between">
                  <span>Cancelled By</span>
                  <span>{booking.cancelledBy}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
              <h3 className="font-medium mb-2">Cancellation Reasons</h3>
              <p className="text-sm break-words">
                {booking.cancellationReason || "No reason provided"}
              </p>
            </div>
          </>
        )}

        {/* Hold Security Deposit Button - Only for Host */}
        {showHoldDepositButton && (
          <div className="pt-[40px] pb-[42px]">
            <Button
              text={getHoldDepositButtonText()}
              icon="/icons/lock.svg"
              onClick={handleHoldDeposit}
              className={`h-[57px] w-full ${
                depositHeld || !canHoldDeposit
                  ? "bg-[#FBD0FB] cursor-not-allowed"
                  : ""
              }`}
              disabled={depositHeld || !canHoldDeposit || isCheckingHold}
            />
          </div>
        )}
      </div>

      {/* Popup Modals */}
      {showCancelBooking && (
        <CancelBookingPopup
          onClose={() => setShowCancelBooking(false)}
          onSubmit={(reasons) => {
            handleCancelBooking(booking.id, reasons);
          }}
          currentUserId={currentUser?.id}
          apartmentHostId={booking?.apartment?.hostId}
        />
      )}

      {showCancelSuccess && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Booking Successfully Cancelled!"
          message="Your booking has been cancelled. If you're eligible for a refund, it will be processed within 7–10 business days."
          buttonText="Done"
          onClose={() => {
            setShowCancelSuccess(false);
            navigate(-1);
          }}
          height="auto"
        />
      )}

      {showHoldSuccess && (
        <ShowSuccess
          image="/icons/lock2.svg"
          heading="Security Deposit Held"
          message="Your request to withhold the guest's security deposit has been approved. This booking is now officially in dispute."
          buttonText="Done"
          onClose={() => {
            setShowHoldSuccess(false);
          }}
          height="auto"
        />
      )}
    </div>
  );
}
