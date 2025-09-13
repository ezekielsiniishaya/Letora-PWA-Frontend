import { useNavigate} from "react-router-dom";
import { useState } from "react";
import Button from "../../components/Button";
import ShowSuccess from "../../components/ShowSuccess";
import Header2 from "../../components/Header2";
export default function EditProfilePage() {
  const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();
  const handleSave = () => {
    // open the success modal
    setShowModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* Top Header */}
      <Header2 title="Edit Profile" />
      {/* Profile Image */}
      <div className="flex flex-col items-center mt-6 relative">
        <div className="relative">
          <img
            src="/images/guest.jpg"
            alt="Profile"
            className="w-[73px] h-[73px] rounded-full object-cover"
          />
          <label className="absolute bottom-0 bg-[#A20BA2] right-[3%] w-[20.17px] h-[20.17px] rounded-full flex items-center justify-center">
            <img
              src="/icons/camera-purple.svg"
              alt="Change profile picture"
              className="w-[12.04px] object-cover h-[12.04px]"
            />
            <input type="file" className="hidden" />
          </label>
        </div>
        {/* Name under the image */}
        <p className="mt-[12px] text-14 font-medium text-[#333333]">
          Mandy Jane
        </p>
      </div>

      {/* Form */}
      <div className="px-5 mt-6 flex-1">
        <form className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-[14px] text-[#686464] font-medium">
              First Name<span className="text-red-500 mr-1">*</span>
            </label>
            <input
              type="text"
              className="mt-2 border w-full h-[48px] text-[#807F7F] rounded-md px-3 text-[14px]"
              placeholder="Mandy"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-[#686464] font-medium">
              Last Name<span className="text-red-500 mr-1">*</span>
            </label>
            <input
              type="text"
              className="mt-2 border w-full h-[48px] rounded-md px-3 text-[#807F7F] text-[14px]"
              placeholder="Jane"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm text-[#686464] font-medium">
              Phone Number<span className="text-red-500 mr-1">*</span>
            </label>
            <div className="flex items-center mt-2 border rounded-md h-[48px] px-3 bg-white">
              <div
                className="w-5 h-5 rounded-full mr-2"
                style={{
                  background:
                    "linear-gradient(to right, #008751 33%, #F5F5F5 33%, #F5F5F5 66%, #008751 66%)",
                }}
              ></div>
              <span className="text-sm text-[#666666] mr-2">+234</span>
              <input
                type="tel"
                className="flex-1 outline-none bg-white text-sm"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Alternate Phone Number */}
          <div>
            <label className="block text-sm text-[#686464] font-medium">
              Alternate Phone
            </label>
            <div className="flex mt-2 items-center border rounded-md h-[48px] px-3 bg-white">
              <div
                className="w-5 h-5 rounded-full mr-2"
                style={{
                  background:
                    "linear-gradient(to right, #008751 33%, #F5F5F5 33%, #F5F5F5 66%, #008751 66%)",
                }}
              ></div>
              <span className="text-sm text-[#666666] mr-2">+234</span>
              <input
                type="tel"
                className="flex-1 outline-none bg-white text-sm"
                placeholder="Enter alternate phone"
              />
            </div>
          </div>

          {/* Gender & DOB (non-editable) */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-[#686464] font-medium">
                Gender<span className="text-red-500 mr-1">*</span>
              </label>
              <input
                value="Male"
                disabled
                className="mt-2 border w-full h-[48px] rounded-md px-3 text-sm bg-white text-[#807F7F]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-[#686464] font-medium">
                Date of Birth<span className="text-red-500 mr-1">*</span>
              </label>
              <input
                value="14-Dec-2000"
                disabled
                className="mt-2 border w-full h-[48px] rounded-md px-3 text-[14px] bg-white text-[#807F7F]"
              />
            </div>
          </div>

          {/* Nationality (non-editable) */}
          <div>
            <label className="block text-sm text-[#686464] font-medium">
              Nationality
            </label>
            <input
              value="Nigerian"
              disabled
              className="mt-2 border w-full h-[48px] rounded-md px-3 text-sm bg-white text-[#686464]"
            />
          </div>

          {/* State (non-editable) */}
          <div>
            <label className="block text-sm text-[#686464] font-medium">
              State
            </label>
            <input
              value="Lagos"
              disabled
              className="mt-2 border w-full h-[48px] rounded-md px-3 text-sm bg-white text-[#686464]"
            />
          </div>

          {/* Upload Means of Identification */}
          <div>
            <label className="block text-sm text-[#686464] font-medium mb-2">
              Upload Means of Identification
            </label>
            <div className="flex space-x-3">
              {/* First box with uploaded placeholder */}
              <div className="w-[104px] h-[104px] border rounded-md flex items-center justify-center bg-white relative">
                <img
                  src="/icons/gallery.svg"
                  alt="ID"
                  className="w-6 h-6 opacity-70"
                />
              </div>
              {/* Add new document */}
              <button
                type="button"
                className="w-[104px] h-[104px] border rounded-md flex items-center justify-center bg-white"
              >
                <span className="text-2xl text-[#0D132180]">+</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Save Button */}
      {/* Save Button */}
      <div className="px-5 py-6">
        <Button text="Save Changes" onClick={handleSave} />
      </div>

      {/* ✅ Success Popup */}
      {showModal && (
        <ShowSuccess
          image="/icons/success.svg"
          heading="Change successful"
          message=" "
          buttonText="Okay"
          onClose={() => navigate("/profile")}
        />
      )}
    </div>
  );
}
