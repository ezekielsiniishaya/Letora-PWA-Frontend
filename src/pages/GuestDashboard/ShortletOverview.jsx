// pages/guest/ShortletOverviewPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApartmentDisplay } from "../../components/apartment/ApartmentDisplay";
import { getApartmentById } from "../../services/apartmentApi";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import ButtonWhite from "../../components/ButtonWhite";
import { requestAvailability } from "../../services/userApi";
import { useUser } from "../../hooks/useUser";
import { useBooking } from "../../hooks/useBooking";
import Alert from "../../components/utils/Alerts";
import ShowSuccess from "../../components/ShowSuccess";

export default function ShortletOverviewPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "error",
    message: "",
  });
  const { user } = useUser();
  const { setApartmentDetails, clearBookingData } = useBooking();

  // Show alert function
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, type: "error", message: "" });
    }, 5000);
  };

  useEffect(() => {
    clearBookingData();
    if (apartment && apartment.id) {
      setApartmentDetails(
        apartment.id,
        apartment.pricing?.pricePerNight || apartment.price,
        apartment.securityDeposit?.amount || 0
      );
    }
  }, [apartment, clearBookingData, setApartmentDetails]);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        const res = await getApartmentById(id);

        console.log("API Response:", res);

        if (res && res.data) {
          const transformedApartment = transformApartmentData(res.data);
          setApartment(transformedApartment);
          setHost(res.data.host);
        } else {
          console.log("No apartment data received");
          showAlert("error", "Failed to load apartment details");
        }
      } catch (error) {
        console.error("Failed to load apartment:", error);
        showAlert("error", "Failed to load apartment details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApartment();
    } else {
      console.error("No apartment ID provided");
      showAlert("error", "No apartment ID provided");
      setLoading(false);
    }
  }, [id]);

  // Transform API data to match ApartmentDisplay component structure
  const transformApartmentData = (apiData) => {
    return {
      basicInfo: {
        title: apiData.title,
        apartmentType: apiData.apartmentType,
        state: apiData.state,
        town: apiData.town,
      },
      totalLikes: apiData.totalLikes || 0,
      details: {
        bedrooms: apiData.details?.bedrooms,
        bathrooms: apiData.details?.bathrooms,
        electricity: apiData.details?.electricity,
        guestNumber: apiData.details?.guestNumber,
        parkingSpace: apiData.details?.parkingSpace,
        kitchenSize: apiData.details?.kitchenSize,
        description: apiData.details?.description,
      },
      facilities:
        apiData.facilities?.map((facility) => ({
          value: facility.name,
        })) || [],
      houseRules:
        apiData.houseRules?.map((rule) => ({
          value: rule.rule,
        })) || [],
      images: apiData.images || [],
      pricing: {
        pricePerNight: apiData.price,
      },
      securityDeposit: apiData.securityDeposit,
      legalDocuments: {
        documents: apiData.documents || [],
      },
      status: apiData.status,
      isListed: apiData.isListed,
      isAvailable: apiData.isAvailable,
    };
  };

  // Updated: Check guest verification status based on new backend data structure
  const checkGuestStatus = () => {
    if (!user) {
      return {
        status: "NO_USER",
        message: "Please log in to book an apartment",
        action: () => navigate("/login"),
      };
    }

    console.log("User data for verification:", {
      verificationStatus: user.verificationStatus,
      guestDocumentStatus: user.guestDocumentStatus,
      documents: user.documents,
      guestVerification: user.guestVerification,
    });

    // First check the guestVerification object - this is the main authority
    if (user.guestVerification) {
      if (user.guestVerification.canBook) {
        // User can book according to guestVerification
        return {
          status: "VERIFIED",
          message: "",
          action: () => navigate(`/booking-dates/${id}`),
        };
      } else {
        // Check why canBook is false
        if (user.guestVerification.status !== "VERIFIED") {
          return {
            status: "GUEST_VERIFICATION_PENDING",
            message: "Your guest verification is pending approval",
            action: null,
          };
        }

        // If status is VERIFIED but canBook is false, check documents
        if (!user.guestVerification.hasRequiredDocuments) {
          return {
            status: "DOCUMENTS_REQUIRED",
            message: "Please upload your ID documents to book an apartment",
            action: () => navigate("/id-check"),
          };
        }
      }
    }

    // Fallback checks if guestVerification is not available
    // Check user verification status
    if (user.verificationStatus !== "VERIFIED") {
      return {
        status: "USER_NOT_VERIFIED",
        message: "Your account needs to be verified to book an apartment",
        action: () => navigate("/profile"),
      };
    }

    // Check guest document status
    if (user.guestDocumentStatus !== "VERIFIED") {
      // Check if documents exist but are pending
      if (user.documents && user.documents.length > 0) {
        const hasPendingDocuments = user.documents.some(
          (doc) => doc.status === "PENDING"
        );
        if (hasPendingDocuments) {
          return {
            status: "PENDING_VERIFICATION",
            message:
              "Your documents are under review. Please wait for verification.",
            action: null,
          };
        }

        const hasRejectedDocuments = user.documents.some(
          (doc) => doc.status === "REJECTED"
        );
        if (hasRejectedDocuments) {
          return {
            status: "DOCUMENTS_REJECTED",
            message:
              "Your documents were rejected. Please upload new documents.",
            action: () => navigate("/id-check"),
          };
        }
      }

      // No documents or documents not verified
      return {
        status: "DOCUMENTS_REQUIRED",
        message: "Please upload your ID documents to book an apartment",
        action: () => navigate("/id-check"),
      };
    }

    // Check individual document statuses
    if (!user.documents || user.documents.length === 0) {
      return {
        status: "NO_DOCUMENTS",
        message: "Please upload your ID documents to book an apartment",
        action: () => navigate("/id-check"),
      };
    }

    // Check for both required document types with VERIFIED status
    const hasVerifiedIDCard = user.documents.some(
      (doc) => doc.type === "ID_CARD" && doc.status === "VERIFIED"
    );

    const hasVerifiedIDPhotograph = user.documents.some(
      (doc) => doc.type === "ID_PHOTOGRAPH" && doc.status === "VERIFIED"
    );

    if (!hasVerifiedIDCard || !hasVerifiedIDPhotograph) {
      console.log("Missing verified documents:", {
        hasVerifiedIDCard,
        hasVerifiedIDPhotograph,
        documents: user.documents,
      });

      return {
        status: "INCOMPLETE_DOCUMENTS",
        message: "Please complete both ID verification steps",
        action: () => navigate("/id-check"),
      };
    }

    // If we reach here and guestVerification.canBook is false, show generic message
    if (user.guestVerification && !user.guestVerification.canBook) {
      return {
        status: "CANNOT_BOOK",
        message:
          "Your account is not authorized to make bookings at this time. Please contact support.",
        action: null,
      };
    }

    // All checks passed - user can book
    return {
      status: "VERIFIED",
      message: "",
      action: () => navigate(`/booking-dates/${id}`),
    };
  };
  const handleBookNow = () => {
    const guestStatus = checkGuestStatus();

    switch (guestStatus.status) {
      case "NO_DOCUMENTS":
      case "REJECTED":
      case "NOT_VERIFIED":
        guestStatus.action();
        break;
      case "PENDING_VERIFICATION":
        showAlert("success", guestStatus.message);
        break;
      case "VERIFIED":
        guestStatus.action();
        break;
      default:
        showAlert(
          "error",
          "Please complete your verification to book an apartment"
        );
    }
  };

  const handleRequestAvailability = async () => {
    try {
      setIsRequesting(true);

      // Clear any previous alerts
      setAlert({ show: false, type: "error", message: "" });

      const res = await requestAvailability(id);

      if (res.success) {
        // Show success popup instead of alert
        setShowSuccess(true);
      } else {
        showAlert(
          "error",
          res.message || "Failed to send availability request"
        );
      }
    } catch (error) {
      console.error("Failed to send availability request:", error);
      showAlert(
        "error",
        error.message || "Failed to send availability request"
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleBrowseAround = () => {
    setShowSuccess(false);
    navigate("/apartments");
  };

  // Show loading spinner like in dashboard
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <img
          src="/icons/unconfirmed-payment.png"
          alt="Error"
          className="w-[60px] h-[60px] rounded-full mb-4"
        />
        <h3 className="text-[#505050] font-semibold mb-2 text-[14px]">
          Oops! Something went wrong.
        </h3>
        <p className="text-[#777] text-[12px] mb-4 max-w-[240px]">
          We couldn't load the apartment details right now.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-[#A20BA2] text-white text-[12px] font-medium hover:bg-[#8E0A8E] transition"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Alert Display */}
      {alert.show && (
        <div className="fixed top-4 ml-2 w-full left-1/2 transform -translate-x-1/2 z-50">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      <div className="flex items-center mb-[10px] p-4">
        <button onClick={() => navigate(-1)} className="hover:bg-gray-200 p-1">
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-5" />
        </button>
        <h1 className="text-[14px] ml-3 font-medium">Shortlet Overview</h1>
      </div>

      <ApartmentDisplay
        apartment={apartment}
        user={host}
        showActions={false}
        status={apartment.status}
        showLegalDocuments={false}
        onPriceButtonClick={handleBookNow}
      />
      <div className="px-[18px]">
        {/* Security Deposit */}
        {apartment.securityDeposit && (
          <div className="-mt-5">
            <p className="text-[#505050] font-medium text-[12px] w-full break-words md:text-[14px]">
              This security deposit is refundable and is intended to cover any
              damages, policy violations, or unresolved issues that may arise
              during your stay. To fully understand how refund eligibility is
              determined, including what qualifies as a deductible issue, payout
              timelines, and how Letora mediates disputes between hosts and
              guests, we strongly recommend reviewing our official<br></br>
              <Link to="/guest-refund">
                <span className="text-[#A20BA2] font-semibold">
                  Guest Refund Policy
                </span>
              </Link>
              . Letora ensures a transparent and fair resolution process for all
              parties involved. In most cases, deposits are returned in full
              when there are no valid complaints.
            </p>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="mt-[31.66px] md:mt-[42px]">
          <h2 className="text-[#333333] text-[14px] md:text-[22px] font-semibold">
            Cancellation Policy
          </h2>
          <p className="text-[#505050] font-medium text-[12px] mt-2 md:mt-[19px] md:text-[16px] w-full break-words">
            All cancellations and refund matters on Letora are governed by our
            official Guest Refund Policy to ensure transparency, fairness, and
            consistent protection for both guests and hosts. Hosts do not set
            their own cancellation rules. Instead, Letora provides a standard,
            platform-wide cancellation framework that applies to all bookings.
            To understand how refunds work, including when you may be eligible
            for a full or partial refund, how to report issues, and what
            qualifies as a valid cancellation reason, please read our full{" "}
            <br></br>
            <Link to="/guest-refund">
              <span className="text-[#A20BA2] font-semibold">
                Guest Refund Policy
              </span>
            </Link>{" "}
            on the website.
          </p>
        </div>

        {/* Booking Button */}
        <ButtonWhite
          text={isRequesting ? "Sending Request..." : "Request Availability"}
          className={"mt-20 mb-5"}
          onClick={handleRequestAvailability}
          disabled={isRequesting}
        />

        {/* Book Now Button - Updated to handle guest verification */}
        <Button
          text={`Book @ ₦${apartment.pricing?.pricePerNight?.toLocaleString()}/Night`}
          className={"mb-20"}
          onClick={handleBookNow}
        />
      </div>

      {/* Success Popup for Availability Request */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/success.svg"
          heading="Apartment Availability Request Sent"
          message="Your request has been sent to the host to confirm availability of this apartment. Check notification for updates"
          buttonText="Browse Around"
          onClose={handleBrowseAround}
          height="auto"
        />
      )}
    </div>
  );
}
