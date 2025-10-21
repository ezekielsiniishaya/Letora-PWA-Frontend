// pages/guest/ShortletOverviewPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApartmentDisplay } from "../../components/apartment/ApartmentDisplay";
import { getApartmentById } from "../../services/apartmentApi";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import ButtonWhite from "../../components/ButtonWhite";
import { requestAvailability } from "../../services/userApi";
import { useUser } from "../../hooks/useUser"; // Import the user context
import { useBooking } from "../../hooks/useBooking";

export default function ShortletOverviewPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { getGuestVerificationStatus, getGuestDocuments } = useUser(); // Get user context
  const { setApartmentDetails, clearBookingData } = useBooking();

  useEffect(() => {
    // Only set apartment details when apartment data is available
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
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        const res = await getApartmentById(id);

        console.log("API Response:", res); // Debug log

        if (res && res.data) {
          // Transform the API response to match ApartmentDisplay expected structure
          const transformedApartment = transformApartmentData(res.data);
          setApartment(transformedApartment);
          setHost(res.data.host);
        } else {
          console.log("No apartment data received");
        }
      } catch (error) {
        console.error("Failed to load apartment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApartment();
    } else {
      console.error("No apartment ID provided");
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
      // Include other fields that might be needed
      status: apiData.status,
      isListed: apiData.isListed,
      isAvailable: apiData.isAvailable,
    };
  };

  // Check guest verification status
  const checkGuestStatus = () => {
    const guestStatus = getGuestVerificationStatus();
    const guestDocs = getGuestDocuments();

    console.log("Guest Status:", guestStatus);
    console.log("Guest Documents:", guestDocs);

    // If no documents uploaded
    if (guestDocs.length === 0) {
      return {
        status: "NO_DOCUMENTS",
        message: "Please upload your ID documents to book an apartment",
        action: () => navigate("/id-check"), // Replace with your actual upload documents route
      };
    }

    // If documents are pending verification
    if (guestStatus.status === "PENDING") {
      return {
        status: "PENDING_VERIFICATION",
        message: "Please wait, your documents are undergoing review",
        action: null,
      };
    }

    // If documents are rejected
    if (guestStatus.status === "REJECTED") {
      return {
        status: "REJECTED",
        message: "Your documents were rejected. Please upload new documents.",
        action: () => navigate("/id-check"),
      };
    }

    // If verified and can book
    if (guestStatus.status === "APPROVED" && guestStatus.canBook) {
      return {
        status: "VERIFIED",
        message: "",
        action: () => navigate(`/booking-dates/${id}`), // Replace with your actual booking dates route
      };
    }

    // Default case - not verified
    return {
      status: "NOT_VERIFIED",
      message: "Please complete your verification to book an apartment",
      action: () => navigate("/id-check"),
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
        setErrorMessage(guestStatus.message);
        break;
      case "VERIFIED":
        guestStatus.action();
        break;
      default:
        setErrorMessage(
          "Please complete your verification to book an apartment"
        );
    }
  };

  const handleRequestAvailability = async () => {
    try {
      setIsRequesting(true);
      // Clear any previous messages
      setSuccessMessage("");
      setErrorMessage("");

      const res = await requestAvailability(id);

      if (res.success) {
        setSuccessMessage("Availability request sent to host successfully!");
      }
    } catch (error) {
      console.error("Failed to send availability request:", error);
      setErrorMessage(error.message || "Failed to send availability request");
    } finally {
      setIsRequesting(false);
    }
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
      <div className="text-center mt-10 text-red-500">Apartment not found.</div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
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

        {/* Success Message */}
        {successMessage && (
          <div className="p-2 mt-2 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-2 mt-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

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
    </div>
  );
}
