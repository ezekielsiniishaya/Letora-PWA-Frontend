import { ArrowLeft } from "lucide-react";

export default function ApartmentAvailability() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md px-4 py-3 flex items-center space-x-2 bg-white shadow-sm">
        <button>
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <h1 className="font-medium text-gray-800">Apartment Availability</h1>
      </div>

      {/* Request Info */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm mt-6 px-4 py-5 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-fuchsia-600 overflow-hidden mb-3">
          <img
            src="/images/user-avatar.jpg"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-gray-700 text-sm leading-relaxed">
          <span className="font-semibold">Ogundele</span> is interested in
          renting this shortlet space. Do confirm if this apartment is available
          or not.
        </p>
      </div>

      {/* Apartment Info */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
        <img
          src="/images/apartment.jpg"
          alt="Apartment"
          className="w-full h-52 object-cover"
        />
        <div className="p-4 text-center">
          <h2 className="font-semibold text-lg text-gray-900">
            Exquisite Three Bedroom Apartment
          </h2>
          <p className="text-gray-500 text-sm mt-1">Maryland, Lagos</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md px-4 mt-8 flex flex-col space-y-3">
        <button className="w-full py-3 bg-white border border-gray-300 text-gray-800 rounded-lg font-medium">
          Not Available
        </button>
        <button className="w-full py-3 bg-fuchsia-600 text-white rounded-lg font-medium">
          Yes it’s Available
        </button>
      </div>
    </div>
  );
}
