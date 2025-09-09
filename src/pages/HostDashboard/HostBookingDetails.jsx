import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CancelBookingPopup from "../../components/dashboard/CancelBookingPopup";
import ConfirmCancelPopup from "../../components/dashboard/ConfirmCancelPopup";
import ShowSuccess from "../../components/ShowSuccess";
import RatingPopup from "../../components/dashboard/RatingPopup";
import ButtonWhite from "../../components/ButtonWhite";
import Button from "../../components/Button";

export default function HostBookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [showRating, setShowRating] = useState(false);
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  // Lodges + status are passed from MyBookings via navigate(..., { state })
  const { lodge, status = "ongoing" } = location.state || {};

  if (!lodge) {
    // Case: user refreshed or typed URL directly
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500">Booking not found for ID: {id}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#A20BA2] text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Status styles
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
        {/* Header (image + host avatar) */}
        <div className="relative overflow-visible">
          <div className="rounded-[5px] overflow-hidden h-[172px] relative">
            <img
              src={lodge.image}
              alt={lodge.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <img
            src="/images/guest.jpg"
            alt="Host"
            className="absolute left-1 bottom-0 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10"
          />
        </div>

        {/* Info card */}
        <div className="pt-[17px] pb-[15px] px-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-[12px] font-medium text-[#333333]">
                Paul Ayodamola
              </h2>

              <div className="flex items-center text-sm text-black font-medium mt-[6px]">
                <img
                  src="/icons/tick-black.svg"
                  alt="Verified"
                  className="w-4 h-4 mr-1"
                />
                <span>{lodge.title}</span>
              </div>

              <p className="text-[12px] text-[#333333] mt-1">
                {lodge.location}
              </p>
            </div>

            {/* Status + Price */}
            <div className="flex flex-col items-end">
              <span
                className={`text-[10px] px-3 rounded-full font-medium mb-[32px] ${currentStatus.bg} ${currentStatus.text}`}
              >
                {currentStatus.label}
              </span>
              <p className="text-[14px] font-semibold">{lodge.price}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking Date</span>
              <span>{lodge.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Check in</span>
              <span>{lodge.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span>Check out</span>
              <span>{lodge.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{lodge.duration}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking fee paid</span>
              <span>{lodge.feePaid}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span>{lodge.deposit}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span>{lodge.convenience}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount Paid</span>
              <span>{lodge.total}</span>
            </div>
          </div>
        </div>

        {/* Host Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <h3 className="font-medium mb-2">Your Host Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Phone Number</span>
              <span>{lodge.hostPhone}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Number</span>
              <span>{lodge.hostPhone}</span>
            </div>
          </div>
        </div>

        {/* Cancelled extra details */}
        {status === "cancelled" && (
          <>
            <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
              <h3 className="font-medium mb-2">Cancellation Details</h3>
              <div className="flex justify-between">
                <span>Cancellation Date</span>
                <span>{lodge.cancellationDate}</span>
              </div>
            </div>

            <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
              <h3 className="font-medium mb-2">Cancellation Reasons</h3>
              <span>Guest Violated house rules</span>
              <p className="text-sm break-words">{lodge.cancellationReason}</p>
            </div>
          </>
        )}

        {/* Buttons Section */}
        {status === "ongoing" && (
          <div className="pt-[40px] pb-[42px]">
            <ButtonWhite
              text="Cancel Booking"
              onClick={() => setShowConfirmCancel(true)} // start with confirm
              className="w-full h-[57px]"
            />
          </div>
        )}

        {status === "completed" && (
          <div className="pt-[40px] pb-[42px]">
            <Button
              text="Drop your Review"
              onClick={(e) => {
                e.stopPropagation();
                setShowRating(true);
              }}
              className="h-[57px]"
            />
          </div>
        )}
      </div>

      {/* Cancelled → no button */}
      {/* Popup Modals */}
      {showConfirmCancel && (
        <ConfirmCancelPopup
          onClose={() => setShowConfirmCancel(false)}
          onConfirm={() => {
            setShowConfirmCancel(false);
            setShowCancelBooking(true); // open reasons popup next
          }}
        />
      )}

      {showCancelBooking && (
        <CancelBookingPopup
          onClose={() => setShowCancelBooking(false)}
          onSubmit={(reasons) => {
            console.log("User reasons:", reasons);
            setShowCancelBooking(false);
            setShowCancelSuccess(true); // finally show success
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

      {showRating && <RatingPopup onClose={() => setShowRating(false)} />}
    </div>
  );
}
