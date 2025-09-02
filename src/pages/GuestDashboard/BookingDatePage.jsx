import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BookingPage() {
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [days, setDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const dailyRate = 30000; // per-day rate

  // calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleOpenCalendar = (field) => {
    setActiveField(field);
    setShowCalendar(true);
  };

  const handleSelectDate = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);

    if (activeField === "checkin") {
      setCheckIn(selectedDate);
    } else {
      setCheckOut(selectedDate);
    }

    setShowCalendar(false);
    setActiveField(null);
  };

  // compute days + cost whenever checkIn & checkOut are both set
  useEffect(() => {
    if (checkIn && checkOut) {
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setDays(diffDays);
        setTotalCost(diffDays * dailyRate);
      } else {
        setDays(0);
        setTotalCost(0);
      }
    }
  }, [checkIn, checkOut]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // generate days grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-[50px] flex flex-col items-center px-6">
        <img
          src="/icons/booking.png"
          alt="Booking"
          className="w-[100px] h-[100px] mb-4"
        />

        <p className="text-center text-[14px] text-[#333333] font-medium mb-[50px]">
          Choose your booking dates
        </p>

        {/* Check-in / Check-out */}
        <div className="flex gap-4 w-full mb-[54px]">
          <div className="flex flex-col flex-1">
            <label className="text-[14px] text-[#333333] font-medium mb-1">
              Check-in <span className="text-red-500">*</span>
            </label>
            <button
              onClick={() => handleOpenCalendar("checkin")}
              className="flex items-center border border-[#E6E6E6] bg-white h-[47.48px] rounded-[5px] px-3 py-2 text-[13.64px] text-[#686464]"
            >
              <img
                src="/icons/calendar-add.svg"
                alt="Calendar"
                className="w-4 h-4 mr-[2px]"
              />
              <span>{checkIn ? checkIn.toDateString() : "Choose Date"}</span>
            </button>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-[14px] text-[#333333] font-medium mb-1">
              Check-out <span className="text-red-500">*</span>
            </label>
            <button
              onClick={() => handleOpenCalendar("checkout")}
              className="flex items-center border border-[#D9D9D9] rounded-[5px] px-3 py-2 text-[13.67px] text-[#686464] h-[47.48px]"
            >
              <img
                src="/icons/calendar-add.svg"
                alt="Calendar"
                className="w-4 h-4 mr-[2px]"
              />
              <span>{checkOut ? checkOut.toDateString() : "Choose Date"}</span>
            </button>
          </div>
        </div>

        {/* Booking cost */}
        <div className="text-center">
          <p className="text-[14px] font-medium text-[#333333]">
            Total Booking Cost
          </p>
          <p className="text-[30px] font-semibold text-black">
            {days > 0 ? `N${totalCost.toLocaleString()}` : "0"}
          </p>
          <p className="text-[12px] font-medium text-[#505050]">
            {days > 0
              ? `${days} day${days > 1 ? "s" : ""} stay`
              : "Select dates"}
          </p>
        </div>
      </div>

      {/* Bottom button */}
      <div className="p-4">
        <Link to="/booking-overview">
          <button className="w-full h-[57px] mt-[157px] rounded-[10px] font-semibold py-3 bg-[#A20BA2] text-white text-[16px]">
            Proceed
          </button>
        </Link>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-sm">
            <h3 className="text-[14px] text-[#333333] font-medium mt-2 mb-4">
              Select Date
            </h3>

            {/* Calendar header */}
            <div className="flex items-center justify-between mb-4">
              <button className="p-1" onClick={handlePrevMonth}>
                <img
                  src="/icons/date-left.svg"
                  alt="Prev"
                  className="w-4 h-4"
                />
              </button>
              <span className="text-[12.36px] text-[#1A1A1A] font-medium">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button className="p-1" onClick={handleNextMonth}>
                <img
                  src="/icons/date-right.svg"
                  alt="Next"
                  className="w-4 h-4"
                />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 text-[14.13px] text-gray-800 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>
            {/* Dates grid */}
            <div className="grid grid-cols-7 gap-1 text-[#333333] text-center text-[14.13px] mb-[10px]">
              {daysArray.map((day, i) => {
                if (!day) return <div key={i}></div>;

                const thisDate = new Date(currentYear, currentMonth, day);
                const todayMidnight = new Date();
                todayMidnight.setHours(0, 0, 0, 0);

                const isPast = thisDate < todayMidnight;

                return (
                  <button
                    key={i}
                    onClick={() => !isPast && handleSelectDate(day)}
                    disabled={isPast}
                    className={`py-2 rounded ${
                      isPast
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-[#A20BA2] hover:text-white"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center mb-5">
              <button
                onClick={() => setShowCalendar(false)}
                className="w-[250px] h-[42px] bg-[#A20BA2] text-[12px] font-semibold text-white py-2 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
