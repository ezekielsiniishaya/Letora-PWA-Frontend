import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CancelBookingPopup from "./CancelBookingPopup";
import ConfirmCancelPopup from "./ConfirmCancelPopup";
import ShowSuccess from "../ShowSuccess";
import RatingPopup from "./RatingPopup";

export default function MyBooking({
  booking,
  status,
  completedButtonText = "Rate your Stay",
}) {
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showHoldSuccess, setShowHoldSuccess] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);

  const navigate = useNavigate();

  const statusMap = {
    ongoing: { label: "Ongoing", bg: "bg-[#FFEFD7]", text: "text-[#FB9506]" },
    completed: {
      label: "Completed",
      bg: "bg-[#D7FFEA]",
      text: "text-[#059669]",
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-[#FFE2E2]",
      text: "text-[#E11D48]",
    },
  };

  const currentStatus = statusMap[status];

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
  // Get booking ID
  const bookingId = booking?.id;

  // Debug logging to see what data we're receiving
  console.log("Booking data:", booking);
  console.log("Apartment data:", booking?.apartment);
  console.log("Status:", status);

  return (
    <div className="bg-white rounded-[5px] w-full h-[158px] pt-[10px] px-[10px] relative">
      <div
        className={`flex gap-[6px] ${
          status !== "ongoing" ? "cursor-pointer" : ""
        }`}
        onClick={() =>
          status !== "ongoing"
            ? navigate(`/bookings/${bookingId}`, { state: { booking, status } })
            : null
        }
      >
        {/* Apartment Image */}
        <img
          src={getPrimaryImage(booking)}
          alt={getTitle(booking)}
          className="w-[105.32px] h-[86px] rounded-[2.3px] object-cover"
        />

        {/* Apartment Info */}
        <div className="flex-1  mt-1 ml-1 text-[#333333] flex flex-col">
          {/* Title + Status */}
          <div className="flex items-center gap-6">
            <h4 className="font-medium text-[12px] flex-1 truncate max-w-[calc(60%)]">
              {getTitle(booking)}
            </h4>
            {status !== "cancelled" && currentStatus && (
              <span
                className={`text-[10px] px-2 font-medium rounded-full ${currentStatus.bg} ${currentStatus.text}`}
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
              className="border-[#A20BA2] border bg-white text-[#A20BA2] text-[12px] font-semibold w-[129px] h-[35px] rounded-[5px]"
            >
              Cancel Booking
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/bookings/${bookingId}`, {
                  state: { booking, status },
                });
              }}
              className="w-[129px] h-[35px] rounded-[5px] text-[12px] font-semibold flex items-center text-white justify-center bg-[#A20BA2]"
            >
              View Booking
            </button>
          </div>
        )}

        {status === "completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (actionCompleted) return;

              if (completedButtonText === "Rate your Stay") {
                setShowRating(true);
              } else if (completedButtonText === "Hold Security Deposit") {
                setShowHoldSuccess(true);
              }
            }}
            disabled={actionCompleted}
            className={`w-[177px] h-[35px] rounded-[5px] text-[12px] font-medium ${
              actionCompleted
                ? "bg-[#FBD0FB] text-white cursor-not-allowed"
                : "bg-[#A20BA2] text-white"
            }`}
          >
            {completedButtonText}
          </button>
        )}

        {status === "cancelled" && (
          <button className="bg-[#FFF1F0] border border-[#F81A0C] text-[#F81A0C] w-[179px] h-[35px] rounded-[5px] text-[12px] font-semibold">
            Cancelled & Refunded
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
            console.log("User reasons:", reasons);
            setShowCancelBooking(false);
            setShowConfirmCancel(false);
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
          onClose={() => setShowCancelSuccess(false)}
          height="auto"
        />
      )}

      {showRating && (
        <RatingPopup
          onClose={() => {
            setShowRating(false);
            setActionCompleted(true);
          }}
        />
      )}

      {showHoldSuccess && (
        <ShowSuccess
          image="/icons/lock.png"
          heading="Security Deposit Held"
          message="Your request to withhold the guest's security deposit has been approved. This booking is now officially in dispute."
          buttonText="Done"
          width="w-[70px]"
          onClose={() => {
            setShowHoldSuccess(false);
            setActionCompleted(true);
          }}
          height="auto"
        />
      )}
    </div>
  );
}
