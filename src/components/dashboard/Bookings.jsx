import { useState } from "react";
import CancelBookingPopup from "./CancelBookingPopup";
import ConfirmCancelPopup from "./ConfirmCancelPopup";
import ShowSuccess from "../ShowSuccess";
import { Link } from "react-router-dom";

export default function MyBooking({ lodge }) {
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  return (
    <div className="">
      {/* Booking Card */}
      <div className="bg-white rounded-[5px] w-full h-[158px] pt-[10px] px-[10px] relative">
        <div className="flex gap-4">
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
              <span className="text-[12px] font-medium bg-[#FFEFD7] text-[#FB9506] px-2 py-[2px] rounded-full">
                Ongoing
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center mt-[4px] mb-[7px] gap-1">
              <img
                src="/icons/location.svg"
                alt="Location"
                className="w-[11px] h-[13px]"
              />
              <p className="text-[12px]">{lodge.location}</p>
            </div>

            {/* Check-in / Check-out */}
            <div className="flex gap-[30px] mt-[1px] text-[12px] text-[#505050]">
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

        {/* Buttons */}
        <div className="flex justify-between mt-3">
          <button
            onClick={() => setShowCancelBooking(true)}
            className="border border-[#A20BA2] text-[#A20BA2] px-7 rounded-[5px] text-[12px] font-semibold"
          >
            Cancel Booking
          </button>
          <Link to="/booking-details">
            <button className="bg-[#A20BA2] text-white px-6 py-2 rounded-[5px] text-[12px] font-medium">
              View Booking
            </button>
          </Link>
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
