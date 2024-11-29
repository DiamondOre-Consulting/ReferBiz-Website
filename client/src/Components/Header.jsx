import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaUser,
  FaWhatsappSquare,
} from "react-icons/fa";
import { FaSquarePhone, FaSquareXTwitter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../Redux/Slices/authSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleOutsideClick);
    } else {
      window.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const userData = useSelector((state) => state?.auth?.data);

  const handleLogout = async () => {
    const response = await dispatch(logout());
    if (response?.payload?.success) {
      navigate("/");
    }
  };
  return (
    <>
      <div
        className={`fixed w-full top-0 z-[10001] backdrop-blur-sm bg-transparent`}
      >
        <header
          className={`transition-all overflow-x-hidden shadow-[0px_0px_10px_-3px_#000] duration-300 z-[10002] ease-in-out backdrop-blur-md bg-[#fefefee5] py-[0.9rem] text-black w-full
                        px-4 mx-auto`}
        >
          <nav className="flex items-center justify-between">
            <Link to={"/"} className="text-xl font-bold w-[14rem]">
              <img
                className=" w-[5rem]"
                src="https://www.referbiz.in/assets/RB_100_New-db747977.png"
                alt="Logo"
              />
            </Link>
            <ul className="hidden font-semibold lg:gap-10 lg:flex lg:items-center sora-500">
              <li>
                <Link
                  to="/"
                  className={`border-b-2 transition-all duration-300  ${
                    isActive("/")
                      ? "text-main border-main"
                      : "text-gray-800 border-gray-800 border-b-transparent"
                  }`}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about-us"
                  className={`border-b-2 transition-all duration-300  ${
                    isActive("/about-us")
                      ? "text-main border-main"
                      : "text-gray-800 border-gray-800 border-b-transparent"
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/Contact"
                  className={`border-b-2 transition-all duration-300  ${
                    isActive("/Contact")
                      ? "text-main border-main"
                      : "text-gray-800 border-gray-800 border-b-transparent"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
            {isLoggedIn ? (
              <div className="flex items-center justify-end gap-4 w-[14rem] ">
                <Link to={`/profile/${userData?.fullName}`}>
                  <img
                    src={
                      userData?.userImage?.secure_url
                        ? userData?.userImage?.secure_url
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIKcTkARlljahDz7xR5gq-lwY3NSwsYMQdl_AlXfua4Yc2QcQ9QIG38gxtEiMGNAdoEck&usqp=CAU"
                    }
                    className={` hidden   duration-300 lg:block border-borderDark shadow-[0px_0px_10px_-3px_#808080] h-[2.6rem] w-[2.6rem] border-white rounded-full`}
                  />
                </Link>

                <Link
                  to={"/logout"}
                  onClick={handleLogout}
                  className={` hidden lg:block duration-300 text-white border border-light bg-light p-[8px] px-[6px] text-[1.4rem] rounded-md`}
                >
                  <FiLogOut />
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 font-semibold w-[14rem]">
                <Link to={"/login"}>
                  <button
                    className={` hidden duration-300 lg:block border-borderDark border-main bg-[#1900ff16] w-full p-[7px] text-[0.95rem] px-6 rounded-md`}
                  >
                    Login
                  </button>
                </Link>
                <Link to={"/register"}>
                  <button
                    className={` hidden lg:block border-borderDark font-normal border-light bg-light  duration-300   text-white w-full p-[7px] text-[0.95rem] px-6 rounded-md`}
                  >
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            <div className="lg:hidden">
              <button aria-label="Menu icon" onClick={toggleMenu} className="">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 21 21"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  ></path>
                </svg>
              </button>
            </div>
          </nav>
        </header>
      </div>
      {/* Black Overlay */}
      {isOpen && (
        <div
          className="fixed backdrop-blur-sm inset-0 bg-[#00072c] opacity-70 z-[10000]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed flex flex-col justify-between w-[15rem] transition-all duration-500 right-2  sm:right-4 rounded-lg h-auto bg-[#f5f7ff] border-borderDark border-gray-300 text-gray-800 shadow-lg  transform ${
          isOpen
            ? "open-menu top-[5.8rem] z-[10001] mr-1 sm:mr-0 sm:top-[5.7rem] md:top-[6.2rem]"
            : "close-menu top-[-25.8rem] sm:top-[-25.7rem] z-[35]  border-0"
        } lg:hidden `}
      >
        <ul className="px-4 mt-8 space-y-4 font-semibold sora-500">
          <li onClick={closeMenu}>
            <Link
              to="/"
              className={`border-b-2 transition-all duration-300  ${
                isActive("/")
                  ? "text-main border-main"
                  : "border-transparent hover:text-main hover:border-main"
              }`}
            >
              Home
            </Link>
          </li>

          <li onClick={closeMenu}>
            <Link
              to="/About"
              className={`border-b-2 transition-all duration-300  ${
                isActive("/About")
                  ? "text-main border-main"
                  : "border-transparent hover:text-main hover:border-main"
              }`}
            >
              About
            </Link>
          </li>
          <li onClick={closeMenu}>
            <Link
              to="/Contact"
              className={`border-b-2 transition-all duration-300  ${
                isActive("/Contact")
                  ? "text-main border-main"
                  : "border-transparent hover:text-main hover:border-main"
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex items-center justify-center gap-2 my-5 font-semibold w-[14rem]">
          <Link to={"/login"} onClick={closeMenu}>
            <button
              className={` bg-transparent hover:bg-main text-black hover:text-white border-main  duration-300 lg:block border   w-full p-[5px] text-[0.95rem] px-6 rounded-md`}
            >
              Login
            </button>
          </Link>
          <Link to={"/register"} onClick={closeMenu}>
            <button
              className={` hover:bg-transparent bg-main border-main text-white hover:text-black duration-300 border w-full p-[5px] text-[0.95rem] px-6 rounded-md`}
            >
              Sign up
            </button>
          </Link>
        </div>
        <div className="text-[1.68rem] w-fit mx-auto mb-6 flex items-center gap-3">
          <Link to={""} target="_blank" className="" onClick={closeMenu}>
            <FaInstagramSquare />
          </Link>
          <Link to={""} className="" onClick={closeMenu}>
            <FaFacebookSquare />
          </Link>
          <Link to={""} className="" onClick={closeMenu}>
            <FaSquareXTwitter />
          </Link>
          <Link
            to={"https://wa.me/"}
            target="_blank"
            className=""
            onClick={closeMenu}
          >
            <FaWhatsappSquare />
          </Link>
          <Link to={"tel:+"} className="" onClick={closeMenu}>
            <FaSquarePhone />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
