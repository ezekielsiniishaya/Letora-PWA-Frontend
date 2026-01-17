// pages/guest/ShortletOverviewPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApartmentOverview } from "../../components/apartment/ApartmentOverview";
import { getApartmentById } from "../../services/apartmentApi";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import ButtonWhite from "../../components/ButtonWhite";
import { requestAvailability } from "../../services/userApi";
import { useUser } from "../../hooks/useUser";
import { useBooking } from "../../hooks/useBooking";
import Alert from "../../components/utils/Alerts";
import ShowSuccess from "../../components/ShowSuccess";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext";

export default function ShortletOverviewPage() {
  const { setBackgroundColor } = useBackgroundColor();
  // status bar background color and icon color
  useEffect(() => {
    setBackgroundColor("#F9F9F9");

    if (window.Capacitor || window.capacitor) {
      StatusBar.setBackgroundColor({ color: "#F9F9F9" });
      StatusBar.setStyle({ style: Style.Light });
    }
  }, [setBackgroundColor]);

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
        apartment.securityDeposit?.amount || 0,
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
      // ✅ ADD THESE TWO LINES:
      favorites: apiData.favorites || [],
      _count: apiData._count || {},
      // ✅ ADD AVAILABILITY REQUEST
      availabilityRequest: apiData.availabilityRequest || null,
      // ✅ ADD REVIEWS DATA
      reviews: apiData.reviews || [],
      ratings: apiData.ratings || {},
    };
  };

  // Check if current user is the host and owner of this apartment
  const isHostAndOwner = user && host && user.id === host.id;

  // Check if we should show the request button
  const shouldShowRequestButton = () => {
    // Don't show if user is host and owner
    if (isHostAndOwner) return false;

    const request = apartment?.availabilityRequest;

    // If no request exists, show the button
    if (!request) return true;

    // Check request status and timing
    const requestDate = new Date(request.createdAt);
    const today = new Date();

    // Check if request was made today
    const isToday =
      requestDate.getDate() === today.getDate() &&
      requestDate.getMonth() === today.getMonth() &&
      requestDate.getFullYear() === today.getFullYear();

    // Don't show button if:
    // 1. Request was made today AND is still PENDING
    // 2. Request is already CONFIRMED_AVAILABLE (user can book now)
    // 3. Request is CONFIRMED_UNAVAILABLE (host said no)
    if (isToday && request.status === "PENDING") return false;
    if (request.status === "CONFIRMED_AVAILABLE") return false;
    if (request.status === "CONFIRMED_UNAVAILABLE") return true; // Allow re-request if unavailable

    return true;
  };

  // Check user status whether they can book
  const checkGuestStatus = () => {
    if (!user) {
      return {
        status: "NO_USER",
        message: "Please log in to book an apartment",
        action: () => navigate("/login"),
        canBook: false,
      };
    }

    // Handle HOST users differently - they don't need guest verification
    if (user.role === "HOST") {
      // For hosts, check if they have verified host status
      if (
        user.hostVerification?.status === "VERIFIED" &&
        user.hostVerification?.hasRequiredDocuments
      ) {
        // Host is verified - now check availability
      } else {
        // Check the specific host verification status
        if (user.hostVerification?.status === "PENDING") {
          return {
            status: "HOST_VERIFICATION_PENDING",
            message: "Your documents are undergoing review.",
            action: null,
            canBook: false,
          };
        } else if (!user.hostVerification?.hasRequiredDocuments) {
          return {
            status: "HOST_DOCUMENTS_REQUIRED",
            message:
              "Please complete your host document upload to book apartments",
            action: () => navigate("/host/dashboard"),
            canBook: false,
          };
        } else {
          return {
            status: "HOST_NEEDS_VERIFICATION",
            message:
              "Your host verification is pending. Please wait for verification to complete.",
            action: null,
            canBook: false,
          };
        }
      }
    }

    // For GUEST users - check verification
    if (user.guestVerification) {
      const { canBook, status, hasRequiredDocuments } = user.guestVerification;

      if (!canBook) {
        if (
          !hasRequiredDocuments &&
          (!user.documents || user.documents.length === 0)
        ) {
          return {
            status: "DOCUMENTS_REQUIRED",
            message: "Please upload your ID documents to book an apartment",
            action: () => navigate("/id-check"),
            canBook: false,
          };
        }

        if (status === "PENDING") {
          return {
            status: "GUEST_VERIFICATION_PENDING",
            message:
              "Your documents are under review. Please wait for verification.",
            action: null,
            canBook: false,
          };
        }

        if (status === "REJECTED") {
          return {
            status: "GUEST_VERIFICATION_REJECTED",
            message:
              "Your documents were rejected. Please upload new documents.",
            action: () => navigate("/id-check"),
            canBook: false,
          };
        }
      }
    } else if (user.role === "GUEST") {
      // Fallback verification checks
      if (user.guestDocumentStatus === "PENDING") {
        return {
          status: "GUEST_DOCUMENTS_PENDING",
          message:
            "Your documents are under review. Please wait for verification.",
          action: null,
          canBook: false,
        };
      }

      if (user.guestDocumentStatus === "REJECTED") {
        return {
          status: "GUEST_DOCUMENTS_REJECTED",
          message: "Your documents were rejected. Please upload new documents.",
          action: () => navigate("/id-check"),
          canBook: false,
        };
      }
    }

    // Check user verification status
    if (user.verificationStatus && user.verificationStatus !== "VERIFIED") {
      if (user.verificationStatus === "PENDING") {
        return {
          status: "USER_VERIFICATION_PENDING",
          message:
            "Your account verification is pending. Please wait for approval.",
          action: null,
          canBook: false,
        };
      }
      return {
        status: "USER_NOT_VERIFIED",
        message: "Your account needs to be verified to book an apartment",
        action: () => navigate("/profile"),
        canBook: false,
      };
    }

    // ========== AVAILABILITY CHECK ==========
    const availability = apartment?.availabilityRequest;

    if (!availability) {
      return {
        status: "NO_AVAILABILITY_REQUEST",
        message: "Please request availability from the host before booking.",
        action: null,
        canBook: false,
      };
    }

    switch (availability.status) {
      case "PENDING":
        return {
          status: "AVAILABILITY_PENDING",
          message:
            "Your availability request is still pending. Please wait for host approval.",
          action: null,
          canBook: false,
        };
      case "CONFIRMED_AVAILABLE":
        // User is verified AND availability is confirmed - allow booking
        return {
          status: "VERIFIED",
          message: "",
          action: () => navigate(`/booking-dates/${id}`),
          canBook: true,
        };
      case "CONFIRMED_UNAVAILABLE":
        return {
          status: "AVAILABILITY_UNAVAILABLE",
          message: "This apartment is not available for your requested dates.",
          action: null,
          canBook: false,
        };
      default:
        return {
          status: "AVAILABILITY_UNKNOWN",
          message: "Cannot proceed with booking. Please try again later.",
          action: null,
          canBook: false,
        };
    }
  };

  const canBookNow = () => {
    return checkGuestStatus().canBook;
  };

  const isBookButtonEnabled = canBookNow();

  const handleBookNow = () => {
    const guestStatus = checkGuestStatus();
    console.log("Guest status check:", guestStatus);

    switch (guestStatus.status) {
      case "NO_USER":
      case "DOCUMENTS_REQUIRED":
      case "DOCUMENTS_REJECTED":
      case "GUEST_DOCUMENTS_REJECTED":
      case "GUEST_VERIFICATION_REJECTED":
      case "USER_NOT_VERIFIED":
      case "HOST_DOCUMENTS_REQUIRED":
        if (guestStatus.action) {
          guestStatus.action();
        } else {
          showAlert("error", guestStatus.message);
        }
        break;

      case "HOST_VERIFICATION_PENDING":
      case "HOST_NEEDS_VERIFICATION":
      case "GUEST_VERIFICATION_PENDING":
      case "USER_VERIFICATION_PENDING":
      case "GUEST_DOCUMENTS_PENDING":
      case "DOCUMENTS_PENDING_VERIFICATION":
        showAlert("info", guestStatus.message);
        break;

      case "NO_AVAILABILITY_REQUEST":
        showAlert(
          "info",
          "Please request availability from the host before booking.",
        );
        break;

      case "AVAILABILITY_PENDING":
        showAlert(
          "info",
          "Your availability request is pending host approval. You'll be notified when it's confirmed.",
        );
        break;

      case "AVAILABILITY_UNAVAILABLE":
        showAlert(
          "warning",
          "The host has marked this apartment as unavailable at the moment. ",
        );
        break;

      case "VERIFIED":
        if (guestStatus.action) {
          guestStatus.action();
        }
        break;

      case "CANNOT_BOOK":
      default:
        showAlert(
          "error",
          guestStatus.message ||
            "Please complete your verification to book an apartment",
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

        // Refresh apartment data to get the updated availability request
        const updatedRes = await getApartmentById(id);
        if (updatedRes && updatedRes.data) {
          const transformedApartment = transformApartmentData(updatedRes.data);
          setApartment(transformedApartment);
        }
      } else {
        showAlert(
          "error",
          res.message || "Failed to send availability request",
        );
      }
    } catch (error) {
      console.error("Failed to send availability request:", error);
      showAlert(
        "error",
        error.message || "Failed to send availability request",
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleBrowseAround = () => {
    setShowSuccess(false);
    navigate("/apartments");
  };

  // Check if we should show the request button
  const showRequestButton = shouldShowRequestButton();

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
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-[#A20BA2] text-white text-[12px] font-medium hover:bg-[#8E0A8E] transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-[10px]">
      {/* Alert Display */}
      {alert.show && (
        <div className="fixed top-4 ml-2 w-full left-1/2 transform -translate-x-1/2 z-50">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      <ApartmentOverview
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

        {/* Request Availability Button - Hide if user is host and owner OR if request was made today OR status is not pending */}
        {!isHostAndOwner && showRequestButton && (
          <ButtonWhite
            text={isRequesting ? "Sending Request..." : "Request Availability"}
            className={"mt-20 mb-5"}
            onClick={handleRequestAvailability}
            disabled={isRequesting}
          />
        )}

        {/* Book Now Button - Updated to handle guest verification */}
        <Button
          text={`Book @ ₦${apartment.pricing?.pricePerNight?.toLocaleString()}/Night`}
          className={`mb-[70px] ${
            !isHostAndOwner && !showRequestButton
              ? "mt-20"
              : isHostAndOwner
                ? "mt-[120px]"
                : ""
          }`}
          onClick={handleBookNow}
          disabled={!isBookButtonEnabled}
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
