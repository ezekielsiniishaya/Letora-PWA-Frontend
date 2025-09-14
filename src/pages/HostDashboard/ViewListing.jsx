import { useState } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { useNavigate } from "react-router-dom";
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

export default function ListingOverviewPage() {
  const [showGallery, setShowGallery] = useState(false);
  const [docs, setDocs] = useState({ doc1: null, doc2: null, doc3: null });
  const [showConfirm, setShowConfirm] = useState(false);
  const [successType, setSuccessType] = useState(null); // "submit" | "delete" | null

  const images = Array(8).fill("/images/apartment-dashboard.png");
  const navigate = useNavigate();

  const handleFileChange = (e, field) => {
    setDocs({ ...docs, [field]: e.target.files[0] });
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false); // close confirm modal first
    setSuccessType("delete"); // then trigger delete success modal
  };
  return (
    <div className="px-[18px] text-[#39302A] pb-[24px] mt-[10px] bg-[#F9F9F9]">
      <div className="flex items-center mb-[20px] justify-between">
        {/* Back Arrow */}
        <button onClick={() => navigate(-1)} className="hover:bg-gray-200">
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-5" />
        </button>
        {/* Edit Button */}
        <button
          onClick={() => navigate("/basic-info")}
          className="bg-[#686464] text-[12px] font-medium w-[65px] h-[21px] text-white px-4 rounded-full hover:bg-gray-800"
        >
          Edit
        </button>
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
            </div>

            <div className="flex flex-col items-end ml-auto">
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

      {/* House Rules */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#333333] text-[14px] font-semibold">
          House Rules
        </h2>
        <HouseRules list={houseRules} />
      </div>

      {/* Security Deposit */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#333333] text-[14px] font-semibold">
          Security Deposit Fee
        </h2>
        <div className="flex items-center mt-[10px] gap-1 text-[#505050] text-[14px] font-medium">
          <img
            src="/icons/money.svg"
            alt="money icon"
            className="w-[19px] h-[14px] object-contain"
          />
          <p className="whitespace-nowrap">N100,000.00</p>
        </div>
      </div>

      {/* Documentation Upload */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#333333] text-[14px] font-semibold">
          Documentations
        </h2>
        <div className="flex gap-[7.5px] mt-[10px]">
          {["doc1", "doc2", "doc3"].map((field, i) => (
            <label
              key={i}
              className="flex-1 border-[1.5px] border-[#D1D0D0] rounded-lg bg-[#CCCCCC42] h-[98px] flex flex-col items-center cursor-pointer text-[#505050] font-medium text-[12px]"
            >
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, field)}
              />
              {docs[field] ? docs[field].name : ``}
            </label>
          ))}
        </div>
      </div>

      {/* Delete Button */}
      <div className="text-center">
        <button
          onClick={handleDeleteClick}
          className="mx-auto w-full mt-[59px] bg-[#FFFFFF] text-[#686464] border border-[#E9E9E9] text-[16px] font-semibold h-[57px] rounded-[10px] mb-[72px]"
        >
          Delete Listing
        </button>
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

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <ShowSuccess
          image="/icons/delete.svg"
          confirmMode
          heading="Delete Listing?"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Success Modals */}
      {successType === "submit" && (
        <ShowSuccess
          image="/icons/document.png"
          heading="Listing Submitted for Review"
          message="Letora will now run standard checks to verify your identity and listing details. You’ll be notified once it’s approved."
          buttonText="Done"
          onClose={() => {
            setSuccessType(null);
            navigate("/shortlet-review");
          }}
        />
      )}

      {successType === "delete" && (
        <ShowSuccess
          image="/icons/success.svg"
          heading="List Deleted!"
          message=" "
          buttonText="Done"
          onClose={() => {
            setSuccessType(null);
            navigate("/host-dashboard");
          }}
        />
      )}
    </div>
  );
}
