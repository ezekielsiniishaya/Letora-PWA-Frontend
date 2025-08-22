import React from "react";

export default function ApartmentCard({ apt }) {
  return (
    <div className="bg-white rounded-[5px] p-[8px] flex gap-3">
      {/* Image */}
      <img
        src={apt.image}
        alt={apt.title}
        className="w-[97px] h-[86px] rounded-[2.3px] object-cover"
      />

      {/* Info */}
      <div className="flex-1 mt-[12px] flex-col">
        {/* Top row: tick + title + rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img
              src="/icons/tick-black.svg"
              alt="Verified"
              className="w-[14px] h-[14px]"
            />
            <h2 className="text-[13px] font-medium text-[#333333]">
              {apt.title}
            </h2>
          </div>
          <div className="flex items-center text-[10px] font-medium text-[#666666]">
            <img
              src="/icons/star-gray.svg"
              alt="Rating"
              className="w-[14px] h-[14px] mr-1"
            />
            <span>{apt.rating}</span>
          </div>
        </div>

        {/* Location row */}
        <div className="flex items-center mt-[7px] gap-1 text-[11px] text-[#333333]">
          <img
            src="/icons/location.svg"
            alt="Location"
            className="w-[11px] h-[13px]"
          />
          <span>{apt.location}</span>
        </div>

        {/* Bottom row: circles + liked / price */}
        <div className="flex items-center mt-[7.5px] justify-between text-[12px] text-[#505050]">
          {/* Circles + liked */}
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#008751" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#F711F7" }}
              ></div>
            </div>
            <span>+{apt.likes} people liked this</span>
          </div>

          {/* Price */}
          <span className="font-semibold text-[12px] text-[#333333]">
            {apt.price}
          </span>
        </div>
      </div>
    </div>
  );
}
