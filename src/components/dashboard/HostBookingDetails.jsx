import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getBookingById,
  createDepositHold,
  checkDepositHoldStatus,
} from "../../services/userApi";
import ShowSuccess from "../ShowSuccess";
import Button from "../Button";

export default function HostBookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [depositHeld, setDepositHeld] = useState(false);
  const [canHoldDeposit, setCanHoldDeposit] = useState(true);
  const [isCheckingHold, setIsCheckingHold] = useState(false);
  const [showHoldSuccess, setShowHoldSuccess] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user ID from location state
  const currentUserId = location.state?.currentUserId;
  // Check if current user owns the apartment
  const isOwner =
    currentUserId && booking?.apartment?.host?.id === currentUserId;

  // Fetch booking directly from backend
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getBookingById(id);

        if (response.success) {
          setBooking(response.data);
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
  }, [id]);

  // Check deposit hold status when booking is loaded
  useEffect(() => {
    const checkHoldStatus = async () => {
      if (!booking || !isOwner) return;

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
    };

    if (booking && getBookingStatus(booking) === "COMPLETED" && isOwner) {
      checkHoldStatus();
    }
  }, [booking, isOwner]);

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
    if (isCheckingHold) return "Please wait...";
    if (depositHeld) return "Hold Security Deposit";
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
      label: "Cancelled",
      bg: "bg-[#FFE2E2]",
      text: "text-[#E11D48]",
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

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "Not specified";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} night${diffDays !== 1 ? "s" : ""}`;
  };

  // Calculate payment breakdown
  const calculatePaymentBreakdown = (totalPrice) => {
    if (!totalPrice) {
      return {
        bookingFee: 0,
        securityDeposit: 0,
        convenienceFee: 0,
        subtotal: 0,
        total: 0,
      };
    }

    const bookingFee = totalPrice * 0.1;
    const securityDeposit = totalPrice * 0.2;
    const convenienceFee = totalPrice * 0.05;
    const subtotal = totalPrice - bookingFee - securityDeposit - convenienceFee;

    return {
      bookingFee,
      securityDeposit,
      convenienceFee,
      subtotal,
      total: totalPrice,
    };
  };

  const getBookingStatus = (bookingData) => {
    if (!bookingData?.status) return "ONGOING";
    return bookingData.status;
  };
  const currentStatus =
    statusMap[getBookingStatus(booking)] || statusMap.ONGOING;
  const paymentBreakdown = booking
    ? calculatePaymentBreakdown(booking.totalPrice)
    : null;

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

  // Only show Hold Security Deposit button if:
  // 1. Booking status is COMPLETED
  // 2. Current user owns the apartment
  const showHoldDepositButton =
    getBookingStatus(booking) === "COMPLETED" && isOwner;

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
            src={
              booking?.apartment?.host?.profilePic ||
              "/images/profile-image.png"
            }
            alt="Host"
            className="absolute left-1 bottom-0 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10 object-cover border-2 border-white"
          />
        </div>

        {/* Info card */}
        <div className="pt-[17px] pb-[15px] px-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-[12px] font-medium text-[#333333]">
                {booking?.apartment?.host?.firstName}{" "}
                {booking?.apartment?.host?.lastName}
              </h2>

              <div className="flex items-center text-sm text-black font-medium mt-[6px]">
                <img
                  src="/icons/tick-black.svg"
                  alt="Verified"
                  className="w-4 h-4 mr-1"
                />
                <span>{getTitle(booking)}</span>
              </div>

              <p className="text-[12px] text-[#333333] mt-1">
                {getLocation(booking)}
              </p>
            </div>

            {/* Status + Price */}
            <div className="flex flex-col items-end">
              <span
                className={`text-[10px] px-2 rounded-full font-medium mb-[32px] ${currentStatus.bg} ${currentStatus.text}`}
              >
                {currentStatus.label}
              </span>
              <p className="text-[14px] font-semibold">
                {formatCurrency(booking.totalPrice || 0)}
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
              <span>
                {calculateDuration(booking.startDate, booking.endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        {paymentBreakdown && (
          <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Booking fee paid</span>
                <span>{formatCurrency(paymentBreakdown.bookingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span>{formatCurrency(paymentBreakdown.securityDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Convenience Fee</span>
                <span>{formatCurrency(paymentBreakdown.convenienceFee)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Amount Paid</span>
                <span>{formatCurrency(paymentBreakdown.total)}</span>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <h3 className="font-medium mb-2">Your Guest Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Guest Name</span>
              <span>
                {booking?.guest?.firstName} {booking?.guest?.lastName}
              </span>
            </div>

            {/* First Phone Number */}
            <div className="flex justify-between">
              <span>Phone Number</span>
              <span>{booking?.guest?.phone || "Not provided"}</span>
            </div>

            {/* Second Phone Number - Only show if provided */}
            {booking?.guest?.phone2 && (
              <div className="flex justify-between">
                <span>Phone Number</span>
                <span>{booking?.guest?.phone2}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Email</span>
              <span>{booking?.guest?.email || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Cancelled extra details */}
        {getBookingStatus(booking) === "CANCELLED" && (
          <>
            <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
              <h3 className="font-medium mb-2">Cancellation Details</h3>
              <div className="flex justify-between">
                <span>Cancellation Date</span>
                <span>{formatDate(booking.updatedAt)}</span>
              </div>
            </div>

            <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
              <h3 className="font-medium mb-2">Cancellation Reasons</h3>
              <p className="text-sm break-words">
                {booking.cancellationReason || "No reason provided"}
              </p>
            </div>
          </>
        )}

        {/* Hold Security Deposit Button - Only show if user owns the apartment and booking is completed */}
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

        {/* Ownership Warning */}
        {getBookingStatus(booking) === "COMPLETED" && !isOwner && (
          <div className="pt-[40px] pb-[42px] text-center">
            <p className="text-[#666666] text-sm">
              You can only manage security deposits for your own properties
            </p>
          </div>
        )}
      </div>

      {/* Hold Success Popup */}
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
