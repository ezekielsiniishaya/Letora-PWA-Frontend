import { useState } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { Link, useNavigate } from "react-router-dom";
import Reviews from "../../components/dashboard/ReviewsSections";
import PropertyDetails from "../../components/dashboard/PropertyDetails";
import Facilities from "../../components/dashboard/Facilities";
import HouseRules from "../../components/dashboard/HouseRules";

const houseRules = [
  { icon: "/icons/no-smoking.svg", text: "No Smoking" },
  { icon: "/icons/no-pets.svg", text: "No Pets Allowed" },
  { icon: "/icons/no-music.svg", text: "No Loud Music" },
  { icon: "/icons/flush.svg", text: "Flush Properly" },
  { icon: "/icons/dispose.svg", text: "Dispose Wastes Properly" },
];
const propertyDetails = [
  { iconSrc: "/icons/bed-sm.svg", label: "Bedroom", value: "3" },
  { iconSrc: "/icons/bath.svg", label: "Bathtub", value: "3" },
  { iconSrc: "/icons/car.svg", label: "Parking Space", value: "Medium" },
  {
    iconSrc: "/icons/apartment.svg",
    label: "Apartment Type",
    value: "2-Bedroom Apartment",
  },
  { iconSrc: "/icons/guest.svg", label: "Guest Size", value: "4" },
  { iconSrc: "/icons/zap.svg", label: "Electricity", value: "Band A" },
  { iconSrc: "/icons/kitchen.svg", label: "Kitchen Size", value: "Medium" },
];
const facilities = [
  { icon: "/icons/laundry.svg", text: "Laundry Service" },
  { icon: "/icons/playstation.svg", text: "Play station" },
  { icon: "/icons/chef.svg", text: "Chef Service" },
  { icon: "/icons/generator.svg", text: "Generator Backup" },
  { icon: "/icons/ac.svg", text: "Air conditioning" },
  { icon: "/icons/wifi.svg", text: "Wifi" },
  { icon: "/icons/solar.svg", text: "Solar" },
  { icon: "/icons/swimming.svg", text: "Swimming pool" },
];

