import { useState } from "react";
import CancelBookingPopup from "./CancelBookingPopup";
import ConfirmCancelPopup from "./ConfirmCancelPopup";
import ShowSuccess from "../ShowSuccess";
import { Link } from "react-router-dom";

export default function MyBooking({ lodge, status }) {
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  // Label + color based on status
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

  return (
    <div>
      <div className="bg-white rounded-[5px] w-full h-[158px] pt-[10px] px-[10px] relative">
        <div className="flex gap-[6px]">
          {/* Apartment Image */}
          <img
            src={lodge.image}
            alt={lodge.title}
            className="w-[105.32px] h-[86px] rounded-[2.3px] object-cover"
          />

          {/* Apartment Info */}
          <div className="flex-1 text-[#333333] flex flex-col">
            {/* Title + Status */}
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-[12px]">{lodge.title}</h4>

              {status !== "cancelled" && (
                <span
                  className={`text-[10px] px-2 font-medium rounded-full ${currentStatus.bg} ${currentStatus.text}`}
                >
                  {currentStatus.label}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-[5px] mb-[5px]">
              <img
                src="/icons/location.svg"
                alt="Location"
                className="w-[11px] h-[13px]"
              />
              <p className="text-[12px]">{lodge.location}</p>
            </div>

            {/* Check-in / Check-out */}
            <div className="flex gap-[40px] mt-[1px] text-[12px] text-[#505050]">
              <div className="flex flex-col items-start">
                <span className="font-medium">Check-in</span>
                <span className="text-[#666666]">30-Nov-2025</span>
              </div>
              <div className="flex flex-col items-start">
                <span>Check-out</span>
                <span className="text-[#666666]">30-Dec-2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute left-0 right-0 mt-1 border-t border-[#E6E6E6]"></div>

        {/* Buttons based on status */}
        <div className="flex justify-center mt-4 space-x-2">
          {status === "ongoing" && (
            <>
              <div className="w-full flex justify-between">
                <button className="border-[#A20BA2] border bg-white text-[#A20BA2] text-[12px] font-semibold w-[129px] h-[27px] rounded-[5px] ">
                  Cancel Booking
                </button>
                <Link
                  to="/booking-details"
                  className="w-[129px] h-[27px] rounded-[5px] text-[12px] font-semibold flex items-center text-white justify-center bg-[#A20BA2]"
                >
                  View Booking
                </Link>
              </div>
            </>
          )}

          {status === "completed" && (
            <button className="bg-[#A20BA2]  text-white w-[177px] h-[27px] rounded-[5px] text-[12px] font-medium">
              Rate your Stay
            </button>
          )}

          {status === "cancelled" && (
            <button className="bg-[#FFF1F0] border border-[#F81A0C] text-[#F81A0C] w-[177px] h-[27px] rounded-[5px] text-[12px] font-semibold">
              Cancelled & Refunded
            </button>
          )}
        </div>

        {/* Popups */}
        {showCancelBooking && (
          <CancelBookingPopup
            onClose={() => setShowCancelBooking(false)}
            onSubmit={(reasons) => {
              console.log("User reasons:", reasons);
              setShowCancelBooking(false);
              setShowConfirmCancel(true);
            }}
          />
        )}

        {showConfirmCancel && (
          <ConfirmCancelPopup
            onClose={() => setShowConfirmCancel(false)}
            onConfirm={() => {
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
      </div>
    </div>
  );
}
