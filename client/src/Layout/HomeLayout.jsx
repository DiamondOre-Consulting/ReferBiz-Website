import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaCar,
  FaHotel,
  FaArrowDown,
  FaArrowRight,
  FaRegUser,
  FaUser,
} from "react-icons/fa";
import { HiOutlineXMark } from "react-icons/hi2";
import { CgLogOut } from "react-icons/cg";
import {
  MdContentPaste,
  MdOutlineSettings,
  MdOutlineDashboard,
  MdOutlineContactMail,
} from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  RiFileList2Fill,
  RiGalleryFill,
  RiUserLocationFill,
} from "react-icons/ri";
import { GiSunPriest } from "react-icons/gi";
import { PiUserList, PiUsersThreeBold } from "react-icons/pi";
import { FaSailboat, FaCircle, FaPersonCircleQuestion } from "react-icons/fa6";
import { RiArrowRightSLine, RiArrowDownSLine } from "react-icons/ri";
import { LuShoppingBag } from "react-icons/lu";
import { vendorLogout } from "../Redux/Slices/authSlice";
import { TfiDashboard } from "react-icons/tfi";
import { IoGiftOutline, IoNotificationsOutline } from "react-icons/io5";

const HomeLayout = ({ children }) => {
  const [active, setActive] = useState(false);
  const [dropdownActive, setDropdownActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const avatar = useSelector((state) => state?.auth?.data?.avatar);
  const fullName = useSelector((state) => state?.auth?.data?.fullName);

  const handleLogout = async () => {
    const response = await dispatch(vendorLogout());

    if (response?.payload?.success) {
      navigate("/");
    }
  };

  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 24 hour format to 12 hour format
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
      setTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000); // Update time every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const listStyle =
    "flex items-center justify-start gap-2 pl-4 p-2 m-[0.4rem] ml-0 mr-3 md:mr-4 rounded-r bg-[#2A303D] hover:bg-[#6761D9] hover:text-white transition-all duration-300 text-[#CBC8E0] font-semibold tracking-wide text-[1.02rem]";
  const activeListStyle = `${listStyle} bg-[#6761D9] text-white`;

  return (
    <>
      <div className="items-start h-[100vh] overflow-hidden md:flex md:flex-row-reverse bg-[#212631]">
        <div className="w-full">
          <header className="flex items-center justify-between backdrop-blur-3xl relative z-[1000000] px-3 bg-[#212631] p-2 md:w-full text-[#fff] border-b border-[#323A49]">
            <div
              className="p-2 cursor-pointer hover:text-white md:hidden"
              onClick={() => setActive(true)}
            >
              <RxHamburgerMenu className="text-[#a4a5a9] text-[1.5rem] hover:text-white" />
            </div>
            <div className="hidden md:block"></div>
            <p className="">{time}</p>
            <div className="flex items-center justify-center gap-5 pr-1">
              <div className="relative py-2 pr-6 border-r cursor-pointer border-grayText border-opacity-65">
                <IoNotificationsOutline className="text-[1.5rem] hover:text-white text-grayText" />
                <div className="flex  top-[-0.05rem] right-[0.85rem] absolute min-w-[1.5rem] items-center justify-center text-[0.85rem] font-semibold rounded-full bg-dashRed">
                  <p>5</p>
                </div>
              </div>
              <Link
                to={`/profile/${fullName}`}
                className=" size-[2.6rem] rounded-full overflow-hidden bg-[#a4a5a9] border border-borderDark"
              >
                <img
                  src={avatar?.secure_url || "userImg"}
                  className="w-[2.55rem]"
                  alt="User Avatar"
                />
              </Link>
            </div>
          </header>
          <div className="h-[90vh] bg-[#1D222B] p-3 md:w-full md:p-4 md:px-6  w-custom scrollbar scrollbar-none overflow-y-scroll">
            {children}
          </div>
        </div>
        <NavLink
          className={`z-[100000000] h-[100vh] border-r border-borderDark overflow-hidden max-w-[15rem] min-w-[15rem] md:max-w-[16rem] md:min-w-[15.9rem]  bg-[#212631] absolute md:static top-0 ${
            active ? "left-0" : "left-[-35rem]"
          } transition-all duration-500`}
        >
          <ul>
            <li className="flex items-center justify-between p-[1.05rem] border-b border-borderDark text-[#CBC8E0]">
              <Link to={"/"}>LOGO</Link>
              <div
                className="p-[7px] md:hidden"
                onClick={() => setActive(false)}
              >
                <HiOutlineXMark className="text-[1.5rem]" />
              </div>
            </li>
            <div className="h-[82vh] overflow-y-scroll scrollbar scrollbar-none">
              <li className="mt-4">
                <NavLink
                  to={"/vendor/dashboard"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <TfiDashboard />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/vendor/global-settings"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <RiFileList2Fill />
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/vendor/global-settings"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <MdOutlineSettings />
                  Store
                </NavLink>
              </li>

              <li>
                <NavLink
                  to={"/car-list"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <FaRegUser />
                  Vendor Profile
                </NavLink>
              </li>

              <li>
                <NavLink
                  to={"/product-list"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <IoGiftOutline />
                  Products list
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/boatman-list"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <PiUsersThreeBold />
                  Customer list
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/enquiry"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <FaPersonCircleQuestion />
                  Enquiry
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/enquiry"}
                  className={({ isActive }) =>
                    isActive ? activeListStyle : listStyle
                  }
                >
                  <MdOutlineContactMail />
                  Contact Us
                </NavLink>
              </li>
            </div>
          </ul>
          <Link
            onClick={handleLogout}
            className="bg-[#DD4141] transition-all duration-700 hover:bg-[#c22f2f] border-none text-white flex items-center gap-2 pl-4 p-2 m-[0.4rem] ml-0 mr-3 rounded-r md:mr-4 font-semibold text-[1.02rem] tracking-wide"
          >
            <CgLogOut className="text-[1.3rem] font-semibold" /> Logout
          </Link>
        </NavLink>
      </div>
    </>
  );
};

export default HomeLayout;
