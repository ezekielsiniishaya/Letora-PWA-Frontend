import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import ShowSuccess from "../../components/ShowSuccess";
import Header2 from "../../components/Header2";
import { useUser } from "../../hooks/useUser";
import { updateUserProfile } from "../../services/userApi";

export default function EditProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    alternatePhone: "",
    dateOfBirth: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [idDocuments, setIdDocuments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  // Check if user has existing date of birth
  const hasExistingDOB = user?.dateOfBirth;

  // Populate form with user data from context
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phone || "",
        alternatePhone: user.phone2 || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      setProfileImage(user.profilePic || "/images/profile-image.png");
      setIdDocuments(user.idDocuments || []);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
      }));
    }
  };

  // Format date of birth from backend
  const formatDateOfBirth = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Max 2 documents
  const MAX_DOCUMENTS = 2;

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const availableSlots = MAX_DOCUMENTS - idDocuments.length;
      const filesToAdd = files.slice(0, availableSlots);

      const newDocuments = filesToAdd.map((file) => {
        // Determine document type based on file type
        const documentType = file.type.includes("pdf")
          ? "ID_CARD"
          : "ID_PHOTOGRAPH";

        return {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          documentType: documentType,
        };
      });

      setIdDocuments((prev) => [...prev, ...newDocuments]);

      if (files.length > availableSlots) {
        alert(`You can only upload up to ${MAX_DOCUMENTS} documents`);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      // Prepare user data - use exact field names backend expects
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        phone2: formData.alternatePhone,
      };

      // Add dateOfBirth only if setting for first time
      if (!hasExistingDOB && formData.dateOfBirth) {
        userData.dateOfBirth = formData.dateOfBirth;
      }

      // Create FormData for file upload
      const submitFormData = new FormData();

      // Append user data as JSON string
      submitFormData.append("userData", JSON.stringify(userData));

      // Append profile image if selected
      if (formData.profileImageFile) {
        submitFormData.append("profilePic", formData.profileImageFile); // Use "profilePic" to match backend
        console.log(
          "✅ Profile image appended to FormData:",
          formData.profileImageFile.name
        );
      }

      // Append documents if user is host and has documents
      if (isHost && idDocuments.length > 0) {
        idDocuments.forEach((doc) => {
          if (doc.file) {
            submitFormData.append("documents", doc.file);
            submitFormData.append("documentTypes", doc.documentType);
          }
        });

        // Add verificationDocuments metadata for backend processing
        const verificationDocuments = idDocuments.map((doc) => ({
          type: doc.documentType,
          name: doc.name || doc.file.name,
        }));
        submitFormData.append(
          "verificationDocuments",
          JSON.stringify(verificationDocuments)
        );
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let pair of submitFormData.entries()) {
        if (pair[0] === "userData" || pair[0] === "verificationDocuments") {
          console.log(pair[0] + ":", JSON.parse(pair[1]));
        } else if (pair[0] === "profilePic" || pair[0] === "documents") {
          console.log(
            pair[0] + ":",
            pair[1].name,
            pair[1].type,
            pair[1].size + " bytes"
          );
        } else {
          console.log(pair[0] + ":", pair[1]);
        }
      }

      // Create a custom API function for FormData upload
      const response = await updateUserProfile(submitFormData);

      if (response) {
        // Update user context
        if (updateUser) {
          updateUser({
            ...user,
            ...userData,
            ...(!hasExistingDOB && { dateOfBirth: formData.dateOfBirth }),
            profilePic: profileImage,
            idDocuments: idDocuments,
          });
        }

        setShowModal(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const removeDocument = (index) => {
    setIdDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Show loading state for user data
  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  // Check if user is a host (you might need to adjust this based on your user role structure)
  const isHost = user?.role === "host" || user?.hostProfile; // Adjust based on your user structure

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* Top Header */}
      <Header2 title="Edit Profile" />

      {/* Profile Image */}
      <div className="flex flex-col items-center mt-6 relative">
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-[73px] h-[73px] rounded-full object-cover"
          />
          <label className="absolute bottom-0 bg-[#A20BA2] right-[3%] w-[20.17px] h-[20.17px] rounded-full flex items-center justify-center cursor-pointer">
            <img
              src="/icons/camera-purple.svg"
              alt="Change profile picture"
              className="w-[12.04px] object-cover h-[12.04px]"
            />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </label>
        </div>
        {/* Name under the image */}
        <p className="mt-[12px] text-14 font-medium text-[#333333]">
          {user.firstName} {user.lastName}
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
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
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
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
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
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
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
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleInputChange}
                className="flex-1 outline-none bg-white text-sm"
                placeholder="Enter alternate phone"
              />
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-[#686464] font-medium">
                Gender<span className="text-red-500 mr-1">*</span>
              </label>
              <input
                value={user.gender || "Male"}
                disabled
                className="mt-2 border w-full h-[48px] rounded-md px-3 text-sm bg-white text-[#807F7F]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-[#686464] font-medium">
                Date of Birth<span className="text-red-500 mr-1">*</span>
              </label>
              {hasExistingDOB ? (
                // Show disabled input if DOB already exists
                <input
                  value={formatDateOfBirth(user.dateOfBirth)}
                  disabled
                  className="mt-2 border w-full h-[48px] rounded-md px-3 text-[14px] bg-white text-[#807F7F]"
                />
              ) : (
                // Show date input if no DOB exists
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-2 border w-full h-[48px] rounded-md px-3 text-[14px] bg-white text-[#807F7F]"
                />
              )}
            </div>
          </div>

          {/* Nationality (non-editable) */}
          <div>
            <label className="block text-sm text-[#686464] font-medium">
              Nationality
            </label>
            <input
              value={user.nationality || "Nigerian"}
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
              value={user.state || "Lagos"}
              disabled
              className="mt-2 border w-full h-[48px] rounded-md px-3 text-sm bg-white text-[#686464]"
            />
          </div>
          {/* Upload Means of Identification - Only show for hosts */}
          {isHost && (
            <div>
              <label className="block text-sm text-[#686464] font-medium mb-5">
                Upload Means of Identification
              </label>

              <div className="flex space-x-3 flex-wrap">
                {/* Existing documents - show appropriate icon based on file type */}

                {idDocuments.map((doc, index) => (
                  <div key={index} className="relative">
                    <div className="w-[104px] h-[104px] border rounded-md flex flex-col items-center justify-center bg-white relative mb-2 p-2">
                      {doc.documentType === "ID_CARD" ? (
                        <img
                          src="/icons/pdf.svg"
                          alt="ID Card Document"
                          className="w-8 h-8 mb-1"
                        />
                      ) : (
                        <img
                          src="/icons/camera.svg"
                          alt="ID Photograph"
                          className="w-8 h-8 mb-1"
                        />
                      )}
                      <span className="text-xs text-center text-[#807F7F] px-1 truncate w-full">
                        {doc.name && doc.name.length > 12
                          ? `${doc.name.substring(0, 10)}...`
                          : doc.name || `Document ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add new document button - only show if under max limit */}
                {idDocuments.length < MAX_DOCUMENTS && (
                  <label className="w-[104px] h-[104px] border rounded-md flex items-center justify-center bg-white cursor-pointer mb-2">
                    <span className="text-2xl text-[#0D132180]">+</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-5">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center">
              <img
                src="/icons/error.svg"
                alt="Error"
                className="w-4 h-4 mr-2"
              />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="px-5 py-6">
        <Button
          text={loading ? "Saving..." : "Save Changes"}
          onClick={handleSave}
          disabled={loading}
        />
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
