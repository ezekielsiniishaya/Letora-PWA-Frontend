import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../../contexts/BookingContext";
import { ApartmentListingContext } from "../../contexts/ApartmentListingContext";
import { UserContext } from "../../contexts/UserContext";
import Button from "../../components/Button";
import { createBooking, createPayment } from "../../services/userApi";

export default function CurrentBookingOverviewPage() {
  const navigate = useNavigate();
  const { bookingData, getBookingSummary, updateBookingData } =
    useContext(BookingContext);
  const { getApartmentById } = useContext(ApartmentListingContext);
  const { user, isAuthenticated } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState(null);
  const [host, setHost] = useState(null);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showTimeoutError, setShowTimeoutError] = useState(false);

  // Enhanced error handler
  const handleError = (error, customMessage = null, options = {}) => {
    console.error("Booking Error:", error);

    let errorMessage = customMessage;

    if (!errorMessage) {
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }
    }

    setError(errorMessage);

    // Auto-clear error if specified
    if (options.autoClear !== false) {
      setTimeout(() => {
        setError(null);
      }, 8000);
    }
  };

  // Save booking context to localStorage for persistence
  const saveBookingContext = useCallback(() => {
    try {
      if (bookingData && bookingData.apartmentId) {
        const contextToSave = {
          ...bookingData,
          timestamp: new Date().toISOString(),
          userEmail: user?.email,
        };
        localStorage.setItem(
          "letora_booking_context",
          JSON.stringify(contextToSave)
        );
        console.log("Booking context saved successfully");
      }
    } catch (err) {
      console.error("Error saving booking context:", err);
      // Don't show error to user as this is background operation
    }
  }, [bookingData, user?.email]); // Add dependencies here

  // Load booking data with better error handling
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setError(null);

        if (!bookingData) {
          throw new Error("No booking data available");
        }

        if (!bookingData?.apartmentId || bookingData?.duration <= 0) {
          throw new Error(
            "Invalid booking data: missing apartment ID or duration"
          );
        }

        const apartmentData = getApartmentById(bookingData.apartmentId);

        if (!apartmentData) {
          throw new Error(
            `Apartment with ID ${bookingData.apartmentId} not found`
          );
        }

        console.log("Found apartment data:", apartmentData);
        setApartment(apartmentData);
        setHost(apartmentData.host);

        // Save context for persistence
        saveBookingContext();
      } catch (err) {
        handleError(err, null, { autoClear: false });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingData, getApartmentById, saveBookingContext]);
  // Enhanced payment handler with better error handling
  // Enhanced payment handler with better error handling
  const handlePayment = async () => {
    let paymentTimeoutId;

    try {
      setProcessingPayment(true);
      setError(null);
      setShowTimeoutError(false);

      // Validate prerequisites
      if (!isAuthenticated() || !user) {
        throw new Error("Please log in to make a payment");
      }

      if (
        !bookingData?.apartmentId ||
        !bookingData?.checkinDate ||
        !bookingData?.checkoutDate
      ) {
        throw new Error(
          "Incomplete booking data. Please restart your booking."
        );
      }

      if (bookingData.duration <= 0) {
        throw new Error("Invalid booking duration. Please check your dates.");
      }

      const bookingSummary = getBookingSummary();
      if (!bookingSummary.totalAmount || bookingSummary.totalAmount <= 0) {
        throw new Error("Invalid payment amount. Please restart your booking.");
      }

      // Set payment timeout (30 seconds)
      paymentTimeoutId = setTimeout(() => {
        if (processingPayment) {
          setShowTimeoutError(true);
          handleError(
            new Error("Payment timeout"),
            "Payment is taking longer than expected. Please check your connection and try again.",
            { autoClear: false }
          );
          setProcessingPayment(false);
        }
      }, 30000);

      // 1. Create or resume booking
      const bookingPayload = {
        apartmentId: bookingData.apartmentId,
        startDate: bookingData.checkinDate,
        endDate: bookingData.checkoutDate,
        totalPrice: bookingSummary.totalAmount,
        userEmail: user.email,
        duration: bookingData.duration,
      };

      console.log("Creating or resuming booking...");
      const bookingResponse = await createBooking(bookingPayload);

      if (!bookingResponse?.data?.id) {
        throw new Error("Failed to create booking: No booking ID received");
      }

      const bookingId = bookingResponse.data.id;
      const isResumed = bookingResponse.resumed;

      console.log(
        `Booking ${isResumed ? "resumed" : "created"} with ID:`,
        bookingId
      );

      // 2. Store booking ID in context
      updateBookingData({ bookingId });

      // 3. Create payment with user details
      const paymentResponse = await createPayment(
        bookingSummary.totalAmount,
        user.email,
        bookingId,
        `Booking for ${getTitle()}`,
        `${user.firstName} ${user.lastName}`,
        user.phone
      );

      // Clear timeout on success
      clearTimeout(paymentTimeoutId);

      // 4. Handle payment response
      const paymentData = paymentResponse?.data || paymentResponse;

      if (paymentData) {
        // ✅ CRITICAL FIX: Save the payment reference to context
        const paymentReference =
          paymentData.reference || paymentResponse.reference;

        // Update booking context with payment reference
        updateBookingData({
          bookingId,
          paymentReference, // Save reference to context
        });

        // Enhanced payment data storage with error handling
        const enhancedPaymentData = {
          bookingId,
          amount: bookingSummary.totalAmount,
          apartmentTitle: getTitle(),
          apartmentId: bookingData.apartmentId,
          checkinDate: bookingData.checkinDate,
          checkoutDate: bookingData.checkoutDate,
          duration: bookingData.duration,
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`,
          timestamp: new Date().toISOString(),
          reference: paymentReference, // Ensure reference is included
          ...paymentData,
        };

        // Debug log to verify the reference
        console.log("Payment reference saved:", {
          reference: paymentReference,
          bookingId: bookingId,
          fullPaymentData: enhancedPaymentData,
        });

        try {
          localStorage.setItem(
            `paymentData_${bookingId}`,
            JSON.stringify(enhancedPaymentData)
          );
          console.log(
            "Payment data saved successfully with reference:",
            paymentReference
          );
        } catch (storageError) {
          console.error("Failed to save payment data:", storageError);
          // Continue anyway as this is not critical
        }

        // Navigate to payment page
        navigate(`/booking-payment/${bookingId}`);
      } else {
        throw new Error("No payment data received from payment service");
      }
    } catch (error) {
      console.error("Payment flow failed:", error);

      // Clear timeout on error
      if (paymentTimeoutId) {
        clearTimeout(paymentTimeoutId);
      }

      let userFriendlyMessage = error.response?.data?.message || error.message;

      // Provide more specific messages for common errors
      if (
        error.message.includes("network") ||
        error.message.includes("Internet")
      ) {
        userFriendlyMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.response?.status === 401) {
        userFriendlyMessage = "Session expired. Please log in again.";
      } else if (error.response?.status >= 500) {
        userFriendlyMessage =
          "Server error. Please try again in a few moments.";
      }

      handleError(error, userFriendlyMessage, { autoClear: false });
    } finally {
      setProcessingPayment(false);
    }
  };
  // Helper functions with enhanced error handling
  const getPrimaryImage = () => {
    try {
      if (!apartment?.images || apartment.images.length === 0) {
        return "/images/default-apartment.jpg";
      }

      const primaryImage = apartment.images.find((img) => img.isPrimary);
      return (
        primaryImage?.url ||
        apartment.images[0]?.url ||
        "/images/default-apartment.jpg"
      );
    } catch (error) {
      console.error("Error getting primary image:", error);
      return "/images/default-apartment.jpg";
    }
  };

  const getTitle = () => {
    return apartment?.title || "Current Booking";
  };

  const getLocation = () => {
    try {
      if (!apartment) return "Location not specified";
      if (apartment.town && apartment.state) {
        return `${apartment.town}, ${apartment.state}`;
      }
      return apartment.state || "Location not specified";
    } catch (error) {
      console.error("Error getting location:", error);
      return "Location not specified";
    }
  };

  const getHostName = () => {
    try {
      if (!host) return "Host";
      return `${host.firstName || ""} ${host.lastName || ""}`.trim() || "Host";
    } catch (error) {
      console.error("Error getting host name:", error);
      return "Host";
    }
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
      const [year, month, day] = dateString.split("-").map(Number);

      if (!year || !month || !day) {
        return "Invalid date";
      }

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
    if (!amount || isNaN(amount)) return "₦0";
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return "₦0";
    }
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

  const renderStarRating = (rating = 0) => {
    return (
      <div className="flex space-x-1 flex-shrink-0">
        <img src="/icons/star-gray.svg" alt="Star" className="w-4 h-4" />
        <span className="text-[12px] text-[#666666]">
          {typeof rating === "number" ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  // Enhanced Error Alert component
  const ErrorAlert = ({ message, showLogin = false, onRetry = null }) => (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start">
        <img
          src="/icons/error.svg"
          alt="Error"
          className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
        />
        <span className="text-red-800 text-sm flex-1">{message}</span>
      </div>
      <div className="mt-2 flex space-x-2">
        {showLogin && (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 bg-[#A20BA2] text-white text-xs rounded hover:bg-[#8a1a8a]"
          >
            Log In
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => setError(null)}
          className="px-3 py-1 bg-transparent text-gray-600 text-xs rounded hover:bg-gray-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2] mb-2"></div>
        <p className="text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  // Check authentication before showing booking details
  if (!isAuthenticated() || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <img
            src="/icons/auth-required.svg"
            alt="Authentication Required"
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
          />
          <p className="text-gray-500 mb-2">Authentication Required</p>
          <p className="text-gray-500 text-sm mb-4">
            Please log in to view your booking details
          </p>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-[#A20BA2] text-white rounded hover:bg-[#8a1a8a]"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error && (!bookingData?.apartmentId || bookingData?.duration <= 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <img
            src="/icons/error.svg"
            alt="Error"
            className="w-16 h-16 mx-auto mb-4 text-red-500"
          />
          <p className="text-gray-500 mb-2">Unable to load booking</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-[#A20BA2] text-white rounded hover:bg-[#8a1a8a]"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData?.apartmentId || bookingData?.duration <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <img
            src="/icons/no-booking.svg"
            alt="No Booking"
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
          />
          <p className="text-gray-500 mb-2">No active booking found</p>
          <p className="text-gray-500 text-sm mb-4">
            Please start a new booking process
          </p>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-[#A20BA2] text-white rounded hover:bg-[#8a1a8a]"
              onClick={() => navigate("/apartments")}
            >
              Browse Apartments
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
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
            className="w-[16.67px] h-[8.33px] cursor-pointer hover:opacity-70"
            onClick={() => navigate(-1)}
          />
          <span className="text-[#333333] font-medium text-[13.2px]">
            Purchase Overview
          </span>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="w-full max-w-md space-y-4 px-[21px] pb-[75px]">
        {/* Error Display */}
        {error && (
          <ErrorAlert
            message={error}
            showLogin={!isAuthenticated()}
            onRetry={() => {
              setError(null);
              window.location.reload();
            }}
          />
        )}

        {/* Timeout Error Modal */}
        {showTimeoutError && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="text-center">
                <img
                  src="/icons/timeout.svg"
                  alt="Timeout"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Request Timeout</h3>
                <p className="text-gray-600 mb-4">
                  The payment request is taking longer than expected. This might
                  be due to network issues.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowTimeoutError(false);
                      handlePayment();
                    }}
                    className="w-full bg-[#A20BA2] text-white py-2 rounded hover:bg-[#8a1a8a]"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      setShowTimeoutError(false);
                      setError(null);
                    }}
                    className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of your JSX remains the same */}
        {/* ... existing JSX content ... */}

        {/* Header (image + host/guest avatar) */}
        <div className="relative overflow-visible">
          <div className="rounded-[5px] overflow-hidden h-[172px] relative">
            <img
              src={getPrimaryImage()}
              alt={getTitle()}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/default-apartment.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <img
            src={getHostProfilePicture()}
            alt={getHostName()}
            className="absolute left-1 bottom-0 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10 object-cover border-2 border-white"
            onError={(e) => {
              e.target.src = "/images/profile-image.png";
            }}
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
                  {formatDate(new Date().toISOString().split("T")[0])} |{" "}
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
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking Fee</span>
              <span>{formatCurrency(bookingSummary?.bookingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span>{formatCurrency(bookingSummary?.securityDeposit)}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span>{formatCurrency(bookingSummary?.convenienceFee)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>{formatCurrency(bookingSummary?.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Make Payment Button */}
        <div className="pt-[150px] pb-[42px]">
          <Button
            text={processingPayment ? "Processing..." : "Make Payment Now"}
            onClick={handlePayment}
            disabled={processingPayment || !isAuthenticated()}
            className="h-[57px] w-full disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {processingPayment && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Please wait while we process your payment...
            </p>
          )}
          {!isAuthenticated() && (
            <p className="text-center text-sm text-red-500 mt-2">
              Please log in to make a payment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
