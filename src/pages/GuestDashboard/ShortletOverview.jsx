// pages/guest/ShortletOverviewPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApartmentDisplay } from "../../components/apartment/ApartmentDisplay";
import { getApartmentById } from "../../services/apartmentApi";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import ButtonWhite from "../../components/ButtonWhite";

export default function ShortletOverviewPage() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        {/* Booking Button */}
        <Link to="">
          <ButtonWhite text="Request Availability" className={"mt-20 mb-5"} />
        </Link>
        <Link to="/id-check">
          <Button
            text={`Book @ ₦${apartment.pricing?.pricePerNight?.toLocaleString()}/Night`}
            className={"mb-20"}
          />
        </Link>
      </div>
    </div>
  );
}
