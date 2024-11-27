import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { getReferralList } from "../../Redux/Slices/vendorSlice";
import { UserRound, Store } from "lucide-react";
import {
  FaBars,
  FaClipboardList,
  FaSignOutAlt,
  FaCamera,
} from "react-icons/fa";

import { FaLock, FaPersonArrowDownToLine } from "react-icons/fa6";
import {
  changePassword,
  editProfile,
  logout,
  userProfile,
} from "../../Redux/Slices/authSlice";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { FiCopy } from "react-icons/fi";
import Header from "../../Components/Header";
import { IndianRupee } from "lucide-react";

const Profile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const list = useSelector((state) => state?.vendor?.refferalList);
  console.log("list", list);
  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        searchQuery,
      };
      const response = await dispatch(getReferralList(params)).unwrap();
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(currentPage);
  }, []);
  useEffect(() => {
    loadData(currentPage);
  }, [currentPage, itemsPerPage, searchQuery]);
  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 10),
    []
  );
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // other stuff

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eye, setEye] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const data = useSelector((state) => state?.auth?.data);
  const [loaderActive, setLoaderActive] = useState(false);
  const [sideActive, setSideActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const [passwordCardActive, setPasswordCardActive] = useState(false);

  const handleLogout = async () => {
    const res = await dispatch(logout());
    if (res?.payload?.success) {
      navigate("/");
      toast.success("Logged out!");
    }
  };

  const [profileData, setProfileData] = useState({
    userName: data?.fullName || "",
    fullName: data?.fullName || "",
    email: data?.userEmail || "",
    userImage: "",
    phoneNumber: data?.phoneNumber || "",
    referralCode: data?.referralCode || "",
  });
  console.log("pro", data);

  useEffect(() => {
    const hasChanged =
      profileData.userName !== data?.userName ||
      profileData.fullName !== data?.fullName ||
      profileData.userImage !== "" ||
      profileData.phoneNumber !== data?.phoneNumber;
    setIsUpdated(hasChanged);
  }, [profileData, data]);

  const imgUpload = (e) => {
    e.preventDefault();
    const uploadedImg = e.target.files[0];
    if (uploadedImg) {
      setProfileData({ ...profileData, userImage: uploadedImg });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImg);
      fileReader.addEventListener("load", function () {
        setImage(this.result);
      });
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFormInput = async (e) => {
    e.preventDefault();

    const { fullName, email, phoneNumber, address } = profileData;

    if (!fullName || !email || !phoneNumber) {
      return toast.error("All fields are required");
    }

    if (!email.match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
      return toast.error("Email is Invalid!");
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("userImage", profileData.userImage);

    const response = await dispatch(editProfile([data?._id, formData]));

    if (response?.payload?.success) {
      toast.success("Updated!");
      setLoaderActive(false);
      dispatch(userProfile());
    } else {
      setLoaderActive(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    id: data?._id,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Hide the tooltip after 1.5 seconds
      })
      .catch((error) => {
        console.error("Copy failed!", error);
      });
  };
  const fetchProfile = async () => {
    await dispatch(userProfile());
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setLoaderActive(false);
      return toast.error("Please fill in all fields");
    }

    if (newPassword !== confirmNewPassword) {
      setLoaderActive(false);
      return toast.error("Passwords do not match");
    }

    const response = await dispatch(changePassword(passwordData));

    if (response?.payload?.success) {
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setLoaderActive(false);
      setPasswordCardActive(false);
    } else {
      setLoaderActive(false);
    }
  };

  const handleEyeClick = () => {
    setEye(!eye);
  };

  const mainDiv =
    "relative mb-3 border w-full px-2 p-1 rounded-md border-main bg-[#F7FBFF] flex flex-col items-center";
  const labelStyle = "w-full  text-light   text-[0.8rem]";
  const inputStyle =
    "w-full p-[0.1rem] tracking-wide bg-transparent outline-none placeholder:text-[#808080]";
  const disabledInputStyle =
    "w-full p-[0.1rem] tracking-wide bg-transparent outline-none placeholder:text-[#808080]";

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 overflow-x-auto">
        {/* Main Content */}
        <div className="flex-1 pt-4 max-w-[55rem] p-2   w-full flex">
          {/* Sidebar */}

          {/* Profile Form */}
          <div
            className={`flex-1 shadow-[0px_0px_5px_#808080]  bg-gray-50 rounded-md relative h-fit  transition-all duration-300`}
          >
            <div className="relative w-full z-[50]">
              <img
                className="w-full h-[8rem] shadow-[0px_5px_15px_-5px_#808080] rounded object-cover"
                src={
                  "https://images.pexels.com/photos/5418830/pexels-photo-5418830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                }
                alt="profile background"
              />
              <div className="absolute bottom-[-1.8rem] left-4">
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {image ? (
                    <img
                      src={image}
                      alt="icon"
                      className="size-[6.5rem] border-[2px] border-[#FFB827] rounded-full"
                    />
                  ) : (
                    <img
                      src={
                        !data?.userImage?.secure_url
                          ? "userImg"
                          : data?.userImage?.secure_url
                      }
                      alt="icon"
                      className="size-[6.5rem] border-[3px] bg-white border-white rounded-full shadow-[0px_5px_15px_-5px_#808080]"
                    />
                  )}
                </label>
                <div className="relative">
                  <input
                    onChange={imgUpload}
                    type="file"
                    id="image_uploads"
                    name="image_uploads"
                    className="hidden"
                    accept=".jpg, .jpeg, .png, .svg"
                  />
                  <label
                    htmlFor="image_uploads"
                    className="absolute bottom-1 right-0 p-2 bg-[#FFB827] text-white text-xl font-semibold border-[3px] border-white rounded-full cursor-pointer shadow-[0px_5px_15px_-5px_#808080]"
                  >
                    <FaCamera />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex w-full h-full">
              <div
                className={`relative overflow-hidden top-0 left-0 bg-sky-50 min-h-full ${
                  sidebarOpen
                    ? "min-w-[15rem]"
                    : "max-w-[2.8rem] min-w-[2.7rem]"
                } p-1 transition-transform transform z-40 shadow-lg md:min-w-[15rem] md:transform-none md:transition-none`}
              >
                <ul className="pt-[3.2rem] space-y-4">
                  {/* Hamburger Menu Button (Visible on small screens only) */}
                  <div
                    onClick={toggleSidebar}
                    className={`text-[1.1rem] p-2 cursor-pointer bg-[#FFB827] text-white rounded-lg shadow-lg md:hidden`}
                  >
                    <FaBars />
                  </div>
                  <li
                    onClick={() => setSideActive(0)}
                    className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${
                      sideActive === 0
                        ? "bg-gray-200 text-main"
                        : "bg-white text-gray-700"
                    } rounded-lg`}
                  >
                    <FaClipboardList size={20} />
                    <span
                      className={`ml-2 ${
                        sidebarOpen ? "block" : "hidden"
                      } md:block`}
                    >
                      Dashboard
                    </span>
                  </li>
                  <li
                    onClick={() => setSideActive(1)}
                    className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${
                      sideActive === 1
                        ? "bg-gray-200 text-main"
                        : "bg-white text-gray-700"
                    } rounded-lg`}
                  >
                    <FaClipboardList size={20} />
                    <span
                      className={`ml-2 ${
                        sidebarOpen ? "block" : "hidden"
                      } md:block`}
                    >
                      Profile
                    </span>
                  </li>
                  {/* <li onClick={() => setSideActive(2)} className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${sideActive === 2 ? 'bg-gray-200 text-main' : 'bg-white text-gray-700'} rounded-lg`}>
                        <FaCalendarCheck size={20} />
                        <span className={`ml-2 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>Confirmed bookings</span>
                    </li>

                    <li onClick={() => setSideActive(4)} className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${sideActive === 4 ? 'bg-gray-200 text-main' : 'bg-white text-gray-700'} rounded-lg`}>
                        <FaHourglassHalf size={20} />
                        <span className={`ml-2 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>Ongoing booking</span>
                    </li>
                    <li onClick={() => setSideActive(5)} className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${sideActive === 5 ? 'bg-gray-200 text-main' : 'bg-white text-gray-700'} rounded-lg`}>
                        <FaCheckCircle size={20} />
                        <span className={`ml-2 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>Completed booking</span>
                    </li> */}
                  <li
                    onClick={() => setSideActive(3)}
                    className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${
                      sideActive === 3
                        ? "bg-gray-200 text-main"
                        : "bg-white text-gray-700"
                    } rounded-lg`}
                  >
                    <FaLock size={20} />
                    <span
                      className={`ml-2 ${
                        sidebarOpen ? "block" : "hidden"
                      } md:block`}
                    >
                      Change Password
                    </span>
                  </li>
                  <li
                    onClick={() => setSideActive(4)}
                    className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${
                      sideActive === 4
                        ? "bg-gray-200 text-main"
                        : "bg-white text-gray-700"
                    } rounded-lg`}
                  >
                    <FaPersonArrowDownToLine size={20} />
                    <span
                      className={`ml-2 ${
                        sidebarOpen ? "block" : "hidden"
                      } md:block`}
                    >
                      Referral Contacts
                    </span>
                  </li>
                  <li
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?")) {
                        handleLogout(); // Call the logout function if confirmed
                      }
                      // If canceled, do nothing
                    }}
                    className={`flex items-center cursor-pointer p-2 space-x-2 font-semibold ${
                      sideActive === 6
                        ? "bg-gray-200 text-main"
                        : "bg-white text-gray-700"
                    } rounded-lg`}
                  >
                    <FaSignOutAlt size={20} />
                    <span
                      className={`ml-2 ${
                        sidebarOpen ? "block" : "hidden"
                      } md:block`}
                    >
                      Logout
                    </span>
                  </li>
                </ul>
              </div>

              {/* Form Inputs */}
              {sideActive === 0 && (
                <form
                  noValidate
                  onSubmit={handleFormInput}
                  className="flex flex-col items-start justify-center w-full p-3 text-black rounded-lg shadow-lg "
                >
                  <div className="flex items-start mt-6 md:mt-16 justify-start w-full min-h-[55vh] ml-2 ">
                    <div className="flex flex-col items-start justify-center w-full p-3 text-black rounded-lg ">
                      <h2 className="text-2xl font-bold mb-3">Dashboard</h2>
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="shadow-xl p-4 bg-neutral-200 rounded-xl">
                          <div className="text-gray-500  text-xl font-bold text-center">
                            Referral Earning
                          </div>
                          <div className="flex items-center justify-center gap-2 my-5">
                            <IndianRupee size={22} className="font-semibold " />
                            <div className="font-semibold text-xl text-gray-500">
                              {data.referralEarnings}
                            </div>
                          </div>
                        </div>
                        <div className="shadow-xl p-4 bg-neutral-200 rounded-xl">
                          <div className="text-gray-500  text-xl font-bold text-center">
                            Discount Earning
                          </div>
                          <div className="flex items-center justify-center gap-2 my-5">
                            <IndianRupee size={22} className="font-semibold " />
                            <div className="font-semibold text-xl text-gray-500">
                              {data.discountEarnings}
                            </div>
                          </div>
                        </div>
                        <div className="shadow-xl p-4 bg-neutral-200 rounded-xl">
                          <div className="text-gray-500  text-xl font-bold text-center">
                            Total Referrals
                          </div>
                          <div className="flex items-center justify-center gap-1 my-5">
                            <UserRound size={22} className="font-semibold " />
                            <div className="font-semibold text-xl text-gray-500">
                              {data.referralList.length}
                            </div>
                          </div>
                        </div>
                        <div className="shadow-xl p-4 bg-neutral-200 rounded-xl">
                          <div className="text-gray-500  text-xl font-bold text-center">
                            Stores visit
                          </div>
                          <div className="flex items-center justify-center gap-2 my-5">
                            <Store size={22} className="font-semibold " />
                            <div className="font-semibold text-xl text-gray-500">
                              {data.vendorList.length}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-16 my-4 flex justify-end p-4 shadow-xl rounded-xl bg-neutral-200">
                        <div className="text-xl  text-gray-500 font-bold ">
                          Total Earning :{data.totalEarnings}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
              {sideActive === 1 && (
                <form
                  noValidate
                  onSubmit={handleFormInput}
                  className="flex flex-col items-start justify-center w-full p-3 text-black rounded-lg shadow-lg "
                >
                  <div className="flex items-start mt-8 md:mt-16 justify-start w-full min-h-[55vh] ml-2 ">
                    <div className="flex flex-col items-start justify-center w-full p-3 text-black rounded-lg ">
                      <h2 className="text-[1.25rem] font-bold mb-3">Profile</h2>
                      <div className={`${mainDiv}`}>
                        <label
                          htmlFor="email"
                          className={`${labelStyle} cursor-not-allowed`}
                        >
                          Email
                        </label>
                        <input
                          disabled
                          type="email"
                          name="email"
                          id="email"
                          value={profileData.email}
                          onChange={handleInput}
                          className={`${disabledInputStyle} cursor-not-allowed`}
                          placeholder=" "
                        />
                      </div>
                      <div className={`${mainDiv}`}>
                        <label
                          className={`${labelStyle}`}
                          htmlFor="phoneNumber"
                        >
                          Phone number
                        </label>
                        <input
                          className={`${inputStyle}`}
                          type="number"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleInput}
                        />
                      </div>
                      <div className={`${mainDiv}`}>
                        <label className={`${labelStyle}`} htmlFor="fullName">
                          Full name
                        </label>
                        <input
                          className={`${inputStyle}`}
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={profileData.fullName}
                          onChange={handleInput}
                        />
                      </div>
                      <div className={`${mainDiv} relative`}>
                        <label
                          className={`${labelStyle} cursor-not-allowed`}
                          htmlFor="referralCode"
                        >
                          Referral code
                        </label>
                        <input
                          className={`${inputStyle} cursor-not-allowed pointer-events-none`}
                          type="text"
                          name="referralCode"
                          id="referralCode"
                          value={profileData.referralCode}
                        />
                        {copied && (
                          <span className="absolute right-0 px-2 py-1 -mt-8 text-xs text-white bg-gray-800 rounded shadow-md top-1">
                            Copied!
                          </span>
                        )}
                        <div
                          onClick={copyToClipboard}
                          className="absolute right-0 text-gray-700 p-[0.95rem] cursor-pointer top-0 rounded-md bg-[#0f4bff1c] hover:text-gray-800 focus:outline-none"
                        >
                          <FiCopy size={24} />
                        </div>
                      </div>
                      <button
                        type="submit"
                        onClick={() => setLoaderActive(true)}
                        className={`p-2 px-4 mt-2 flex items-center justify-center text-white bg-main transition-all duration-300 w-full lg:px-6 hover:shadow-[1px_1px_6px_-2px#808080] rounded text-[0.9rem] font-semibold ${
                          !isUpdated && "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!isUpdated}
                      >
                        Update profile{" "}
                        {loaderActive && (
                          <div className="ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0"></div>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {sideActive === 3 && (
                <form
                  onSubmit={handleSubmit}
                  className="relative w-full p-4 mt-10 space-y-4 md:mt-16 "
                >
                  <h2 className="mb-6 text-[1.2rem] font-semibold text-left text-gray-600">
                    Change Password
                  </h2>
                  <div className={mainDiv}>
                    <label htmlFor="oldPassword" className={labelStyle}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      id="oldPassword"
                      className={`${inputStyle} w-[20rem]`}
                      value={passwordData.oldPassword}
                      placeholder="Enter old password..."
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={`${mainDiv} relative`}>
                    <label htmlFor="newPassword" className={labelStyle}>
                      New Password
                    </label>
                    <input
                      type={`${eye ? "password" : "text"}`}
                      name="newPassword"
                      placeholder="Enter new password..."
                      id="newPassword"
                      className={`${inputStyle} w-[20rem]`}
                      value={passwordData.newPassword}
                      onChange={handleInputChange}
                    />
                    <div
                      className="absolute bottom-2 right-2"
                      onClick={handleEyeClick}
                    >
                      {eye ? <VscEyeClosed /> : <VscEye />}
                    </div>
                  </div>
                  <div className={mainDiv}>
                    <label htmlFor="confirmNewPassword" className={labelStyle}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      className={`${inputStyle} w-[20rem]`}
                      placeholder="Enter new password again..."
                      value={passwordData.confirmNewPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={() => setLoaderActive(true)}
                    className={`p-2 px-4 flex items-center justify-center text-white bg-main w-full  transition-all duration-300  lg:px-6 hover:shadow-[1px_1px_6px_-2px#808080] rounded text-[0.9rem] font-semibold `}
                  >
                    Change Password{" "}
                    {loaderActive && (
                      <div className="ml-4 ease-in-out mt-1 size-[1.2rem] border-[2.4px] border-y-[#57575769] animate-spin rounded-full bottom-0"></div>
                    )}
                  </button>
                </form>
              )}
              {sideActive === 4 && (
                <div className="flex flex-col items-start mt-6 overflow-x-auto md:mt-16 justify-start  ml-2">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3 text-gray-600 text-center">
                      Referral List
                    </h2>
                    <div className="flex flex-col lg:flex-row border border-borderDark items-center justify-between gap-4 px-3 py-1 mt-4 rounded bg-gray-200 shadow-xl">
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="outline-none text-gray-600 rounded p-2 lg:w-[20rem] w-full bg-transparent"
                      />
                      <div className="flex items-center justify-between w-full lg:w-fit lg:gap-2 xl:gap-10">
                        <div>
                          <label
                            htmlFor=""
                            className="text-gray-600 text-[1.1rem] mr-2"
                          >
                            Show:
                          </label>
                          <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="bg-transparent outline-none text-gray-600 rounded p-2 sm:w-[6rem] w-[4rem] border border-borderDark"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Table Container */}
                    <div className="mt-2 overflow-x-auto">
                      <div className="flex flex-col border border-gray-300 rounded-t min-w-full">
                        <div className="flex items-center justify-between w-full gap-3 bg-gray-300 rounded-t text-gray-600 px-3 py-3 lg:px-6 font-semibold border-b  border-borderDark">
                          <p className="min-w-[3rem] text-center">S.no</p>
                          <div className="min-w-[13rem] lg:min-w-[15rem] line-clamp-1">
                            <p>Name</p>
                          </div>
                          <div className="min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1">
                            <p>Email</p>
                          </div>
                          <p className="min-w-[7.5rem] text-center">Date</p>
                        </div>
                        {loading
                          ? Array.from({ length: itemsPerPage }).map(
                              (_, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between w-full gap-3 px-3 py-3 text-black bg-[#1c202a]"
                                >
                                  <p className="min-w-[3rem] text-center">
                                    <Skeleton />
                                  </p>
                                  <div className="min-w-[13rem] lg:min-w-[15rem] line-clamp-1">
                                    <p>
                                      <Skeleton />
                                    </p>
                                  </div>
                                  <div className="min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1">
                                    <p>
                                      <Skeleton />
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 min-w-[6.8rem]">
                                    <Skeleton width={70} />
                                  </div>
                                </div>
                              )
                            )
                          : list?.map((data, index) => (
                              <div
                                key={data?._id}
                                className="mt-1 relative text-[0.95rem] flex items-center  justify-between w-full gap-3 px-3 py-3 text-gray-600 bg-gray-300"
                              >
                                <p className="min-w-[3rem] text-center">
                                  {(currentPage - 1) * itemsPerPage + index + 1}
                                  .
                                </p>
                                <div className="min-w-[13rem] lg:min-w-[15rem] line-clamp-1">
                                  <p>{data?.fullName}</p>
                                </div>
                                <div className="min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1">
                                  <p>{data?.email}</p>
                                </div>
                                <p className="min-w-[7.5rem] text-center">
                                  {data?.referredDate
                                    ? new Date(
                                        data.referredDate
                                      ).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : ""}
                                </p>
                              </div>
                            ))}
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-2 border border-gray-300 bg-gray-300 text-gray-600 rounded overflow-hidden">
                      <button
                        className="flex items-center justify-center bg-[#7367F0] px-3 py-2 text-gray-300"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <GrFormPrevious className="text-[1.4rem] mt-1" />{" "}
                        Previous
                      </button>
                      <span className="font-semibold">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="flex items-center justify-center bg-[#7367F0] px-3 py-2 text-gray-300"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next <GrFormNext className="text-[1.4rem] mt-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