export default function ShortletOverviewPage() {
  const [showGallery, setShowGallery] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false); // success modal state

  const images = Array(8).fill("/images/apartment-dashboard.png");
  const navigate = useNavigate();

  return (
    <div className="mx-[18px] text-[#39302A] mb-[24px] mt-[30px] bg-white">
      <div className="flex items-center mb-[30px]">
        {/* Back Arrow */}
        <button onClick={() => navigate(-1)} className="hover:bg-gray-200">
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-5" />
        </button>
        <h1 className="text-[14px] ml-3 font-medium">Shortlet Overview</h1>
      </div>

      {/* Apartment Images - Mobile */}
      <div className="flex h-[249px] flex-row gap-x-[7px] md:hidden">
        <div>
          <img
            src={images[0]}
            alt="Apartment main view"
            className="rounded-[5.13px] h-[249px] object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-[7.5px]">
          {images.slice(1, 3).map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Apartment ${i + 1}`}
              className="rounded-[3.81px] w-[90px] h-[78px] object-cover cursor-pointer hover:opacity-80"
            />
          ))}
          <div
            className="relative w-[90px] h-[78px] rounded-[3.81px] overflow-hidden cursor-pointer hover:opacity-80"
            onClick={() => setShowGallery(true)}
          >
            <img
              src={images[3]}
              alt="More images"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-semibold text-lg">
              +{images.length - 3}
            </div>
          </div>
        </div>
      </div>

      {/* Host info & price */}
      <div className="flex flex-col mt-4">
        <div className="flex flex-col items-start">
          <img
            src="/images/host.jpg"
            alt="Host"
            className="w-[50px] h-[50px] rounded-full object-cover -mt-10"
          />
          <span className="font-medium mt-[8px] text-[12px]">Ayodamola. P</span>

          <div className="flex flex-row w-full mt-[6px] gap-[20px]">
            <div className="w-[200px]">
              <h1 className="text-[14px] font-semibold leading-snug">
                Exquisite Three Bedroom Apartment
              </h1>
              <p className="font-medium text-[12px]">Maryland, Lagos</p>
              <div className="flex items-center mt-2 gap-1 md:mt-4 md:gap-2">
                <div className="flex -space-x-2 md:-space-x-3">
                  <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#8B44FF] md:w-[36.62px] md:h-[36.62px]" />
                  <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#E00E9A] md:w-[36.62px] md:h-[36.62px]" />
                  <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#FF4444] md:w-[36.62px] md:h-[36.62px]" />
                  <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#70E5FF] md:w-[36.62px] md:h-[36.62px]" />
                </div>

                <span className="text-[12px] font-medium text-[#333333] md:text-[20px]">
                  23+ Liked this place
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end ml-auto">
              <span className="bg-black w-[67px] h-[18px] text-white text-[10px] px-[5px] font-medium rounded-[30px] flex items-center justify-center gap-1 md:w-[110px] md:h-[22px] md:hidden md:text-[16px] md:px-[14px]">
                <img
                  src="/icons/tick-white.svg"
                  alt="Verified icon"
                  className="w-[12px] h-[12px]"
                />
                Verified
              </span>
              <p className="text-white py-[6px] px-[6px] bg-[#A20BA2] h-[25px] font-semibold text-[12px] mt-[6px] rounded flex items-center justify-center">
                ₦456,000/Night
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#39302A] text-[14px] font-semibold">
          Property Details
        </h2>
        <PropertyDetails list={propertyDetails} />
      </div>
      {/* Description */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#39302A] text-[14px] font-semibold">
          Descriptions
        </h2>
        <p className="text-[#505050] text-[12px] mt-2 w-full break-words">
          kgjklsfjglkfjflksdjksldfjfkljgklffskdjjskdhkjadcnjadshcjaksc,
          nas,jdc.ajs,bcasjkcbsabcashdbcasnbcsacbasmncbascbasmncbasbcmasncbsambcamnsbcasnmbcmnasbcmnasbcmnsabcmnasbcmnasbcsjhdsgfyewgbsjhdhjsgsamncbvasmncsaklsfgywfgyetfweajhgfdajgdhajsdgahjsgdhsjadgsahjdfgsadagfdhaf
        </p>
      </div>

      {/* Facilities */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#39302A] text-[14px] font-semibold">
          Facilities & Services
        </h2>
        <Facilities list={facilities} />
      </div>

      {/* Reviews */}
      <h2 className="text-[#333333] text-[14px] font-semibold mt-[31.66px]">
        Reviews (20)
      </h2>
      <Reviews count={3} />
      <div className="flex justify-end">
        <Link to="/reviews">
          <span className="text-[#A20BA2] text-[12px] font-semibold cursor-pointer">
            See more
          </span>
        </Link>
      </div>
      {/* House Rules */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#333333] text-[14px] font-semibold">
          House Rules
        </h2>
        <HouseRules list={houseRules} />
      </div>

      {/* Security Deposit */}
      <div className="mt-[31.66px] md:mt-[72px]">
        <h2 className="text-[#333333] text-[14px] font-semibold md:text-[22px]">
          Security Deposit Fee
        </h2>
        <div className="flex items-center mt-[10px] gap-1 md:gap-2 text-[#505050] text-[14px] font-medium md:mt-[19px]">
          <img
            src="/icons/money.svg"
            alt="money icon"
            className="w-[19px] h-[14px] md:w-[25px] md:h-[18px] object-contain"
          />
          <p className="whitespace-nowrap md:text-[16px] md:font-bold">
            N100, 000
            <span className="text-[12px] md:text-[13px] md:font-bold">.00</span>
          </p>
        </div>
        <p className="text-[#505050] font-medium text-[12px] mt-2 w-full break-words md:text-[14px]">
          This security deposit is refundable and is intended to cover any
          damages, policy violations, or unresolved issues that may arise during
          your stay. To fully understand how refund eligibility is determined,
          including what qualifies as a deductible issue, payout timelines, and
          how Letora mediates disputes between hosts and guests, we strongly
          recommend reviewing our official <br />
          <Link to="/guest-refund">
            <span className="text-[#A20BA2] font-semibold">
              Guest Refund Policy
            </span>{" "}
          </Link>
          on the website. Letora ensures a transparent and fair resolution
          process for all parties involved. In most cases, deposits are returned
          in full when there are no valid complaints.
        </p>
      </div>
      <div className="mt-[31.66px] md:mt-[42px]">
        <h2 className="text-[#333333] text-[14px] md:text-[22px] font-semibold">
          Cancellation Policy
        </h2>

        <p className="text-[#505050] font-medium text-[12px] mt-2 md:mt-[19px] md:text-[16px] w-full break-words">
          All cancellations and refund matters on Letora are governed by our
          official Guest Refund Policy to ensure transparency, fairness, and
          consistent protection for both guests and hosts. Hosts do not set
          their own cancellation rules. Instead, Letora provides a standard,
          platform-wide cancellation framework that applies to all bookings. To
          understand how refunds work, including when you may be eligible for a
          full or partial refund, how to report issues, and what qualifies as a
          valid cancellation reason, please read our full{" "}
          <Link to="/guest-refund">
            <span className="text-[#A20BA2] font-semibold">
              Guest Refund Policy
            </span>
          </Link>{" "}
          on the website.
        </p>
      </div>
      {/* Submit */}
      <div className="text-center">
        <Link to="/id-check">
          <button className="mx-auto w-full mt-[54px] bg-[#A20BA2] text-white text-[16px] font-semibold h-[57px] rounded-[10px] mb-[54px]">
            Book @ N456,000/Night
          </button>
        </Link>
      </div>

      {/* Gallery Overlay */}
      {showGallery && (
        <div
          className="fixed inset-0 bg-[#313131]/80 flex items-center justify-center z-50"
          onClick={() => setShowGallery(false)}
        >
          <div
            className="flex gap-[13px] overflow-x-auto p-4 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Apartment ${i + 1}`}
                className="rounded-[5px] w-[319px] h-[203px] object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/document.png"
          heading="Listing Submitted for Review"
          message="Letora will now run standard checks to verify your identity and listing details. You’ll be notified once it’s approved."
          buttonText="Done"
          width=""
          onClose={() => {
            setShowSuccess(false);
            navigate("/shortlet-overview");
          }}
        />
      )}
    </div>
  );
}
