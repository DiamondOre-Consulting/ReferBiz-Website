import HomeLayout from "../../Layout/HomeLayout";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { editVendorProfile } from "../../Redux/Slices/vendorSlice";
import { userProfile } from "../../Redux/Slices/vendorSlice";
import { toast } from "sonner";

export const VendorProfile = () => {
  const dispatch = useDispatch();
  const vendorData = useSelector((state) => state?.vendor?.vendorProfile);
  console.log("vendor", vendorData);

  const [formData, setFormData] = useState({
    shopName: vendorData?.shopName || "",
    fullAddress: vendorData?.fullAddress || "",
    phoneNumber: vendorData?.phoneNumber || "",
    fullName: vendorData?.fullName || "",
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
  const fetchProfile = async () => {
    await dispatch(userProfile());
  };

  useEffect(() => {
    fetchProfile();
  }, []);
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
    if (
      !formData.shopName ||
      !formData.fullAddress ||
      !formData.phoneNumber ||
      !formData.fullName
    ) {
      return toast.error("All fields are required");
    }
    if (formData.phoneNumber.length != 10) {
      return toast.error("Please enter 10 digit Number");
    }

    const formPayload = new FormData();
    formPayload.append("shopName", formData.shopName);
    formPayload.append("fullAddress", formData.fullAddress);
    formPayload.append("phoneNumber", formData.phoneNumber);
    formPayload.append("fullName", formData.fullName);
    if (formData.vendorImage) {
      formPayload.append("vendorImage", formData.vendorImage);
    }
    const response = await dispatch(
      editVendorProfile([vendorData?._id, formPayload])
    );

    if (response?.payload?.success) {
      dispatch(userProfile());
      toast.success("Profile Updated !!");
    } else {
      console.log("unscress");
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <HomeLayout>
        <div className="text-gray-300 text-3xl py-2 text-center font-bold">
          Vendor Profile
        </div>
        <div className="max-w-4xl mx-auto p-4 bg-gray-800 shadow-3xl rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Email (Read-only) */}
            <div className="mb-4">
              <label className="block text-gray-400 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={vendorData?.vendorEmail}
                disabled
                className="w-full px-4 py-2 border border-gray-300 bg-transparent text-gray-400 rounded-lg bg-gray-100"
              />
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-400 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter Full Name"
                className="w-full px-4 py-2 border border-gray-300 bg-transparent text-gray-400 rounded-lg bg-gray-100"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-400 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className="w-full px-4 py-2 border border-gray-300 bg-transparent text-gray-400 rounded-lg bg-gray-100"
              />
            </div>

            {/* Shop Name */}
            <div className="mb-4">
              <label className="block text-gray-400 font-medium mb-2">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder="Enter Shop Name"
                className="w-full px-4 py-2 border border-gray-300 bg-transparent text-gray-400 rounded-lg bg-gray-100"
              />
            </div>

            {/* Full Address */}
            <div className="mb-4">
              <label className="block text-gray-400 font-medium mb-2">
                Full Address
              </label>
              <textarea
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleInputChange}
                placeholder="Enter Full Address"
                className="w-full px-4 py-2 border border-gray-300 bg-transparent text-gray-400 rounded-lg bg-gray-100"
                rows="3"
              />
            </div>

            {/* Vendor Image */}
            <div className="mb-4">
              <label className="block text-gray-400 font-medium mb-2">
                Vendor Image
              </label>
              <input
                type="file"
                name="vendorImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 bg-transparent text-gray-400 rounded-lg bg-gray-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              // disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>
        </div>
      </HomeLayout>
    </>
  );
};
