export default function LogoutConfirmPopup({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-6 w-full max-h-[40vh] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-[40px] h-[4px] bg-[#4D4D4D] rounded-full mx-auto mb-4"></div>

        <h2 className="text-[16px] font-semibold text-[#333333] mb-6">
          Are you sure
        </h2>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 w-[171px] h-[46px] bg-[#CCCCCC] text-[#333333] text-[12px] py-3 rounded-md font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#E03137] w-[171px] h-[46px]  text-white text-[14px] py-3 rounded-md font-semibold hover:bg-red-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
