import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCategoriesList } from "../../Redux/Slices/listSlice";
import { toast } from "sonner";
import { registerVendor } from "../../Redux/Slices/authSlice";
import HomeLayout from "../../Layout/HomeLayout";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const categoriesList = useSelector((state) => state?.list?.categoriesList);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [vendorData, setVendorData] = useState({
    fullName: "",
    vendorEmail: "",
    phoneNumber: "",
    shopName: "",
    fullAddress: "",
    vendorPassword: "",
    confirmPassword: "",
    nearByLocation: "",
    iframe: "",
    categoryIds: [],
    vendorImage: null,
    logo: null,
    description: "",
    youtubeUrl: "",
    discount: "",
  });

  const [imagePreviews, setImagePreviews] = useState({
    vendorImage: null,
    logo: null,
  });

  console.log(imagePreviews);

  const profileImageRef = useRef(null);
  const shopLogoRef = useRef(null);

  const loadData = async (page = 1) => {
    try {
      const params = {
        page,
        limit: 1000,
      };
      await dispatch(getCategoriesList(params)).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value.split(",");
    if (!selectedCategories.includes(category[0]) && category[0]) {
      setSelectedCategories([...selectedCategories, e.target.value]);
    }

    setVendorData((prevData) => {
      const updatedCategoryIds = new Set([
        ...prevData.categoryIds,
        category[1],
      ]);
      return {
        ...prevData,
        categoryIds: Array.from(updatedCategoryIds),
      };
    });
  };

  const removeCategory = (categoryToRemove) => {
    setSelectedCategories(
      selectedCategories.filter((category) => category !== categoryToRemove)
    );

    setVendorData((prevData) => {
      const updatedCategoryIds = prevData.categoryIds.filter(
        (id) => id !== categoryToRemove.split(",")[1]
      );
      return {
        ...prevData,
        categoryIds: Array.from(updatedCategoryIds),
      };
    });
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setVendorData({
      ...vendorData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setVendorData((prevData) => ({
      ...prevData,
      [name]: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => ({
          ...prevPreviews,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field) => {
    setVendorData((prevData) => ({
      ...prevData,
      [field]: null,
    }));
    setImagePreviews((prevPreviews) => ({
      ...prevPreviews,
      [field]: null,
    }));

    if (field === "vendorImage") {
      profileImageRef.current.value = "";
    } else if (field === "logo") {
      shopLogoRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      fullName,
      vendorEmail,
      phoneNumber,
      shopName,
      fullAddress,
      vendorPassword,
      confirmPassword,
      nearByLocation,
      iframe,
      categoryIds,
      discount,
      description,
      youtubeUrl,
    } = vendorData;

    if (
      !fullName ||
      !vendorEmail ||
      !phoneNumber ||
      !shopName ||
      !fullAddress ||
      !vendorPassword ||
      !confirmPassword ||
      !nearByLocation ||
      !iframe ||
      !categoryIds ||
      !discount ||
      !description ||
      !youtubeUrl
    ) {
      return toast.error("All fields are required");
    }

    if (vendorPassword !== confirmPassword) {
      return toast.error("Password doesn't match");
    }

    console.log(vendorData);

    const formData = new FormData();
    formData.append("fullName", vendorData.fullName);
    formData.append("vendorEmail", vendorData.vendorEmail);
    formData.append("phoneNumber", vendorData.phoneNumber);
    formData.append("shopName", vendorData.shopName);
    formData.append("fullAddress", vendorData.fullAddress);
    formData.append("vendorPassword", vendorData.vendorPassword);
    formData.append("nearByLocation", vendorData.nearByLocation);
    formData.append("iframe", vendorData.iframe);
    formData.append("vendorImage", vendorData.vendorImage);
    formData.append("logo", vendorData.logo);
    formData.append("discountProvidedByVendor", vendorData.discount);
    formData.append("youTubeLink", vendorData.youtubeUrl);
    formData.append("description", vendorData.description);

    categoryIds.forEach((id) => formData.append("categoryIds[]", id));

    console.log("field", formData);
    const res = await dispatch(registerVendor(formData));

    if (res?.payload?.success) {
      setVendorData({
        fullName: "",
        vendorEmail: "",
        phoneNumber: "",
        shopName: "",
        fullAddress: "",
        vendorPassword: "",
        confirmPassword: "",
        nearByLocation: "",
        iframe: "",
        categoryIds: [],
        vendorImage: null,
        logo: null,
      });
      setSelectedCategories([]);
      setImagePreviews({
        vendorImage: null,
        logo: null,
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="flex flex-wrap text-white">
        {/* Profile Image */}
        <div className="w-full sm:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="vendorImage" className="mb-1 text-gray-300">
              Profile Image
            </label>
            <input
              type="file"
              className="bg-[#1D222B] rounded leading-10 focus:outline-none border border-borderDark"
              id="vendorImage"
              name="vendorImage"
              onChange={handleFileChange}
              ref={profileImageRef}
            />
            {imagePreviews.vendorImage && (
              <div className="relative mt-2">
                <img
                  src={imagePreviews.vendorImage}
                  alt="Profile Preview"
                  className="rounded"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <button
                  type="button"
                  onClick={() => removeImage("vendorImage")}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Shop Logo */}
        <div className="w-full sm:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="logo" className="mb-1 text-gray-300">
              Shop Logo
            </label>
            <input
              type="file"
              className="bg-[#1D222B] rounded leading-10 focus:outline-none border border-borderDark"
              id="logo"
              name="logo"
              onChange={handleFileChange}
              ref={shopLogoRef}
            />
            {imagePreviews.logo && (
              <div className="relative mt-2">
                <img
                  src={imagePreviews.logo}
                  alt="Shop Logo Preview"
                  className="rounded"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <button
                  type="button"
                  onClick={() => removeImage("logo")}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="fullName" className="mb-1 text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="fullName"
              name="fullName"
              placeholder="Your First Name"
              onChange={handleUserInput}
              value={vendorData.fullName}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="shopName" className="mb-1 text-gray-300">
              Shop Name
            </label>
            <input
              type="text"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="shopName"
              name="shopName"
              placeholder="Your Shop Name"
              onChange={handleUserInput}
              value={vendorData.shopName}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="vendorEmail" className="mb-1 text-gray-300">
              Vendor Email
            </label>
            <input
              type="email"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="vendorEmail"
              name="vendorEmail"
              placeholder="Email"
              onChange={handleUserInput}
              value={vendorData.vendorEmail}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="phoneNumber" className="mb-1 text-gray-300">
              Phone number
            </label>
            <input
              type="number"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone number"
              onChange={handleUserInput}
              value={vendorData.phoneNumber}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="fullAddress" className="mb-1 text-gray-300">
              Full Address
            </label>
            <textarea
              type="text"
              rows={2}
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark resize-none "
              id="fullAddress"
              name="fullAddress"
              placeholder="Vendor Address"
              onChange={handleUserInput}
              value={vendorData.fullAddress}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="nearByLocation" className="mb-1 text-gray-300">
              Near by location
            </label>
            <input
              type="text"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="nearByLocation"
              name="nearByLocation"
              placeholder="Shop near by location"
              onChange={handleUserInput}
              value={vendorData.nearByLocation}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="vendorPassword" className="mb-1 text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="vendorPassword"
              name="vendorPassword"
              placeholder="Password"
              onChange={handleUserInput}
              value={vendorData.vendorPassword}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-4">
            <label htmlFor="confirmPassword" className="mb-1 text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              className="bg-[#1D222B]   rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleUserInput}
              value={vendorData.confirmPassword}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="discount" className="mb-1 text-gray-300">
              Discount
            </label>
            <input
              type="text"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="discount"
              name="discount"
              placeholder="Vendor Discount"
              onChange={handleUserInput}
              value={vendorData.discount}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col mx-2 mb-3">
            <label htmlFor="Youtube Link" className="mb-1 text-gray-300">
              Youtube Link
            </label>
            <input
              type="text"
              className="bg-[#1D222B]  rounded  leading-10 px-4 focus:outline-none border border-borderDark "
              id="youtubeUrl"
              name="youtubeUrl"
              placeholder="Enter Youtube Url"
              onChange={handleUserInput}
              value={vendorData.youtubeUrl}
            />
          </div>
        </div>
        <div className="w-full ">
          <div className="flex flex-col mx-2 mb-4">
            <label htmlFor="iframe" className="mb-1 text-gray-300">
              MAP i-frame
            </label>
            <textarea
              type="text"
              rows={2}
              className="bg-[#1D222B] resize-none   rounded  leading-10 px-4 focus:outline-none  border border-borderDark "
              id="iframe"
              name="iframe"
              placeholder="Map i-frame"
              onChange={handleUserInput}
              value={vendorData.iframe}
            />
          </div>
        </div>

        <div className="w-full ">
          <div className="flex flex-col mx-2 mb-4">
            <label htmlFor="iframe" className="mb-1 text-gray-300">
              Shop Description
            </label>
            <textarea
              type="text"
              rows={2}
              className="bg-[#1D222B] resize-none   rounded  leading-10 px-4 focus:outline-none  border border-borderDark "
              id="description"
              name="description"
              placeholder="Enter Description"
              onChange={handleUserInput}
              value={vendorData.description}
            />
          </div>
        </div>

        <div className="w-full mx-2 mb-4 text-white">
          <div className="w-full">
            <label htmlFor="iframe" className="mb-2 text-gray-300">
              Select Categories
            </label>
            <select
              id="categories"
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              className="w-full mt-1 p-2 border border-borderDark rounded-md focus:outline-none  scrollbar-thin
                            bg-[rgb(29,34,43)]
                            h-[6rem]  scrollbar-track-gray-800 scrollbar-thumb-gray-400"
            >
              {categoriesList?.map((category, index) => (
                <option
                  className="p-1 my-[0.1rem] rounded capitalize"
                  key={index}
                  value={[category.categoryName, category._id]}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2">
            {selectedCategories.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center select-none capitalize px-2.5 py-1 rounded-full text-sm font-medium bg-indigo-50 border-2W border-blue-500 text-indigo-800 mr-2 mb-2"
              >
                {category.split(",")[0]}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="inline-flex ml-1 text-indigo-400 focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 text-white bg-[#6761D9] rounded px-7"
      >
        Register Vendor
      </button>
    </form>
  );
};

const RegisterVendor = () => {
  return (
    <HomeLayout>
      <section className="flex items-center py-10 overflow-hidden bg-transparent ezy__signup1 md:w-custom light text-zinc-900">
        <div className="container px-4 mx-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="p-4 relative shadow-xl overflow-hidden pt-20 bg-[#1c202a] border border-borderDark rounded-xl">
                <h2 className="absolute top-0 left-0 w-full p-[0.4rem] mb-3 text-[1.35rem] bg-[#D04848] font-[400] text-center text-white md:mb-12">
                  Register Vendor
                </h2>

                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
};

export default RegisterVendor;
