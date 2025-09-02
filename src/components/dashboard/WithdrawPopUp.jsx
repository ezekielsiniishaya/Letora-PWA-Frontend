import { useState } from "react";

export default function WithdrawPopup({ balance, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!amount) return;
    onClose();
    onSuccess(amount); // pass amount to success handler
  };

  return (
    <>
      {/* Overlay - clicking closes popup */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Popup at the bottom */}
      <div className="fixed bottom-0 left-0 w-full h-[224px] max-w-md mx-auto bg-white rounded-t-[15px] p-6 z-50">
        {/* Withdraw form */}
        <form onSubmit={handleWithdraw} className="mt-4 space-y-3">
          <div>
            <label className="text-[14px] font-medium text-[#333333]">
              Withdraw Amount
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border mt-1 w-full h-[45px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] text-black outline-none"
            />
            <p className="text-[12px] text-[#0D132180] mt-1">
              Available balance: <span>₦{balance}</span>
            </p>
          </div>

          <button
            type="submit"
            className="w-full h-[57px] bg-[#A20BA2] text-[16px] text-white rounded-md font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
