import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HomeLayout from "../Layout/HomeLayout";
// import { toast } from "sonner";
import {
  getVendorDetail,
  updateVendor,
  getCategoriesList,
} from "../Redux/Slices/listSlice";

const VendorDetail = () => {
  const [loaderActive, setLoaderActive] = useState(false);
  const categoriesList = useSelector((state) => state?.list?.categoriesList);

  const [viewingImage, setViewingImage] = useState(null);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const vendor = useSelector((state) => state?.list?.vendorData);
  console.log("id", vendor);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [vendorData, setVendorData] = useState({
    fullName: vendor?.fullName || "",
    vendorEmail: vendor?.vendorEmail || "",
    phoneNumber: vendor?.phoneNumber || "",
    shopName: vendor?.shopName || "",
    fullAddress: vendor?.fullAddress || "",
    nearByLocation: vendor?.nearByLocation || "",
    iframe: vendor?.nearByLocation || "",
    categoryIds: [],
    vendorImage: null,
    logo: null,
    description: vendor?.description || "",
    youtubeUrl: vendor?.youTubeLink || "",
    discount: vendor?.discountProvidedByVendor || "",
  });

  console.log("vendor?.fullName", vendor?.fullName);

  const dispatch = useDispatch();
  const { id } = useParams();
  const loadData = async () => {
    setLoaderActive(true);
    const res = await dispatch(getVendorDetail(id)).finally(() =>
      setLoaderActive(false)
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  console.log(vendorData);

  useEffect(() => {
    if (statusUpdated) {
      loadData();
      setStatusUpdated(false);
    }
  }, [statusUpdated]);

  const [imagePreviews, setImagePreviews] = useState({
    vendorImage: null,
    logo: null,
  });

  console.log(imagePreviews);

  const profileImageRef = useRef(null);
  const shopLogoRef = useRef(null);

  const loadgetCategoriesList = async (page = 1) => {
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
    loadgetCategoriesList();
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
    setIsLoading(true); // Start loading
    event.preventDefault();

    const {
      fullName,
      vendorEmail,
      phoneNumber,
      shopName,
      fullAddress,
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
      !nearByLocation ||
      !iframe ||
      !categoryIds ||
      !discount ||
      !description ||
      !youtubeUrl
    ) {
      return console.error("All fields ");
    }

    console.log("vendordetails", vendorData);

    const formData = new FormData();
    formData.append("fullName", vendorData.fullName);
    formData.append("id", vendor._id);
    formData.append("vendorEmail", vendorData.vendorEmail);
    formData.append("phoneNumber", vendorData.phoneNumber);
    formData.append("shopName", vendorData.shopName);
    formData.append("fullAddress", vendorData.fullAddress);
    formData.append("nearByLocation", vendorData.nearByLocation);
    formData.append("iframe", vendorData.iframe);
    formData.append("vendorImage", vendorData.vendorImage);
    formData.append("logo", vendorData.logo);
    formData.append("discountProvidedByVendor", vendorData.discount);
    formData.append("youTubeLink", vendorData.youtubeUrl);
    formData.append("description", vendorData.description);

    categoryIds.forEach((id) => formData.append("categoryIds[]", id));

    console.log("field", formData);
    const res = await dispatch(updateVendor(formData));

    if (res?.payload?.success) {
      setVendorData({
        fullName: "",
        vendorEmail: "",
        phoneNumber: "",
        shopName: "",
        fullAddress: "",
        nearByLocation: "",
        iframe: "",
        categoryIds: [],
        vendorImage: null,
        logo: null,
      });
      setIsLoading(false);
      setSelectedCategories([]);
      setImagePreviews({
        vendorImage: null,
        logo: null,
      });
    } else {
      setIsLoading(false);
    }
  };

  const mainDiv = "flex flex-col gap-[0.5px]";

  return (
    <HomeLayout>
      {loaderActive ? (
        <SkeletonTheme baseColor="#2F3349" highlightColor="#3D4056">
          <div className="flex items-center justify-center">
            <form className="p-6 bg-[#2F3349] text-white relative rounded-md shadow-[0px_0px_20px_#3D4056] overflow-hidden my-12 flex flex-col lg:flex-row gap-4 w-fit max-w-[100%] md:max-w-[80%] lg:max-w-[100%]">
              <div className="flex flex-col w-full gap-2">
                <div className="mb-4">
                  <h2 className="text-[1.8rem] font-semibold tracking-wide">
                    <Skeleton width={200} />
                  </h2>
                  <div className="flex items-center mt-2">
                    <Skeleton
                      width={12}
                      height={5}
                      className="mr-1 rounded-full"
                    />
                    <Skeleton
                      width={12}
                      height={5}
                      className="mr-1 rounded-full"
                    />
                    <Skeleton width={5} height={5} className="rounded-full" />
                  </div>
                </div>
                <div className={mainDiv}>
                  <Skeleton height={30} />
                </div>
                <div className={mainDiv}>
                  <Skeleton height={30} />
                </div>
                <div className={mainDiv}>
                  <Skeleton height={30} />
                </div>
                <div className="flex justify-between gap-2">
                  <div className={`${mainDiv} w-[48%]`}>
                    <Skeleton height={30} />
                  </div>
                  <div className={`${mainDiv} w-[48%]`}>
                    <Skeleton height={30} />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2 lg:mt-[5rem]">
                <div className="flex justify-between gap-2">
                  <div className={`${mainDiv} w-[48%]`}>
                    <Skeleton height={30} />
                  </div>
                  <div className={`${mainDiv} w-[48%]`}>
                    <Skeleton height={30} />
                  </div>
                </div>
                <div className="flex flex-col w-full mt-1">
                  <Skeleton height={50} />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton height={50} count={2} />
                  </div>
                </div>
                <div className="flex items-center gap-4 min-w-[6.8rem] justify-center bg-white shadow-[0px_0px_12px_#808080_inset] mt-1 p-2 rounded text-black">
                  <Skeleton height={30} width={100} />
                </div>
              </div>
            </form>
          </div>
        </SkeletonTheme>
      ) : (
        <div className="flex items-center justify-center">
          <form className="p-6 bg-[#2F3349] text-white items-end relative rounded-md shadow-[0px_0px_20px_#3D4056] overflow-hidden my-12 flex flex-col lg:flex-row gap-4 w-fit max-w-[100%] md:max-w-[80%] lg:max-w-[100%]">
            <div className="absolute flex items-center justify-center bg-[#685ED4] rounded-full animate-ping right-[-6px] size-8 top-[-6px]">
              <div className="bg-[#FF4C51] rounded-full size-4 flex items-center justify-center">
                <div className="size-2 bg-[#2F3349] rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col justify-center w-full gap-1">
              <div className="mb-4">
                <h2 className="text-[1.8rem] font-semibold tracking-wide">
                  Vendor Details
                </h2>
                <div className="flex items-center mt-2">
                  <div className="bg-[#685ED4] w-12 h-[5px] rounded-full mr-1"></div>
                  <div className="bg-[#685ED4] w-[12px] h-[5px] rounded-full mr-1"></div>
                  <div className="bg-[#FF4C51] w-[5px] h-[5px] rounded-full"></div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex flex-col mx-2 mb-3">
                  <label htmlFor="vendorImage" className="mb-1 text-gray-300">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    className="w-full bg-[#1D222B] rounded leading-10 focus:outline-none border border-borderDark"
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
              <div className="w-full ">
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
              <div className="w-full ">
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
                    value={vendorData?.fullName}
                  />
                </div>
              </div>
              <div className="w-full ">
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
                    value={vendorData?.shopName}
                  />
                </div>
              </div>

              <div className="w-full ">
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
                    value={vendorData?.vendorEmail}
                  />
                </div>
              </div>
              <div className="w-full ">
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
                  <label
                    htmlFor="nearByLocation"
                    className="mb-1 text-gray-300"
                  >
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

              <div className="w-full ">
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
                    value={vendorData?.discount}
                  />
                </div>
              </div>
              <div className="w-full ">
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
                    value={vendorData?.youtubeUrl}
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
                    value={vendorData?.iframe}
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
                    value={vendorData?.description}
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
              className="w-full py-3 text-white bg-[#6761D9] rounded px-7 flex items-center justify-center"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Registering</span>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-50"></div>
                </>
              ) : (
                "Register Vendor"
              )}
            </button>
          </form>
          {viewingImage && (
            <div className="fixed inset-0 z-[10000000000] flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative">
                <button
                  className="absolute top-0 right-0 p-1 px-4 text-white bg-red-500 rounded"
                  onClick={() => setViewingImage(null)}
                >
                  ✕
                </button>
                <img
                  src={viewingImage}
                  alt="Proof Document"
                  className="max-w-full rounded max-h-[85vh]"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </HomeLayout>
  );
};

export default VendorDetail;
