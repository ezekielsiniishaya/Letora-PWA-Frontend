import React, { useState } from "react";

const ApartmentSlider = ({ apartments, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === apartments.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? apartments.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {apartments.map((apartment, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="relative h-32">
                <img
                  src={apartment.image}
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all">
                  <Heart size={12} className="text-white" />
                </button>
                {apartment.verified && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {apartment.featured && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {apartment.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  📍 {apartment.location}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {apartment.rating}
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({apartment.reviews})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-800">
                      {apartment.price}
                    </span>
                    <span className="text-gray-500 text-sm">/night</span>
                  </div>
                </div>
                {apartment.amenities && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {apartment.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {apartment.amenities.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{apartment.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {apartments.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots indicator */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {apartments.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApartmentSlider;
