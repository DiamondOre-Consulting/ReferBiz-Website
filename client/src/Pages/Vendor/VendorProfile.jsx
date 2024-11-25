import HomeLayout from "../../Layout/HomeLayout";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { userProfile } from "../../Redux/Slices/vendorSlice";

export const VendorProfile = () => {
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    await dispatch(userProfile());
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const [formData, setFormData] = useState({
    shopName: "",
    fullAddress: "",
    phoneNumber: "",
    fullName: "",
    vendorImage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      vendorImage: e.target.files[0],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formPayload = new FormData();
    formPayload.append("shopName", formData.shopName);
    formPayload.append("fullAddress", formData.fullAddress);
    formPayload.append("phoneNumber", formData.phoneNumber);
    formPayload.append("fullName", formData.fullName);
    if (formData.vendorImage) {
      formPayload.append("vendorImage", formData.vendorImage);
    }
  };
  return (
    <>
      <HomeLayout>
        <div className="text-gray-300 text-3xl py-2 text-center font-bold">
          Vendor Profile
        </div>
        <div className="max-w-md mx-auto p-4 bg-  shadow-xl rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Update Profile
          </h2>

          {successMessage && (
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-center mb-4">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email (Read-only) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value="piyushguptaji123"
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Shop Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder="Enter Shop Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Full Address */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Full Address
              </label>
              <textarea
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleInputChange}
                placeholder="Enter Full Address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows="3"
              />
            </div>

            {/* Vendor Image */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Vendor Image
              </label>
              <input
                type="file"
                name="vendorImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </HomeLayout>
    </>
  );
};
