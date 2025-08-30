import { Link, useNavigate } from "react-router-dom";

export default function BookingDetails() {
  const navigate = useNavigate();

  // Single hardcoded apartment (no host info included)
  const lodge = {
    id: 1,
    title: "3-Bedroom Apartment",
    location: "Maryland, Lagos",
    image: "/images/apartment.png",
    price: "₦150,000/Night",
    bookingDate: "30-Nov-2025 | 10:00 AM",
    checkIn: "30-Nov-2025",
    checkOut: "30-Dec-2025",
    duration: "30 Days",
    feePaid: "N1,500,000",
    deposit: "N100,000",
    convenience: "N2,500",
    total: "N1,602,500",
    cancellationDate: "15-Dec-2025",
    cancellationReason:
      "Guest damaged property and violated rental agreement terms.",
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md px-[21px] pb-[24px] pt-[11px]">
        <div className="flex items-center space-x-[15px]">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-[16.67px] h-[8.33px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <span className="text-[#333333] font-medium text-[13.2px]">
            Purchase Overview{" "}
          </span>
        </div>
      </div>
      <div className="w-full max-w-md px-[21px] pb-[75px]">
        {/* Header (image + host avatar) */}
        <div className="relative overflow-visible">
          <div className="rounded-[5px] overflow-hidden h-[172px] relative">
            <img
              src={lodge.image}
              alt={lodge.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <img
            src="/images/guest.jpg"
            alt="Host"
            className="absolute left-1 bottom-0 transform translate-y-1/2 w-[50px] h-[50px] rounded-full z-10"
          />
        </div>

        {/* Info card */}
        <div className="pt-[28px] pb-[15px] px-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-[12px] font-medium text-[#333333]">
                Paul Ayodamola
              </h2>

              <div className="flex items-center text-sm text-black font-medium mt-[6px]">
                <img
                  src="/icons/tick-black.svg"
                  alt="Verified"
                  className="w-4 h-4 mr-1"
                />
                <span>{lodge.title}</span>
              </div>

              <p className="text-[12px] text-[#333333] mt-1">
                {lodge.location}
              </p>
            </div>

            {/* Status + Price */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-8">
                <img
                  src="/icons/star-gray.svg"
                  alt="star"
                  className="w-[12px] h-[12px]"
                />
                <p className="text-[10px] text-[#666666] font-medium">4.0</p>
              </div>
              <p className="text-[14px] font-semibold">{lodge.price}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050] mb-[50px]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking Date</span>
              <span>{lodge.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Check in</span>
              <span>{lodge.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span>Check out</span>
              <span>{lodge.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{lodge.duration}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-[5px] py-[10px] px-[6px] text-[13px] text-[#505050]">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Booking fee paid</span>
              <span>{lodge.feePaid}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Deposit</span>
              <span>{lodge.deposit}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience Fee</span>
              <span>{lodge.convenience}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount Paid</span>
              <span>{lodge.total}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-[42px]">
        <Link to="/id-check">
          <button className="border border-[#E9E9E9] w-[334px] h-[57px] hover:bg-gray-300 bg-[#A20BA2]  text-white rounded-[10px] py-4 text-[16px] font-semibold">
            Make Payment Now
          </button>
        </Link>
      </div>
    </div>
  );
}
