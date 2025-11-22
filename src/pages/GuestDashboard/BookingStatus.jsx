import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookingContext } from "../../contexts/BookingContext";
import Button from "../../components/Button";
import { getBookingById, downloadReceipt } from "../../services/userApi"; // Import downloadReceipt

export default function BookingStatusPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearBookingData } = useContext(BookingContext);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("No booking ID provided");
        }

        // Fetch actual booking data from API
        const response = await getBookingById(id);

        if (response.success && response.data) {
          setBooking(response.data);
        } else {
          throw new Error(
            response.message || "Failed to fetch booking details"
          );
        }
      } catch (err) {
        console.error("Failed to fetch booking status:", err);
        setError(err.message || "Unable to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStatus();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount || 0);
    } catch {
      return "₦0";
    }
  };

  const copyBookingId = () => {
    if (booking?.id) {
      navigator.clipboard.writeText(booking.id);

      const toast = document.createElement("div");
      toast.innerHTML = `
      <div class="fixed top-4 right-4 bg-white text-green-500 border border-green-500 px-2 py-2 rounded-lg h-[30px] z-50 flex items-center space-x-2">
              <span>Booking ID copied!</span>
      </div>
    `;

      document.body.appendChild(toast);

      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!booking?.id) return;

    try {
      setDownloading(true);

      const result = await downloadReceipt(booking.id);

      if (result.success) {
        // Success handled in the downloadReceipt function
        console.log("Receipt downloaded successfully");
      } else {
        throw new Error(result.error || "Failed to download receipt");
      }
    } catch (error) {
      console.error("Receipt download error:", error);

      // Show error toast
      const toast = document.createElement("div");
      toast.innerHTML = `
        <div class="fixed top-4 right-4 bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg z-50 flex items-center space-x-2">
          <span>${error.message}</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    } finally {
      setDownloading(false);
    }
  };
  const handleFinish = () => {
    clearBookingData();
    navigate("/guest/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-5 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A20BA2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-5 py-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Booking
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Booking details not available"}
          </p>
          <div className="space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#A20BA2] text-white rounded hover:bg-[#8a1a8a]"
            >
              Try Again
            </button>
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get primary image or first image
  const getPrimaryImage = () => {
    const primaryImage = booking.apartment?.images?.find(
      (img) => img.isPrimary
    );
    return (
      primaryImage?.url ||
      booking.apartment?.images?.[0]?.url ||
      "/images/default-apartment.jpg"
    );
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-[#F9F9F9] text-center px-5 py-6">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-start mb-4">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-4 h-4 cursor-pointer z-50  hover:opacity-70"
          onClick={() => navigate("/bookings")}
        />
      </div>

      {/* Success Icon */}
      <img
        src="/icons/success.svg"
        alt="Success"
        className="w-[141px] mt-[35px] h-[75px] mb-2"
      />

      {/* Success Message */}
      <h2 className="text-[14px] font-semibold mb-2">Payment Successful!</h2>
      <p className="text-sm text-[#555] w-[267px] mb-7">
        Your stay at {booking.apartment?.title} is confirmed. A confirmation
        email has been sent to you.
      </p>
      <img
        src="/icons/payment.png"
        alt="success-icon2"
        className="absolute h-[315px] w-full top-0 left-0"
      />
      {/* Booking Summary */}
      <div className="bg-white w-full max-w-md rounded-xl text-left px-2 py-[10px] mb-4">
        <p className="text-[13px] font-medium mb-3 flex">
          <img
            src="/icons/booking-info.png"
            alt="doc"
            className="w-[12px] h-[15px] mr-2"
          />
          Booking Summary
        </p>
        <div className="flex items-center mb-1">
          <img
            src={getPrimaryImage()}
            alt={booking.apartment?.title}
            className="w-[97px] h-[60px] rounded-[2.3px] object-cover mr-2"
            onError={(e) => {
              e.target.src = "/images/default-apartment.jpg";
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold max-w-[200px] text-[#333] truncate mb-1">
              {booking.apartment?.apartmentType
                ?.toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
            <div className="flex space-x-1">
              <img
                src="/icons/location.svg"
                alt="Location"
                className="w-[11px] h-[14px] flex-shrink-0"
              />
              <span className="text-[13px] text-[#777] truncate">
                {booking.apartment?.town && booking.apartment?.state
                  ? `${booking.apartment.town}, ${booking.apartment.state}`
                  : booking.apartment?.state || "Location not specified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-xl text-left p-4 mb-6">
        <div className="text-[13px] text-[#333333] space-y-5">
          <div className="flex justify-between">
            <span>Check in</span>
            <span className="font-medium">{formatDate(booking.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Check out</span>
            <span className="font-medium">{formatDate(booking.endDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span>
              {booking.duration} Day{booking.duration !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total Amount</span>
            <span>{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Booking ID */}
      <div className="w-full max-w-md bg-[#E9E9E970] rounded-[40px] px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          {/* Left side - Booking ID label and value */}
          <div className="flex-1 min-w-0">
            <div className="text-[12px] ml-[-190px] text-[#000000] mb-1">
              Booking ID
            </div>
            <div className="text-[14px] font-medium text-[#000000] truncate">
              {booking.id}
            </div>
          </div>

          {/* Right side - Copy button */}
          <button
            onClick={copyBookingId}
            className="flex items-center space-x-1 bg-white px-3 py-2 rounded-[40px] text-[12px] hover:bg-gray-100 transition-colors flex-shrink-0 ml-3"
          >
            <img
              src="/icons/tabler_copy.png"
              alt="Copy"
              className="w-[17px] h-[17px]"
            />
            <span className="text-[13px]">Copy</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md pt-[70px] space-y-3">
        <Button
          text={downloading ? "Downloading..." : "Download Receipt"}
          onClick={handleDownloadReceipt}
          className="h-[60px] w-full"
          variant="outline"
          disabled={downloading} // Disable button while downloading
        />
      </div>
    </div>
  );
}
