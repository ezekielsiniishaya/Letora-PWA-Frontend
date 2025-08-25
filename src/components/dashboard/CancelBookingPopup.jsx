import { useState } from "react";
import ConfirmCancelPopup from "./ConfirmCancelPopup";

export default function CancelBookingPopup({ onClose, onSubmit }) {
  const reasonsList = [
    "I no longer need this space",
    "I found a better accomodation",
    "Host is unreachable",
    "This Listing is inacurrate/misleading",
    "I have safety concenrns",
    "I have cleanliness concerns",
    "Specify other reason",
  ];

  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleReason = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSubmit = () => {
    setShowConfirm(true); // open confirm popup instead of closing
  };

  const handleConfirm = () => {
    if (
      selectedReasons.includes("Specify other reason") &&
      otherReason.trim()
    ) {
      onSubmit([
        ...selectedReasons.filter((r) => r !== "Specify other reason"),
        otherReason,
      ]);
    } else {
      onSubmit(selectedReasons);
    }
    onClose();
  };

  return (
    <>
      {/* Step 1: Select reason popup */}
      {!showConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-2xl shadow-lg px-[28px] w-[375px] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[16px] font-medium m-[22px] text-black text-center">
              Why Do You Need to Cancel?
            </h2>

            <div className="space-y-3">
              {reasonsList.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleReason(reason)}
                >
                  <span className="text-[14px] text-[#333333]">{reason}</span>
                  <div
                    className={`w-[10px] h-[10px] rounded-full border-2 flex items-center justify-center ${
                      selectedReasons.includes(reason)
                        ? "border-[#A20BA2] bg-[#A20BA2]"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedReasons.includes(reason) && (
                      <div className="w-[5px] h-[5px] rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedReasons.includes("Specify other reason") && (
              <div className="relative mt-3 w-full">
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="State your reason..."
                  maxLength={500}
                  className="w-full h-[172px] px-3 py-2 border rounded-md text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none resize-none"
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {otherReason.length}/500
                </span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="mt-[46px] mb-[44px] h-[49px] w-full bg-[#A20BA2] text-white py-3 rounded-md font-semibold text-[14px] hover:bg-[#8A0A8A] transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Confirm popup */}
      {showConfirm && (
        <ConfirmCancelPopup onClose={onClose} onConfirm={handleConfirm} />
      )}
    </>
  );
}
