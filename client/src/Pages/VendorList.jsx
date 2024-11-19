import React, { useState, useEffect, useCallback } from "react";
import { FaRegEye, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { GiBiceps } from "react-icons/gi";
import BreadCrumbs from "../Components/BreadCrumbs";
import { MdCurrencyRupee } from "react-icons/md";
import debounce from "lodash.debounce";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../Components/Header";
import {
  getCategoryList,
  getVendorByCategory,
  getSubCategoryList,
  getVendorBySubCategory,
} from "../Redux/Slices/vendorSlice";

const VendorList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  console.log(filteredSuggestions);
  const getLocation = useLocation();
  const [selectCategory, setSelectCategory] = useState("");
  const vendorList = useSelector((state) => state.vendor.vendorList);
  const [vendorDataList, setVendorDataList] = useState(vendorList);
  const categoryList = useSelector((state) => state?.vendor?.categoryList);
  const subCategoryList = useSelector(
    (state) => state?.vendor?.subCategoryList
  );
  const vendorListByCategories = useSelector(
    (state) => state?.vendor?.vendorListByCategories
  );
  const vendorListBySubCategories = useSelector(
    (state) => state?.vendor?.vendorListBySubCategories
  );
  const dispatch = useDispatch();
  console.log(categoryList);
  console.log("sub", selectCategory);
  const location = getLocation?.state?.location;

  console.log(vendorListByCategories);
  const navigate = useNavigate();
  const fetchCategoryList = async () => {
    await dispatch(getCategoryList(location));
  };
  const fetchSubCategoryList = async (category) => {
    await dispatch(getSubCategoryList({ location, category }));
  };
  const fetchVendorListByCategory = async (category) => {
    const res = await dispatch(getVendorByCategory({ category, location }));

    if (res?.payload?.success) setVendorDataList(res?.payload?.vendors);
  };
  const fetchVendorListBySubCategory = async (item) => {
    const res = await dispatch(
      getVendorBySubCategory({ location, category: selectCategory, item })
    );

    if (res?.payload?.success) {
      setVendorDataList(res?.payload?.vendors);
    }
  };

  console.log("fil", filteredSuggestions);

  useEffect(() => {
    fetchCategoryList();
    if (!getLocation?.state?.location) {
      navigate("/");
    }
  }, []);

  const filterSuggestions = useCallback(
    debounce((searchInput) => {
      if (searchInput.trim()) {
        const filtered = categoryList?.filter((category) =>
          category?.toLowerCase()?.includes(searchInput.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    }, 10)
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsSubCategoryOpen(false);
    filterSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setFilteredSuggestions([]);
  };

  const TeamvendorItem = ({ vendor }) => (
    <div
      onClick={() => navigate(`/vendor-detail/${vendor?._id}`)}
      className="bg-[#040D43] border-t-[8px]  border-[#2c56ff] h-[16rem] w-[18.5rem] hover:bg-gradient-to-b hover:from-transparent group hover:via-[#1e43fa63] hover:to-[#1d46ea] shadow-xl rounded-b-xl rounded-sm p-6  mx-auto hover:shadow-xl transition-all duration-500 flex flex-col items-center justify-center"
    >
      {/* Title */}
      <h4 className="mb-1 text-2xl font-medium">{vendor?.businessName}</h4>
      <p className="mb-4 text-sm">{vendor?.businessCategory}</p>
      <p className="opacity-50">{vendor?.bio}</p>

      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-1 font-semibold text-[0.95rem]">
          <FaRegEye />
          {vendor?.visitorCount}
        </div>
        <div className="flex items-center justify-center gap-1 font-semibold text-[0.95rem]">
          <FaUser />
          {vendor?.totalReferrals.length}
        </div>
        <div className="flex items-center justify-center gap-1 font-semibold text-[0.95rem]">
          <GiBiceps />
          {vendor?.totalReferrals.length}
        </div>
      </div>
      <div className="flex items-center justify-center font-semibold text-[1.3rem] mt-3">
        <MdCurrencyRupee />
        {vendor?.totalTransactions}/-
      </div>
    </div>
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Our Vendors" },
  ];

  return (
    <>
      <Header />
      <BreadCrumbs headText={"Our Vendors"} items={breadcrumbItems} />

      <div className="container relative z-20 px-4 mx-auto text-white">
        <div className=" mt-10">
          <div className="flex max-w-[75rem] mx-auto gap-4  items-center justify-center w-full">
            <div className="flex  w-1/2 relative">
              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Search for a category..."
                className=" rounded-[8px] px-4 py-2 w-full border rounded bg-[#040D43] text-gray-200 shadow focus:outline-none"
              />
              {filteredSuggestions.length > 0 && (
                <ul className="absolute top-9 w-full rounded-[8px] bg-[#040D43] text-gray-200 border rounded shadow mt-1 max-h-40 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectCategory(suggestion);
                        handleSuggestionClick(suggestion);
                        fetchVendorListByCategory(suggestion);
                        fetchSubCategoryList(suggestion);
                        setIsSubCategoryOpen(true);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Subcategory Dropdown */}
            <div className="flex-1 relative w-1/2">
              {isSubCategoryOpen && subCategoryList.length > 0 && (
                <>
                  <select
                    className="rounded-[8px] px-4 w-full py-2 border rounded bg-[#040D43] text-gray-200 shadow focus:outline-none"
                    onChange={(e) => {
                      fetchVendorListBySubCategory(e.target.value);
                    }}
                  >
                    <option value="" disabled selected>
                      Select Subcategory
                    </option>
                    {subCategoryList.map((subCategory, index) => (
                      <option key={index} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container grid grid-cols-1 gap-6 mx-auto mt-6 sm:grid-cols-2 w-fit lg:grid-cols-4">
          {vendorDataList?.map((vendor, i) => (
            <TeamvendorItem key={i} vendor={vendor} />
          ))}
        </div>
      </div>
    </>
  );
};

export default VendorList;
