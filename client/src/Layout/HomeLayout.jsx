import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineXMark } from "react-icons/hi2";
import { CgLogOut } from "react-icons/cg";
import { MdOutlineSettings, MdOutlineContactMail } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { PiUsersThreeBold } from "react-icons/pi";
import { vendorLogout } from "../Redux/Slices/authSlice";
import { TfiDashboard } from "react-icons/tfi";
import { IoGiftOutline, IoNotificationsOutline } from "react-icons/io5";
import { userProfile } from "../Redux/Slices/vendorSlice";
import { io } from "socket.io-client";
import { toast } from "sonner";

const HomeLayout = ({ children }) => {
  const [active, setActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendor = useSelector((state) => state?.vendor?.vendorProfile);

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const avatar = useSelector((state) => state?.auth?.data?.avatar);
  const fullName = useSelector((state) => state?.auth?.data?.fullName);
  const fetchProfile = async () => {
    await dispatch(userProfile());
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
      setTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000); // Update time every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const [socket, setSocket] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!vendor?._id) return;

    // const newSocket = io("http://localhost:5000", {
    //   reconnection: true,
    //   reconnectionAttempts: 5,
    //   reconnectionDelay: 1000,
    //   transports: ["websocket"],
    // });

    const newSocket = io("https://referbiz-backend.onrender.com", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("joinVendorRoom", vendor._id);
    });

    newSocket.on("payment-request", (data) => {
      const requestWithTimestamp = {
        ...data,
        timestamp: Date.now(),
      };

      const savedRequests = JSON.parse(
        localStorage.getItem(`paymentRequests_${vendor._id}`) || "[]"
      );

      if (!savedRequests.some((req) => req.paymentId === data.paymentId)) {
        const newRequests = [...savedRequests, requestWithTimestamp];
        localStorage.setItem(
          `paymentRequests_${vendor._id}`,
          JSON.stringify(newRequests)
        );

        // Update notification count
        setNotificationCount((prev) => prev + 1);
        toast.success("New payment request received! Check dashboard.");
      }
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [vendor?._id]);

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
                <div className="flex top-[-0.05rem] right-[0.85rem] absolute min-w-[1.5rem] items-center justify-center text-[0.85rem] font-semibold rounded-full bg-dashRed">
                  <p>{notificationCount}</p>
                </div>
              </div>
              <Link
                to={`/profile/${fullName}`}
                className=" size-[2.6rem] rounded-full overflow-hidden bg-[#a4a5a9] border border-borderDark"
              >
                <img
                  src={vendor?.vendorImage?.secure_url || "userImg"}
                  className="w-[2.55rem]"
                  alt=""
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
              <Link to={"/"}>
                {" "}
                <img
                  src={vendor?.logo?.secure_url || "userImg"}
                  className="  w-[2.65rem]"
                  alt=""
                />
              </Link>
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
                  to={"/vendor-stores"}
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
                  to={"/vendor-profile"}
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
                  to={"/customer-list"}
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
                  to={"/vendor-contact"}
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
