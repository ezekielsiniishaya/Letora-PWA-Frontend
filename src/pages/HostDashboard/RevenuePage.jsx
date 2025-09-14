import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RevenuePage() {
  const [transactions] = useState([
    { type: "credit", amount: 20983, time: "12:03 AM" },
    { type: "debit", amount: 20983, time: "12:03 AM" },
    { type: "debit", amount: 20983, time: "12:03 AM" },
    { type: "credit", amount: 20983, time: "12:03 AM" },
    { type: "credit", amount: 20983, time: "12:03 AM" },
    { type: "credit", amount: 20983, time: "12:03 AM" },
    { type: "debit", amount: 20983, time: "12:03 AM" },
  ]);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] text-[#111] p-5">
      {/* Header */}
      <div className="flex items-center">
        <img
          src="/icons/arrow-left.svg"
          alt="back"
          className="w-5 h-5"
          onClick={() => navigate(-1)}
        />
      </div>

      {/* Aggregated Balance */}
      <div className="flex justify-center">
        <div className="relative mt-[20px] bg-[#A20BA2] text-white rounded-[5px] w-[297px] h-[110px] mb-6 flex flex-col items-center justify-center text-center">
          <img
            src="/icons/bg-layer.svg"
            alt="bg-layer"
            className="absolute right-0 top-0 w-[126px] h-full opacity-30"
          />
          <p className="text-[15.89px] font-medium">Aggregated balance</p>
          <h2 className="text-[23.84px] mt-[8px] font-medium">
            N4,466,787.<span className="text-[#FBD0FB] text-[18px]">56</span>
          </h2>
        </div>
      </div>

      {/* Inflow / Outflow */}
      <div className="relative grid grid-cols-2 justify-center gap-4 mb-6">
        <div className="relative w-[175px] bg-white border border-[#DADADA] h-[74px] rounded-[5px] p-3 flex flex-col">
          <p className="text-[12.15px] font-medium text-[#666666]">
            This week Inflow
          </p>
          <h3 className="text-[18px] mt-1 font-medium text-[#333333]">
            N4,466,787.<span className="text-[14px] text-[#909090]">56</span>
          </h3>
          <div className="bg-[#008751] w-[18.1px] h-[18.1px] rounded-full flex items-center justify-center absolute top-7 right-4">
            <img
              src="/icons/arrow-down.svg"
              alt="inflow"
              className="w-[6.29px] h-[9.17px]"
            />
          </div>
        </div>
        <div className="relative w-[175px] bg-white border border-[#DADADA] h-[74px] rounded-[5px] p-3 flex flex-col">
          <p className="text-[12.15px] font-medium text-[#666666]">
            This week outflow
          </p>
          <h3 className="text-[18px] mt-1 font-medium text-[#333333]">
            N4,466,787.<span className="text-[14px] text-[#909090]">56</span>
          </h3>
          <div className="bg-[#FF2416] w-[18.1px] h-[18.1px] rounded-full flex items-center justify-center absolute top-7 right-4">
            <img
              src="/icons/arrow-up.svg"
              alt="inflow"
              className="w-[6.29px] h-[9.17px]"
            />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <h3 className="text-[14px] font-medium text-black pt-[10px] mb-3">
        Transaction History
      </h3>
      <div className="flex flex-col gap-3">
        {transactions.map((tx, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white rounded-[5px] p-3"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-[25px] h-[25px] rounded-full flex items-center justify-center ${
                  tx.type === "credit" ? "bg-[#008751]" : "bg-[#FF2416]"
                }`}
              >
                <img
                  src={
                    tx.type === "credit"
                      ? "/icons/arrow-down.svg"
                      : "/icons/arrow-up.svg"
                  }
                  alt="icon"
                  className="w-[4.29px] h-[13.4px]"
                />
              </div>
              <div>
                <p className="font-medium text-[#333333] text-[14px]">
                  Wallet {tx.type === "credit" ? "Credit" : "Debit"}
                </p>
                <p className="text-[12px] text-[#909090]">
                  {tx.type === "credit" ? "Delivered" : "Withdrawn"} {tx.time}
                </p>
              </div>
            </div>
            <p
              className={`font-medium text-[14px] ${
                tx.type === "credit" ? "text-[#008751]" : "text-[#505050]"
              }`}
            >
              {tx.type === "credit" ? "+" : "-"}N{tx.amount.toLocaleString()}.
              <span
                className={`text-[11.5px] ${
                  tx.type === "credit" ? "text-[#008751]" : "text-[#909090]"
                }`}
              >
                00
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
