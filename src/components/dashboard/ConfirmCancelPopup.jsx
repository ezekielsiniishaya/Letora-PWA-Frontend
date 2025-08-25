import ShowSuccess from "../../components/ShowSuccess";

export default function ConfirmCancelPopup({ onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-6 w-[375px] h-[263px] max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] mt-2 font-semibold text-[#F81A0C] mb-2">
          Cancel Booking
        </h2>
        <hr className="mb-4" />

        <p className="text-[14px] font-medium w-[275px] mx-auto text-[#333333] mb-2">
          Are you sure you want to cancel your shortlet booking? 😳{" "}
        </p>
        <p className="text-[12px] text-[#505050]  w-[275px] mx-auto font-medium mb-6">
          Refunds are based on timing, proof, and platform rules.{" "}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 border border-[#E9E9E9] text-[#686464] text-[12px] py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#A20BA2] text-[12px] text-white py-2 rounded-md font-semibold hover:bg-[#8A0A8A] transition-colors"
          >
            Yes, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
