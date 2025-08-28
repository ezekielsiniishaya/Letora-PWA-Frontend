import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CancelBookingPopup from "../../components/dashboard/CancelBookingPopup";
import ConfirmCancelPopup from "../../components/dashboard/ConfirmCancelPopup";
import ShowSuccess from "../../components/ShowSuccess";

export default function BookingDetails() {
  const navigate = useNavigate();
  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

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

      <div className="w-full max-w-md space-y-2 px-[21px] ">
        {/* Header (image) with host avatar overlapping halfway */}
        <div className="relative overflow-visible">
          <div className="rounded-[5px] overflow-hidden h-[172px] relative">
            <img
              src="/images/apartment.png"
              alt="Apartment"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Host avatar placed so it sits half on the image and half on the next card */}
          <img
            src="/images/guest.jpg"
            alt="Host"
            className="absolute left-1 bottom-0 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10"
          />
        </div>

        {/* Info card (host name, apartment title, location, status, price) */}
        <div className="pt-[17px] pb-[15px] px-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-[12px] font-medium text-[#333333]">
                Paul Ayodamola
              </h2>

              <div className="flex items-center text-sm text-black font-medium mt-[6px]">
                {/* Custom tick icon */}
                <img
                  src="/icons/tick-black.svg"
                  alt="Verified"
                  className="w-4 h-4 mr-1"
                />
                <span>3-Bedroom Apartment</span>
              </div>

              {/* Location */}
              <p className="text-[12px] text-[#333333] mt-1">Maryland, Lagos</p>
            </div>

            {/* Ongoing status and price in same column */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] px-3 rounded-full bg-[#FFEFD7] text-[#FB9506] font-medium mb-[32px]">
                Ongoing
              </span>
              <p className="text-[14px] font-semibold">₦150,000/Night</p>
            </div>
          </div>
        </div>

        {/* Booking Details card */}
        <div className="bg-white rounded-[5px] h-[145px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking Date</span>
              <span>30-Nov-2025 | 10:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Check in</span>
              <span>30-Nov-2025</span>
            </div>
            <div className="flex justify-between">
              <span>Check out</span>
              <span>30-Dec-2025</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>30 Days</span>
            </div>
          </div>
        </div>
        {/* Payment Details card */}
        <div className="bg-white rounded-[5px] h-[145px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking fee paid</span>
              <span>N1,500,000</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span>N100,000</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span>N2,500</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount Paid</span>
              <span>N1,602,500</span>
            </div>
          </div>
        </div>

        {/* Host Details card */}
        <div className="bg-white rounded-[5px] h-[110px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <h3 className="font-medium mb-2">Host Details</h3>
            <div className="flex justify-between">
              <span>Phone Number</span>
              <span>09876543221</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Number</span>
              <span>09876543221</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel button card */}
      <div className="pt-[75px] pb-[42px]">
        <button
          onClick={() => setShowCancelBooking(true)}
          className="border border-[#E9E9E9] w-[334px] h-[57px] hover:bg-gray-300 bg-white text-[#686464] rounded-[10px] py-4 text-[16px] font-semibold"
        >
          Cancel Booking
        </button>
      </div>

      {/* Popup Modals */}
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
          onClose={() => {
            setShowCancelSuccess(false);
            navigate(-1); // Go back to previous page after success
          }}
          height="auto"
        />
      )}
    </div>
  );
}
