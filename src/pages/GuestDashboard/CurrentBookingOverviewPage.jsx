import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../../contexts/BookingContext";
import { ApartmentListingContext } from "../../contexts/ApartmentListingContext";
import Button from "../../components/Button";

export default function CurrentBookingOverviewPage() {
  const navigate = useNavigate();
  const { bookingData, getBookingSummary } = useContext(BookingContext);
  const { getApartmentById } = useContext(ApartmentListingContext);

  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState(null);
  const [host, setHost] = useState(null);

  // Get apartment and host data from listing context
  useEffect(() => {
    if (bookingData?.apartmentId && bookingData?.duration > 0) {
      const apartmentData = getApartmentById(bookingData.apartmentId);

      if (apartmentData) {
        console.log("Found apartment data:", apartmentData);
        setApartment(apartmentData);
        setHost(apartmentData.host);
      } else {
        console.log("No apartment found for ID:", bookingData.apartmentId);
      }

      setLoading(false);
    } else {
      console.log("No valid booking data found:", bookingData);
      setLoading(false);
    }
  }, [bookingData, getApartmentById]);

  // Helper functions using actual apartment data
  const getPrimaryImage = () => {
    if (!apartment?.images || apartment.images.length === 0) {
      return "/images/default-apartment.jpg";
    }

    const primaryImage = apartment.images.find((img) => img.isPrimary);
    return (
      primaryImage?.url ||
      apartment.images[0]?.url ||
      "/images/default-apartment.jpg"
    );
  };

  const getTitle = () => {
    return apartment?.title || "Current Booking";
  };

  const getLocation = () => {
    if (!apartment) return "Location not specified";
    if (apartment.town && apartment.state) {
      return `${apartment.town}, ${apartment.state}`;
    }
    return apartment.state || "Location not specified";
  };

  const getHostName = () => {
    if (!host) return "Host";
    return `${host.firstName || ""} ${host.lastName || ""}`.trim() || "Host";
  };

  const getHostProfilePicture = () => {
    return host?.profilePic || "/images/profile-image.png";
  };

  const isApartmentVerified = () => {
    return apartment?.isVerified || false;
  };

  const getApartmentRating = () => {
    return apartment?.averageRating || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    try {
      // Direct string manipulation - no Date object to avoid timezone issues
      const [year, month, day] = dateString.split("-").map(Number);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return `${day}-${monthNames[month - 1]}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not set";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "0 days";
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return "0 days";

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "0 days";
    }
  };

  // Render single star with rating
  const renderStarRating = (rating = 0) => {
    return (
      <div className="flex  space-x-1 flex-shrink-0">
        <img src="/icons/star-gray.svg" alt="Star" className="w-4 h-4" />
        <span className="text-[12px] text-[#666666]">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  if (!bookingData?.apartmentId || bookingData?.duration <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-2">No active booking found</p>
        <p className="text-gray-500 text-sm mb-4">
          Please start a new booking process
        </p>
        <button
          className="mt-4 px-4 py-2 bg-[#A20BA2] text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const bookingSummary = getBookingSummary();
  const apartmentRating = getApartmentRating();
  const isVerified = isApartmentVerified();
  const pricePerNight = bookingData.apartmentPrice || 0;

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
            Purchase Overview
          </span>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="w-full max-w-md space-y-4 px-[21px] pb-[75px]">
        {/* Header (image + host/guest avatar) */}
        <div className="relative overflow-visible">
          <div className="rounded-[5px] overflow-hidden h-[172px] relative">
            <img
              src={getPrimaryImage()}
              alt={getTitle()}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <img
            src={getHostProfilePicture()}
            alt={getHostName()}
            className="absolute left-1 bottom-0 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10 object-cover border-2 border-white"
          />
        </div>

        {/* Info card */}
        <div className="pt-[10px] pb-[15px] px-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-[12px] font-medium text-[#333333]">
                {getHostName()}
              </h2>

              {/* Title and rating on same line with truncation */}
              <div className="flex items-center justify-between gap-2 text-sm text-black font-medium mt-[4px]">
                <div className="flex items-center min-w-0 flex-1">
                  {isVerified && (
                    <img
                      src="/icons/tick-black.svg"
                      alt="Verified"
                      className="w-4 h-4 mr-1 flex-shrink-0"
                    />
                  )}
                  <span className="truncate">{getTitle()}</span>
                </div>
                {/* Rating on the far right */}
                {renderStarRating(apartmentRating)}
              </div>

              {/* Location and price on same line */}
              <div className="flex items-center justify-between text-[12px] text-[#333333] mt-2">
                <span className="truncate flex-1 mr-2">{getLocation()}</span>
                <span className="text-[14px] font-semibold text-[#333333] whitespace-nowrap flex-shrink-0">
                  {formatCurrency(pricePerNight)}/Night
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking Date</span>
              <div className="text-right">
                <span className="whitespace-nowrap">
                  {formatDate(new Date().toISOString())} |{" "}
                  {formatTime(new Date().toISOString())}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Check in</span>
              <span>{formatDate(bookingData.checkinDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Check out</span>
              <span>{formatDate(bookingData.checkoutDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>
                {calculateDuration(
                  bookingData.checkinDate,
                  bookingData.checkoutDate
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-[5px]  py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking Fee</span>
              <span>{formatCurrency(bookingSummary.bookingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span>{formatCurrency(bookingSummary.securityDeposit)}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span>{formatCurrency(bookingSummary.convenienceFee)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>{formatCurrency(bookingSummary.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Make Payment Button */}
        <div className="pt-[150px] pb-[42px]">
          <Button
            text="Make Payment Now"
            onClick={() => {
              // Handle payment process
              console.log("Proceeding to payment...");
              // navigate('/payment', { state: { bookingData } });
            }}
            className="h-[57px] w-full"
          />
        </div>
      </div>
    </div>
  );
}
