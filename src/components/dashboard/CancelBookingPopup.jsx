import { useState } from "react";

export default function CancelBookingPopup({ onClose, onSubmit }) {
  const reasonsList = [
    "I no longer need this space",
    "I found a better accomodation",
    "Host is unreachable",
    "This Listing is inacurrate/misleading",
    "I have safety concerns",
    "I have cleanliness concerns",
    "Specify other reason",
  ];

  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");
  const [showOtherReasonPopup, setShowOtherReasonPopup] = useState(false);

  const toggleReason = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
      if (reason === "Specify other reason") {
        setShowOtherReasonPopup(true);
      }
    }
  };

  const handleSubmit = () => {
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
    <div
      className="fixed inset-0 bg-black/50  z-[9999]"
      onClick={() => {
        if (!showOtherReasonPopup) onClose();
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg px-[28px] pt-[22px] pb-[44px] w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-medium mb-[22px] text-black text-center">
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

        <button
          onClick={handleSubmit}
          className="mt-[46px] h-[49px] w-full bg-[#A20BA2] text-white py-3 rounded-md font-semibold text-[14px] hover:bg-[#8A0A8A] transition-colors"
        >
          Submit
        </button>
      </div>

      {/* Other Reason Bottom Sheet */}
      {showOtherReasonPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center"
          onClick={() => setShowOtherReasonPopup(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-4 w-[90%] max-w-[400px] h-[220px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="State your reason..."
              maxLength={200}
              className="w-full h-full px-3 py-2 border rounded-md text-sm resize-none outline-none"
            />
            <span className="absolute bottom-5 right-6 text-xs text-gray-400">
              {otherReason.length}/200
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
