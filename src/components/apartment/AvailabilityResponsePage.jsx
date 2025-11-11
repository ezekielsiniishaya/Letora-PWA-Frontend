import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ButtonWhite from "../../components/ButtonWhite";
import ShowSuccess from "../../components/ShowSuccess";
import Alert from "../../components/utils/Alerts";
import { respondToAvailability } from "../../services/userApi";

export default function ApartmentAvailability() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alert, setAlert] = useState(null);

  // Get notification from navigation state
  const notification = location.state?.notification;

  // Validate that we have the required notification data
  useEffect(() => {
    if (!notification) {
      setError("No notification data provided");
      return;
    }

    if (!notification.metadata) {
      setError("Invalid notification data");
      return;
    }

    const { guestName, apartmentTitle, availabilityRequestId } =
      notification.metadata;

    if (!guestName || !apartmentTitle || !availabilityRequestId) {
      setError("Missing required information in notification");
    }
  }, [notification]);

  const handleResponse = async (isAvailable) => {
    if (!notification?.metadata?.availabilityRequestId) {
      setAlert({
        type: "error",
        message: "Invalid availability request data",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAlert(null);

      const response = await respondToAvailability(
        notification.metadata.availabilityRequestId,
        isAvailable
      );

      if (response.success) {
        // Show success popup
        setShowSuccess(true);
      } else {
        // Handle case where API returns success: false
        setAlert({
          type: "error",
          message:
            response.message || "Failed to respond to availability request",
        });
      }
    } catch (error) {
      console.error("Error responding to availability request:", error);

      // The error response is in error.response.data (if using axios) or error.data
      const errorMessage =
        error.response?.data?.message ||
        error.data?.message ||
        error.message ||
        "Failed to respond to availability request";

      setAlert({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAvailable = () => handleResponse(true);
  const handleNotAvailable = () => handleResponse(false);

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Navigate back to notifications or previous page
    navigate(-1);
  };

  const handleAlertDismiss = () => {
    setAlert(null);
  };

  if (!notification) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center px-[22px]">
        <div className="text-center">
          <p className="text-[#686464] text-[16px] mb-4">
            {error || "No notification data found"}
          </p>
          <ButtonWhite
            text="Go Back"
            onClick={() => navigate(-1)}
            className="max-w-[200px]"
          />
        </div>
      </div>
    );
  }

  const { metadata } = notification;
  const { guestName, apartmentTitle, apartmentLocation } = metadata;

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center px-[22px]">
      {/* Header */}
      <div className="w-full max-w-md py-[20px] flex items-center space-x-2">
        <button onClick={() => navigate(-1)} disabled={loading}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <h1 className="font-medium text-[#333333] text-[14px]">
          Apartment Availability
        </h1>
      </div>

      {/* Alert Message */}
      {alert && (
        <div className="w-full max-w-md mb-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onDismiss={handleAlertDismiss}
            timeout={5000}
          />
        </div>
      )}

      {/* Guest Info */}
      <div className="w-full h-[122px] bg-white rounded-[10px] mt-2 px-[16px] py-[17px] flex flex-col items-center">
        <div className="w-[45px] h-[45px] rounded-[10px] border-[2.5px] border-[#F711F7] mb-2">
          <img
            src={metadata.guestProfilePicture || "/images/profile-image.png"}
            alt="Guest"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/images/profile-image.png";
            }}
          />
        </div>
        <p className="text-center text-[#39302A] text-[12px] leading-relaxed">
          {guestName || "Guest"} is interested in renting this shortlet space.
          Do confirm if this apartment is available or not.
        </p>
      </div>

      {/* Apartment Info */}
      <img
        src={metadata.apartmentImage || "/images/apartment.jpg"}
        alt={apartmentTitle}
        className="w-full h-[192px] rounded-[5.19px] mt-[29px] object-cover"
        onError={(e) => {
          e.target.src = "/images/apartment-placeholder.jpg";
        }}
      />
      <div className="p-[16px] text-center">
        <h2 className="font-semibold text-[16px] text-[#39302A]">
          {apartmentTitle}
        </h2>
        <p className="text-[#39302A] font-medium text-[14px] mt-[7px]">
          {apartmentLocation || "Location not specified"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md mt-[73px] flex flex-col space-y-[21px]">
        <ButtonWhite
          text={loading ? "Processing..." : "Not Available"}
          onClick={handleNotAvailable}
          disabled={loading}
        />
        <Button
          text={loading ? "Processing..." : "Yes it's Available"}
          onClick={handleAvailable}
          disabled={loading}
        />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#A20BA2]"></div>
            <span className="text-gray-700">Updating availability...</span>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/success.svg"
          heading="Response Sent"
          message=""
          button={true}
          buttonText="Back"
          onClose={handleSuccessClose}
          onConfirm={handleSuccessClose}
        />
      )}
    </div>
  );
}
