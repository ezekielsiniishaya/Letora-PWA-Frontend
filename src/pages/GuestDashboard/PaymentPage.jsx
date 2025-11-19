import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import ShowSuccess from "../../components/ShowSuccess";
import { confirmPayment } from "../../services/userApi";
import { useUser } from "../../hooks/useUser";
export default function PaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(600);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTimeoutError, setShowTimeoutError] = useState(false);
  const [showPaymentFailed, setShowPaymentFailed] = useState(false);
  const { user, isHost } = useUser();

  const navigateToHomepage = () => {
    if (isHost && user?.isVerified) {
      navigate("/host-homepage");
    } else {
      navigate("/guest-homepage");
    }
  };

  const handleError = (error, customMessage = null) => {
    console.error("Payment Error:", error);

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

    setTimeout(() => {
      setError(null);
    }, 8000);
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setError(null);

        if (!id) {
          throw new Error("No booking ID provided");
        }

        const storedData = localStorage.getItem(`paymentData_${id}`);
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          if (!parsedData.amount || !parsedData.reference) {
            throw new Error("Invalid payment data. Please start over.");
          }

          setPaymentData(parsedData);
        } else {
          throw new Error("Payment details not found. Please start over.");
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [id]);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeoutError(true); // Only show modal, don't set error
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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

  const handleConfirmPayment = async () => {
    if (confirming || timeLeft === 0) {
      return; // Prevent any action if button should be disabled
    }

    if (!paymentData) {
      handleError(
        new Error("No payment data"),
        "Payment details are missing. Please restart your booking."
      );
      return;
    }

    try {
      setConfirming(true);
      setError(null);

      const reference = paymentData.reference;

      console.log(
        "Confirming payment for booking:",
        id,
        "reference:",
        reference
      );

      const confirmationResponse = await confirmPayment(id, reference);

      // Check the actual transaction status in the response
      const transactionStatus = confirmationResponse.data?.transaction?.status;
      const paymentStatus = confirmationResponse.data?.booking?.paymentStatus;

      console.log("Transaction status:", transactionStatus);
      console.log("Payment status:", paymentStatus);
      if (transactionStatus === "failed" || paymentStatus === "FAILED") {
        // Specific failed payment
        setShowPaymentFailed(true);
      } else if (
        transactionStatus !== "successful" &&
        paymentStatus !== "SUCCESSFUL"
      ) {
        // Unconfirmed payment (pending, etc.)
        setShowSuccess(true);
      }
      // Only redirect to success page if payment is actually successful
      if (
        transactionStatus === "successful" ||
        paymentStatus === "SUCCESSFUL"
      ) {
        // Payment confirmed successfully - redirect to success page
        console.log(
          "Payment confirmed successfully, redirecting to status page"
        );
        localStorage.removeItem(`paymentData_${id}`);
        navigate(`/booking-status/${id}`);
      } else {
        // Payment failed or not confirmed - show unconfirmed payment modal
        console.log("Payment not confirmed, showing unconfirmed modal");
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Payment confirmation failed:", error);

      // For any error, show the unconfirmed payment modal
      setShowSuccess(true);
    } finally {
      setConfirming(false);
    }
  };
  const handleSuccessClose = () => {
    setShowSuccess(false);
    // For unconfirmed payments, just close the modal - user stays on payment page
  };

  const handleTimeoutErrorClose = () => {
    setShowTimeoutError(false);
    navigate(-1); // Go back two steps to booking details page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2] mb-2"></div>
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  if (error && !showSuccess) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <img
            src="/icons/error.svg"
            alt="Error"
            className="w-16 h-16 mx-auto mb-4 text-red-500"
          />
          <p className="text-gray-500 mb-2">Unable to load payment details</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-[#A20BA2] text-white rounded hover:bg-[#8a1a8a]"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No payment data found</p>
          <button
            className="px-4 py-2 bg-[#A20BA2] text-white rounded hover:bg-[#8a1a8a]"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F9F9F9] flex flex-col items-center relative logo-bg"
      style={{
        backgroundImage: "url('/icons/logo-white.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "calc(100% + 10px) calc(100% - 20px)",
        backgroundSize: "320px",
      }}
    >
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between px-5 pt-4 pb-3">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-[16px] h-[16px] cursor-pointer"
          onClick={() => navigate(-1)}
        />

        {/* Timer */}
        <div className="flex items-center space-x-2 bg-[#FEDBD8] rounded-full px-2 py-1 shadow-sm">
          <img
            src="/icons/red-clock.png"
            alt="Timer"
            className="w-[13px] h-[14px]"
          />
          <span className="text-[#F81A0C] font-semibold text-[13px]">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full text-[#333333] max-w-md flex flex-col items-center text-center px-6">
        <img
          src="/icons/money.png"
          alt="Money"
          className="w-[74px] mt-[14px] h-[74px] mb-3"
        />
        <h2 className="text-[14px] font-semibold mb-3">Payment Details</h2>
        <p className="text-[12px] mb-[50px] max-w-[267px]">
          Make payment to the provided bank account to finalize your booking on
          Letora
        </p>

        {/* Payment Card */}
        <div className="bg-white rounded-[8px] w-full h-[228px] px-5 py-4 text-left text-[13px] text-[#333333] mb-[150px]">
          <div className="flex flex-col justify-between space-y-10">
            <div className="flex justify-between">
              <span>Account name</span>
              <span className="font-medium">
                {paymentData.accountName || paymentData.account_name || ""}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Bank Name</span>
              <span className="font-medium">
                {paymentData.bankName || paymentData.bank || ""}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Account number</span>
              <span className="font-medium">
                <span className="font-medium">
                  {paymentData.accountNumber ||
                    paymentData.account_number ||
                    ""}
                </span>
              </span>
            </div>

            <div className="flex justify-between">
              <span>Amount</span>
              <span className="font-semibold text-[#333333]">
                {formatCurrency(paymentData.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md w-full">
            <div className="flex items-center">
              <img
                src="/icons/error.svg"
                alt="Error"
                className="w-4 h-4 mr-2 text-red-500 flex-shrink-0"
              />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Info Note */}
        <p className="text-[11px] text-[#888888] mb-6 leading-snug max-w-[333px]">
          Account details are valid for{" "}
          <span
            className="font-semibold 
          text-[#666666]"
          >
            10 minutes only
          </span>
          . Do not save or reuse. Please Click on Proceed to confirm once
          payment is made..
        </p>

        {/* Proceed Button */}
        <Button
          text={confirming ? "Please wait..." : "Proceed"}
          onClick={handleConfirmPayment}
          disabled={confirming || timeLeft === 0}
          className={`w-full h-[48px] text-[14px] font-semibold ${
            confirming || timeLeft === 0
              ? "bg-gray-400 cursor-not-allowed opacity-50"
              : "bg-[#A20BA2] hover:bg-[#8a1a8a]"
          } text-white rounded-md`}
        />
      </div>

      {/* Unconfirmed Payment Modal */}
      {showSuccess && (
        <ShowSuccess
          heading="Unconfirmed Payment"
          message="Your payment couldn’t be confirmed at the moment. Please double-check your transaction or contact support."
          onClose={handleSuccessClose}
          image="/icons/error.png"
          imgHeight="h-auto"
          width="w-[56px]"
          noButton={true}
        />
      )}

      {/* Timeout Error Modal */}
      {showTimeoutError && (
        <ShowSuccess
          heading="Payment Session Expired"
          message="Your payment session has expired. Please start the payment process again to get new bank details."
          buttonText="Go Back"
          onClose={handleTimeoutErrorClose}
          onConfirm={handleTimeoutErrorClose}
          image="/icons/error.png"
          imgHeight="h-auto"
          width="w-[56px]"
          noButton={true}
        />
      )}
      {showPaymentFailed && (
        <ShowSuccess
          heading="Payment Failed"
          message="Your payment was unsuccessful. Please try again with a different payment method or contact your bank."
          buttonText="Try Again"
          onClose={navigateToHomepage}
          onConfirm={navigateToHomepage}
          image="/icons/error.png"
          imgHeight="h-auto"
          width="w-[56px]"
        />
      )}
    </div>
  );
}
