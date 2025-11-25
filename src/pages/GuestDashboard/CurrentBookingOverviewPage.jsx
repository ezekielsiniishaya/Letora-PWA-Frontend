import { useState, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../../contexts/BookingContext";
import { ApartmentListingContext } from "../../contexts/ApartmentListingContext";
import { UserContext } from "../../contexts/UserContext";
import Button from "../../components/Button";
import { createBooking, createPayment } from "../../services/userApi";
import Alert from "../../components/utils/Alerts";

export default function CurrentBookingOverviewPage() {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useContext(BookingContext);
  const { getApartmentById } = useContext(ApartmentListingContext);
  const { user, isAuthenticated } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState(null);
  const [host, setHost] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    type: "error",
    message: "",
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showTimeoutError, setShowTimeoutError] = useState(false);

  // Constants for fees
  const CONVENIENCE_FEE = 2500; // Fixed convenience fee

  // Enhanced error handler using Alert
  const handleError = (error, customMessage = null, options = {}) => {
    console.error("Booking Error:", error);

    let userFriendlyMessage = customMessage;

    if (!userFriendlyMessage) {
      // Check for network errors (no response from server)
      if (
        !error.response &&
        (error.message?.toLowerCase().includes("network") ||
          error.message?.toLowerCase().includes("internet") ||
          error.message?.toLowerCase().includes("failed to fetch") ||
          error.message?.toLowerCase().includes("network request failed") ||
          error.message?.toLowerCase().includes("axioserror") ||
          error.code === "NETWORK_ERROR" ||
          error.code === "ECONNABORTED" ||
          error.name === "TypeError") // This catches "Failed to fetch"
      ) {
        userFriendlyMessage =
          "Network issues. Get better reception and try again";
      }
      // Check if it's the specific backend error we're seeing
      else if (
        error.response?.data?.message === "Booking ID is required" ||
        error.message === "Booking ID is required"
      ) {
        userFriendlyMessage =
          "Booking information is incomplete. Please restart your booking process.";
      }
      // Check if error has response data with message from your backend format
      else if (error.response?.data?.message) {
        userFriendlyMessage = error.response.data.message;

        // Handle specific backend error codes
        if (error.response.data.code === "INTERNAL_ERROR") {
          userFriendlyMessage =
            "Server error. Please try again in a few moments.";
        } else if (error.response.data.code === "VALIDATION_ERROR") {
          userFriendlyMessage =
            "Please check your booking information and try again.";
        }
      }
      // Check for authentication errors
      else if (error.response?.status === 401) {
        userFriendlyMessage = "Session expired. Please log in again.";
      }
      // Check for server errors (5xx)
      else if (error.response?.status >= 500) {
        userFriendlyMessage =
          "Server error. Please try again in a few moments.";
      }
      // Check for client errors (4xx)
      else if (error.response?.status >= 400) {
        userFriendlyMessage =
          "Request error. Please check your information and try again.";
      }
      // Use the error message as fallback
      else {
        userFriendlyMessage =
          error.message || "An unexpected error occurred. Please try again.";
      }
    }

    // Determine alert type based on error
    let alertType = "error";
    if (userFriendlyMessage.toLowerCase().includes("network")) {
      alertType = "network";
    } else if (error.response?.status === 401) {
      alertType = "auth";
    }

    // Show alert
    setAlert({
      show: true,
      type: alertType,
      message: userFriendlyMessage,
    });

    // Auto-clear alert if specified
    if (options.autoClear !== false) {
      setTimeout(() => {
        setAlert({ show: false, type: "error", message: "" });
      }, 8000);
    }
  };

  // Helper to clear alert
  const clearAlert = () => {
    setAlert({ show: false, type: "error", message: "" });
  };

  // Calculate fees based on new requirements
  const calculateFees = useCallback(() => {
    if (!bookingData?.apartmentPrice || !bookingData?.duration) {
      return {
        baseAmount: 0,
        bookingFee: 0,
        convenienceFee: CONVENIENCE_FEE,
        securityDeposit: bookingData?.securityDeposit || 0,
        totalAmount: 0,
      };
    }

    const baseAmount = bookingData.apartmentPrice * bookingData.duration;
    const bookingFee = baseAmount;
    const convenienceFee = CONVENIENCE_FEE;
    const securityDeposit = bookingData.securityDeposit || 0;
    const totalAmount = bookingFee + convenienceFee + securityDeposit;

    return {
      baseAmount,
      bookingFee,
      convenienceFee,
      securityDeposit,
      totalAmount,
    };
  }, [
    bookingData?.apartmentPrice,
    bookingData?.duration,
    bookingData?.securityDeposit,
  ]);

  // Load booking data with better error handling
  useEffect(() => {
    let isMounted = true;

    // Save booking context to localStorage for persistence
    const saveBookingContext = () => {
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
      }
    };

    const fetchBookingData = async () => {
      try {
        if (!isMounted) return;

        clearAlert();

        // Check if we have the minimum required data
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

        // Calculate and update fees only if they haven't been set
        const fees = calculateFees();
        if (!bookingData.totalAmount || bookingData.totalAmount === 0) {
          updateBookingData({
            bookingFee: fees.bookingFee,
            convenienceFee: fees.convenienceFee,
            totalAmount: fees.totalAmount,
          });
        }

        // Save context for persistence
        saveBookingContext();
      } catch (err) {
        if (isMounted) {
          handleError(err, null, { autoClear: false });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Only run if we have apartmentId and duration, and we're still loading
    if (loading && bookingData?.apartmentId && bookingData?.duration > 0) {
      fetchBookingData();
    } else if (!bookingData?.apartmentId || bookingData?.duration <= 0) {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [
    loading,
    bookingData.apartmentId,
    bookingData?.duration,
    bookingData.totalAmount,
    getApartmentById,
    updateBookingData,
    user?.email,
    bookingData,
    calculateFees,
  ]);

  // Reset loading state when booking data becomes valid
  useEffect(() => {
    if (bookingData?.apartmentId && bookingData?.duration > 0 && loading) {
      // This will trigger the main useEffect
      return;
    }
  }, [bookingData?.apartmentId, bookingData?.duration, loading]);

  // Enhanced payment handler with better error handling
  const handlePayment = async () => {
    // Prevent multiple clicks
    if (processingPayment) {
      console.log("Payment already in progress, ignoring click");
      return;
    }

    let paymentTimeoutId;

    try {
      setProcessingPayment(true);
      clearAlert();
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

      const fees = calculateFees();
      if (!fees.totalAmount || fees.totalAmount <= 0) {
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
        totalPrice: fees.totalAmount,
        userEmail: user.email,
        duration: bookingData.duration,
      };

      console.log("Creating or resuming booking...");
      const bookingResponse = await createBooking(bookingPayload);

      if (!bookingResponse?.data?.id) {
        throw new Error("Failed to create booking: No booking ID received");
      }

      const bookingId = bookingResponse.data.id;

      console.log("Booking created with ID:", bookingId);

      // 2. Store booking ID in context
      updateBookingData({ bookingId });

      // 3. Create payment with enhanced error handling
      console.log("Creating payment for booking ID:", bookingId);

      if (!bookingId) {
        throw new Error("Booking ID is missing. Please try again.");
      }

      const paymentResponse = await createPayment(bookingId);

      console.log("Payment response:", paymentResponse);

      // Enhanced payment response validation
      if (paymentResponse?.status === false) {
        const errorMessage =
          paymentResponse.message || "Payment creation failed";

        // Check for specific backend error codes
        if (paymentResponse.code === "INTERNAL_ERROR") {
          throw new Error(
            "Payment service is temporarily unavailable. Please try again."
          );
        } else {
          throw new Error(errorMessage);
        }
      }

      // Check if we have valid payment data
      if (!paymentResponse?.data && !paymentResponse?.account_number) {
        throw new Error("Invalid payment response received from server.");
      }

      // Clear timeout on success
      clearTimeout(paymentTimeoutId);

      // 4. Handle successful payment response
      const paymentData = paymentResponse.data || paymentResponse;
      const paymentReference =
        paymentData.reference || paymentResponse.reference;

      if (!paymentReference) {
        throw new Error("No payment reference received from payment service");
      }

      // Update booking context with payment reference
      updateBookingData({
        bookingId,
        paymentReference,
      });

      // Enhanced payment data storage
      const enhancedPaymentData = {
        bookingId,
        amount: fees.totalAmount,
        apartmentTitle: getTitle(),
        apartmentId: bookingData.apartmentId,
        checkinDate: bookingData.checkinDate,
        checkoutDate: bookingData.checkoutDate,
        duration: bookingData.duration,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        timestamp: new Date().toISOString(),
        reference: paymentReference,
        account_number: paymentData.account_number,
        account_name: paymentData.account_name,
        bank: paymentData.bank,
        valid_till: paymentData.valid_till,
        ...paymentData,
      };

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
        // Don't throw here - we can still proceed to payment page
      }

      // Navigate to payment page
      navigate(`/booking-payment/${bookingId}`);
    } catch (error) {
      console.error("Payment flow failed:", error);

      if (paymentTimeoutId) {
        clearTimeout(paymentTimeoutId);
      }

      // Use the enhanced handleError function
      handleError(error, null, { autoClear: false });
    } finally {
      setProcessingPayment(false);
    }
  };
  // Helper functions
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
    } catch {
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

  if (alert.show && (!bookingData?.apartmentId || bookingData?.duration <= 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <img
            src="/icons/error.png"
            alt="Error"
            className="w-16 h-16 mx-auto mb-4 text-red-500"
          />
          <p className="text-gray-500 mb-2">Unable to load booking</p>
          <p className="text-gray-500 text-sm mb-4">{alert.message}</p>
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

  const fees = calculateFees();
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
        {/* Alert Display */}
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onDismiss={clearAlert}
            timeout={alert.type === "success" ? 5000 : 8000}
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
                      clearAlert();
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
            className="absolute left-1 -bottom-3 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10 object-cover border-2 border-white"
            onError={(e) => {
              e.target.src = "/images/profile-image.png";
            }}
          />
        </div>

        {/* Info card */}
        <div className="pt-[25px] pb-[15px] px-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-[12px] flex items-center justify-between font-medium text-[#333333]">
                <span>{getHostName()}</span>
                <span>{renderStarRating(apartmentRating)}</span>
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
                  <span className="truncate max-w-[]">{getTitle()}</span>
                </div>
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
                <span className="whitespace-nowrap font-medium ">
                  {formatDate(new Date().toISOString().split("T")[0])} |{" "}
                  {formatTime(new Date().toISOString())}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Check in</span>
              <span className="font-medium">
                {formatDate(bookingData.checkinDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check out</span>
              <span className="font-medium">
                {formatDate(bookingData.checkoutDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-medium">
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
              <span className="font-medium">
                {formatCurrency(fees.bookingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span className="font-medium">
                {formatCurrency(fees.securityDeposit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span className="font-medium">
                {formatCurrency(fees.convenienceFee)}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span className="font-medium">
                {formatCurrency(fees.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Make Payment Button */}
        <div className="pt-[50px]">
          <Button
            text={processingPayment ? "Processing..." : "Make Payment Now"}
            onClick={handlePayment}
            disabled={processingPayment || !isAuthenticated()}
            className="h-[57px] w-full disabled:opacity-50 disabled:cursor-not-allowed"
          />

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
