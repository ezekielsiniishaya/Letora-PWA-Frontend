import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

export default function RevenuePage() {
  const [transactions, setTransactions] = useState([]);
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalEarnings: 0,
    weeklyInflow: 0,
    weeklyOutflow: 0,
    availableBalance: 0,
    pendingSettlements: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user, refreshUser, isHost, loading: userLoading } = useUser();

  // Format currency for display with decimal styling
  const formatCurrency = useCallback((amount) => {
    const formatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    // Replace NGN with ₦ and add decimal styling
    return (
      <>
        {formatted.replace("NGN", "").trim()}
        <span className="text-[#FBD0FB] text-[18px]">.00</span>
      </>
    );
  }, []);

  // Format amount with decimal styling for transactions
  const formatAmount = useCallback((amount, type = "credit") => {
    const mainAmount = new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return (
      <>
        {type === "credit" ? "+" : "-"}₦{mainAmount}.
        <span
          className={`text-[11.5px] ${
            type === "credit" ? "text-[#008751]" : "text-[#909090]"
          }`}
        >
          00
        </span>
      </>
    );
  }, []);

  // Format time for display
  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);
  // Calculate weekly inflow from FUNDS_TRANSFER in walletTransactions only
  const calculateWeeklyInflow = useCallback((walletTransactions) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return walletTransactions
      .filter(
        (tx) =>
          new Date(tx.createdAt) >= oneWeekAgo &&
          tx.amount > 0 &&
          tx.type === "FUNDS_TRANSFER"
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, []);

  // Calculate weekly outflow from WITHDRAWAL transactions only
  const calculateWeeklyOutflow = useCallback((walletTransactions) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return walletTransactions
      .filter(
        (tx) => new Date(tx.createdAt) >= oneWeekAgo && tx.type === "WITHDRAWAL"
      )
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }, []);

  // Format transactions for display - include both FUNDS_TRANSFER and WITHDRAWAL
  const formatTransactions = useCallback(
    (walletTransactions) => {
      const allTransactions = walletTransactions
        .filter(
          (tx) => tx.type === "FUNDS_TRANSFER" || tx.type === "WITHDRAWAL"
        )
        .map((tx) => {
          const isCredit = tx.amount > 0;
          const isWithdrawal = tx.type === "WITHDRAWAL";

          let description = "";
          if (isWithdrawal) {
            description = "Wallet Debit";
          } else if (tx.type === "FUNDS_TRANSFER") {
            description = "Wallet Credit";
          }

          return {
            id: tx.id,
            type: isCredit ? "credit" : "debit",
            amount: Math.abs(tx.amount),
            description: description,
            reference: tx.reference,
            time: formatTime(tx.createdAt),
            createdAt: tx.createdAt,
            transactionType: tx.type,
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return allTransactions;
    },
    [formatTime]
  );

  // Process wallet data from user object
  const processWalletData = useCallback(
    (userData) => {
      if (!userData) return;

      const wallet = userData.wallet;
      const hostTransactions = userData.transactions?.hostTransactions || [];
      const walletTransactions =
        userData.transactions?.walletTransactions || [];

      // Set wallet balance and earnings
      setWalletData({
        balance: wallet?.balance || 0,
        totalEarnings: wallet?.totalEarnings || 0,
        availableBalance: wallet?.availableBalance || 0,
        pendingSettlements: wallet?.pendingSettlements || 0,
        weeklyInflow: calculateWeeklyInflow(hostTransactions),
        weeklyOutflow: calculateWeeklyOutflow(walletTransactions),
      });

      // Transform transactions for display
      const formattedTransactions = formatTransactions(walletTransactions);
      setTransactions(formattedTransactions);
    },
    [calculateWeeklyInflow, calculateWeeklyOutflow, formatTransactions]
  );

  // Refresh user data and process wallet information
  const refreshUserData = useCallback(async () => {
    try {
      console.log("🔄 Refreshing user data for revenue page...");

      const updatedUser = await refreshUser();

      if (updatedUser) {
        processWalletData(updatedUser);
        console.log("✅ User data refreshed successfully");
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    } finally {
      setLoading(false);
    }
  }, [refreshUser, processWalletData]);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (user) {
        processWalletData(user);
        setLoading(false);
      } else if (!userLoading) {
        await refreshUserData();
      }
    };

    loadData();
  }, [user, userLoading, processWalletData, refreshUserData]);

  // Redirect if not a host
  useEffect(() => {
    if (!userLoading && user && !isHost) {
      console.warn("❌ User is not a host, redirecting...");
      navigate("/");
    }
  }, [user, isHost, userLoading, navigate]);

  // Show loading state
  if (loading || userLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A20BA2] mx-auto"></div>
          <p className="mt-4 text-[#666]">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666]">Unable to load user data</p>
          <button
            onClick={refreshUserData}
            className="mt-4 px-4 py-2 bg-[#A20BA2] text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] text-[#111] p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/icons/arrow-left.svg"
            alt="back"
            className="w-5 h-5 cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>

      {/* Aggregated Balance */}
      <div className="flex justify-center">
        <div className="relative mt-[20px] bg-[#A20BA2] text-white rounded-[5px] w-[297px] h-[110px] mb-6 flex flex-col items-center justify-center text-center">
          <img
            src="/icons/bg-layer.svg"
            alt="bg-layer"
            className="absolute right-0 top-0 w-[126px] h-full opacity-50"
          />
          <p className="text-[15.89px] font-medium">Aggregated balance</p>
          <h2 className="text-[23.84px] mt-[8px] font-medium">
            {formatCurrency(walletData.totalEarnings)}
          </h2>
        </div>
      </div>
      {/* Inflow / Outflow */}
      <div className="relative grid grid-cols-2 justify-center gap-4 mb-6">
        {/* Inflow Card */}
        <div className="relative w-[175px] bg-white border border-[#DADADA] h-[74px] rounded-[5px] py-3 px-2 flex flex-col">
          <div className="flex items-start justify-between">
            {/* Icon moved to left */}
            <div className="bg-[#008751] w-[18.1px] h-[18.1px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <img
                src="/icons/arrow-down.svg"
                alt="inflow"
                className="w-[6.29px] h-[9.17px]"
              />
            </div>
            {/* Content shifted to right with 12px gap */}
            <div className="flex-1 ml-2">
              <p className="text-[12.15px] font-medium text-[#666666]">
                This week Inflow
              </p>
              <h3 className="text-[18px] mt-1 font-medium text-[#333333]">
                ₦{walletData.weeklyInflow.toLocaleString()}.
                <span className="text-[14px] text-[#909090]">00</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Outflow Card */}
        <div className="relative w-[175px] bg-white border border-[#DADADA] h-[74px] rounded-[5px] py-3 px-2 flex flex-col">
          <div className="flex items-start justify-between">
            {/* Icon moved to left */}
            <div className="bg-[#FF2416] w-[18.1px] h-[18.1px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <img
                src="/icons/arrow-up.svg"
                alt="outflow"
                className="w-[6.29px] h-[9.17px]"
              />
            </div>
            {/* Content shifted to right with 12px gap */}
            <div className="flex-1 ml-2">
              <p className="text-[12.15px] font-medium text-[#666666]">
                This week Outflow
              </p>
              <h3 className="text-[18px] mt-1 font-medium text-[#333333]">
                ₦{walletData.weeklyOutflow.toLocaleString()}.
                <span className="text-[14px] text-[#909090]">00</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History - Only show when there are transactions */}
      {transactions.length > 0 && (
        <h3 className="text-[14px] font-medium text-black pt-[10px] mb-3">
          Transaction History
        </h3>
      )}

      <div className="flex flex-col gap-3">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-[80px] py-8">
            <img
              src="/icons/revenue-empty.png"
              className="w-[70px] h-[70px] grayscale"
              alt="No transactions"
            />
            <p className="text-[#505050] font-medium text-[14px] text-center">
              No Transaction History
            </p>
            <p className="text-[12px] text-[#807F7F] mt-1 text-center">
              You haven't recorded any revenue yet
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
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
                <div className="max-w-[200px]">
                  <p className="font-medium text-[#333333] text-[14px] truncate">
                    {tx.description}
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
                {formatAmount(tx.amount, tx.type)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
