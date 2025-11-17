import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../services/userApi"; // Your API service
import CancelBookingPopup from "../dashboard/CancelBookingPopup";
import ConfirmCancelPopup from "../dashboard/ConfirmCancelPopup";
import ShowSuccess from "../ShowSuccess";
import RatingPopup from "../dashboard/RatingPopup";
import ButtonWhite from "../ButtonWhite";
import Button from "../Button";

export default function BookingDetails({ role = "guest" }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showRating, setShowRating] = useState(false);
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [depositHeld, setDepositHeld] = useState(false);
  const [showHoldSuccess, setShowHoldSuccess] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // Fallback to calculation if not provided
    if (!bookingData?.startDate || !bookingData?.endDate)
      return "Not specified";
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} night${diffDays !== 1 ? "s" : ""}`;
  };

  // Use actual payment data from backend instead of calculating
  const getPaymentBreakdown = (bookingData) => {
    if (!bookingData) {
      return {
        bookingFee: 0,
        securityDeposit: 0,
        convenienceFee: 0,
        subtotal: 0,
        total: 0,
      };
    }

    // Use actual values from backend
    return {
      bookingFee: parseFloat(bookingData.bookingFee) || 0,
      securityDeposit: parseFloat(bookingData.securityDeposit) || 0,
      convenienceFee: parseFloat(bookingData.convenienceFee) || 0,
      subtotal: parseFloat(bookingData.baseAmount) || 0,
      total: parseFloat(bookingData.totalPrice) || 0,
    };
  };

  // Determine display information based on role
  const getDisplayName = (bookingData) => {
    if (role === "host") {
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

  const getDisplayPhone = (bookingData) => {
    if (role === "host") {
      return bookingData?.guest?.phone || "Not provided";
    } else {
      return bookingData?.apartment?.host?.phone || "Not provided";
    }
  };

  const getDisplayEmail = (bookingData) => {
    if (role === "host") {
      return bookingData?.guest?.email || "Not provided";
    } else {
      return bookingData?.apartment?.host?.email || "Not provided";
    }
  };

  const getProfilePicture = (bookingData) => {
    if (role === "host") {
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

  // Determine which actions to show based on status and role
  const showCancelButton =
    ["ONGOING"].includes(getBookingStatus(booking)) && role === "guest";
  const showReviewButton =
    getBookingStatus(booking) === "COMPLETED" && role === "guest";
  const showHoldDepositButton =
    getBookingStatus(booking) === "COMPLETED" && role === "host";

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
        {/* Header (image + host/guest avatar) */}
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
            alt={role === "host" ? "Guest" : "Host"}
            className="absolute left-1 bottom-0 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10 object-cover border-2 border-white"
          />
        </div>

        {/* Info card */}
        <div className="pt-[17px] pb-[15px] px-2">
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
              <span>{formatDate(booking.createdAt)}</span>
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

        {/* Host/Guest Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <h3 className="font-medium mb-2">
            {role === "guest" ? "Your Host Details" : "Your Guest Details"}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{role === "guest" ? "Host Name" : "Guest Name"}</span>
              <span>{getDisplayName(booking)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Number</span>
              <span>{getDisplayPhone(booking)}</span>
            </div>
            {role === "host" && (
              <div className="flex justify-between">
                <span>Email</span>
                <span>{getDisplayEmail(booking)}</span>
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

        {/* Buttons Section */}
        {showCancelButton && (
          <div className="pt-[40px] pb-[42px]">
            <ButtonWhite
              text="Cancel Booking"
              onClick={() => setShowConfirmCancel(true)}
              className="w-full h-[57px]"
            />
          </div>
        )}

        {showReviewButton && (
          <div className="pt-[40px] pb-[42px]">
            <Button
              text="Drop your Review"
              onClick={(e) => {
                e.stopPropagation();
                setShowRating(true);
              }}
              className="h-[57px] w-full"
            />
          </div>
        )}

        {showHoldDepositButton && (
          <div className="pt-[40px] pb-[42px]">
            <Button
              text="Hold Security Deposit"
              icon="/icons/lock.svg"
              onClick={() => !depositHeld && setShowHoldSuccess(true)}
              className={`h-[57px] w-full ${
                depositHeld ? "bg-[#FBD0FB] cursor-not-allowed" : ""
              }`}
              disabled={depositHeld}
            />
          </div>
        )}
      </div>

      {/* Popup Modals */}
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
            console.log("User reasons:", reasons);
            setShowCancelBooking(false);
            setShowCancelSuccess(true);
          }}
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

      {showRating && (
        <RatingPopup
          apartmentId={booking.apartment?.id}
          onClose={() => setShowRating(false)}
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
            setDepositHeld(true);
          }}
          height="auto"
        />
      )}
    </div>
  );
}
