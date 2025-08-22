import ApartmentSlider from "../../components/dashboard/ApartmentSlider";

// Main Hotel Booking App Component
const HotelBookingApp = () => {
  // Sample apartment data for the slider
  const hotApartments = [
    {
      id: 1,
      title: "2-Bedroom Apartment",
      location: "Lekki, Lagos",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      price: "₦30,000",
      rating: 4.5,
      reviews: 12,
      verified: true,
      featured: false,
      amenities: ["WiFi", "AC", "Kitchen", "Parking"],
    },
    {
      id: 2,
      title: "Entire Apartment",
      location: "Victoria Island, Lagos",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      price: "₦45,000",
      rating: 4.8,
      reviews: 28,
      verified: false,
      featured: true,
      amenities: ["Pool", "Gym", "WiFi", "Balcony", "Security"],
    },
    {
      id: 3,
      title: "Studio Apartment",
      location: "Ikeja, Lagos",
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
      price: "₦25,000",
      rating: 4.2,
      reviews: 8,
      verified: true,
      featured: false,
      amenities: ["WiFi", "AC", "Workspace"],
    },
    {
      id: 4,
      title: "Luxury Penthouse",
      location: "Banana Island, Lagos",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      price: "₦85,000",
      rating: 4.9,
      reviews: 45,
      verified: true,
      featured: true,
      amenities: ["Pool", "Gym", "Concierge", "Spa", "Rooftop"],
    },
  ];

  const bookingData = {
    name: "Paul Ayodamola",
    balance: "₦569,098.897",
    booking: {
      type: "2-Bedroom Apartment",
      location: "Lekki, Lagos",
      checkIn: "30-Nov-2025",
      checkOut: "30-Dec-2026",
      status: "Ongoing",
    },
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-purple-600 text-white text-sm">
        <div className="flex items-center space-x-1">
          <span>9:41</span>
        </div>
        <div className="flex items-center space-x-1">
          <Signal size={16} />
          <Wifi size={16} />
          <Battery size={16} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h2 className="font-semibold">{bookingData.name}</h2>
              <p className="text-purple-200 text-sm">Good morning</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white">🔍</span>
            </div>
            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center relative">
              <span className="text-white">🔔</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-purple-200 text-sm">Current Balance</span>
            <div className="w-4 h-4 bg-purple-700 rounded-full flex items-center justify-center">
              <span className="text-xs">?</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">{bookingData.balance}</h1>
        </div>

        <button className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
          <span>↗</span>
          <span>Withdraw</span>
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* My Booking Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">My Booking 🏨</h3>
            <button className="text-purple-600 text-sm font-medium">
              See all
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex space-x-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
                  alt="Current booking"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {bookingData.booking.type}
                  </h4>
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
                    {bookingData.booking.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  📍 {bookingData.booking.location}
                </p>
                <div className="flex text-xs text-gray-500 space-x-4">
                  <div>
                    <span className="block">Check-in</span>
                    <span>{bookingData.booking.checkIn}</span>
                  </div>
                  <div>
                    <span className="block">Check-Out</span>
                    <span>{bookingData.booking.checkOut}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm">
                Cancel Booking
              </button>
              <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm">
                View Booking
              </button>
            </div>
          </div>
        </div>

        {/* Hot Apartments Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Hot Apartments 🔥</h3>
            <button className="text-purple-600 text-sm font-medium">
              See all
            </button>
          </div>                        

          <div className="pb-8">
            <ApartmentSlider apartments={hotApartments} className="w-full" />
          </div>
        </div>

        {/* Become a Host Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">Become a Host</h3>
          <p className="text-purple-100 text-sm mb-3">
            Ready to earn extra with your space? Verify your identity and start
            hosting
          </p>
          <button className="text-purple-200 text-sm underline">
            Click here to begin
          </button>
          <div className="absolute right-4 bottom-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">👩‍💼</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingApp;
