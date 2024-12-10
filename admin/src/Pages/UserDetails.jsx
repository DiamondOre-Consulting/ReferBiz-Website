import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HomeLayout from "../Layout/HomeLayout";
import { toast } from "sonner";
import { updateUserStatus } from "../Redux/Slices/listSlice";
import { getUserDetails } from "../Redux/Slices/listSlice";

const UserDetails = () => {
  const dispatch = useDispatch();
  const [loaderActive, setLoaderActive] = useState(false);
  const categoriesList = useSelector((state) => state?.list?.categoriesList);
  const userData = useSelector((state) => state?.list?.userData);
  console.log("userData", userData);
  const [isBlocked, setIsBlocked] = useState(userData?.isBlocked || false); // Ensure the default is false if undefined

  const handleBlockChange = async (e) => {
    const value = e.target.value === "true"; // Convert string to boolean
    setIsBlocked(value);
    const res = await dispatch(updateUserStatus([id, { isBlocked: value }]));
    console.log("res", res?.payload);
    if (res?.payload?.status) {
      toast.success("Status Updated Successfully!!");
    }
  };
  // const handleBlockChange = async (e) => {
  //   setIsBlocked(e.target.value);
  //   console.log(isBlocked);
  //   // await dispatch(updateUserStatus([id, { isBlocked: !isBlocked }]));
  //   // You can add API call logic here to update the user's blocked status
  // };

  const { id } = useParams();
  const fetchData = async () => {
    await dispatch(getUserDetails(id));
  };
  useEffect(() => {
    fetchData();
  }, []);

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
                <div className="flex items-center justify-between">
                  <div className="text-[1.8rem] font-semibold tracking-wide">
                    User Details
                  </div>
                  {/* <div>
                    {userData.userImage?.secure_url && (
                      <img
                        src={userData.userImage.secure_url}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    )}
                  </div> */}
                </div>
                <div className="flex items-center mt-2">
                  <div className="bg-[#685ED4] w-12 h-[5px] rounded-full mr-1"></div>
                  <div className="bg-[#685ED4] w-[12px] h-[5px] rounded-full mr-1"></div>
                  <div className="bg-[#FF4C51] w-[5px] h-[5px] rounded-full"></div>
                </div>
              </div>

              {/* Block/Unblock Status */}
              <div className="my-2 flex items-center justify-between p-4">
                <div>
                  {userData.userImage?.secure_url && (
                    <img
                      src={userData.userImage.secure_url}
                      alt="User"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                  )}
                </div>
                <div className="p-4  shadow-2xl rounded-md">
                  <h3 className="text-lg font-semibold text-center text-[#685ED4]">
                    Manage User Status
                  </h3>
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="blockStatus"
                        value="false"
                        checked={!isBlocked}
                        onChange={handleBlockChange}
                        className="form-radio text-green-600"
                      />
                      <span className="text-gray-400">Unblocked</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="blockStatus"
                        value="true"
                        checked={isBlocked}
                        onChange={handleBlockChange}
                        className="form-radio text-red-600"
                      />
                      <span className="text-gray-400">Blocked</span>
                    </label>
                  </div>
                  <p className="text-gray-400 text-center mt-4">
                    Current Status:{" "}
                    <span
                      className={`font-medium ${
                        isBlocked ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isBlocked ? "Blocked" : "Unblocked"}
                    </span>
                  </p>
                </div>
              </div>
              <section className="space-y-1 border border-[#685ED4] p-4 shadow-2xl rounded-md">
                <h3 className="text-xl font-semibold text-[#685ED4]">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Full Name:</p>
                    <p className="text-gray-400">{userData.fullName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Email Address:</p>
                    <p className="text-gray-400">{userData.userEmail}</p>
                  </div>
                  <div>
                    <p className="font-medium">Phone Number:</p>
                    <p className="text-gray-400">
                      {userData.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Role:</p>
                    <p className="text-gray-400">{userData.role}</p>
                  </div>
                </div>
              </section>

              {/* Earnings and Points */}
              <section className="mt-2 space-y-1 border border-[#685ED4] p-4 shadow-2xl rounded-md">
                <h3 className="text-xl font-semibold text-[#685ED4]">
                  Earnings and Points
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Total Earnings:</p>
                    <p className="text-gray-400">₹{userData.totalEarnings}</p>
                  </div>
                  <div>
                    <p className="font-medium">RB Points:</p>
                    <p className="text-gray-400">{userData.rbPoints}</p>
                  </div>
                  <div>
                    <p className="font-medium">Discount Earnings:</p>
                    <p className="text-gray-400">
                      ₹{userData.discountEarnings}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Referral Earnings:</p>
                    <p className="text-gray-400">
                      ₹{userData.referralEarnings}
                    </p>
                  </div>
                </div>
              </section>

              {/* Referral Information */}
              <section className="mt-2 space-y-1 border border-[#685ED4] p-4 shadow-2xl rounded-md">
                <h3 className="text-xl font-semibold text-[#685ED4]">
                  Referral Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Referral Code:</p>
                    <p className="text-gray-400">
                      {userData.referralCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Referred By:</p>
                    <p className="text-gray-400">
                      {userData.referredBy || "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              {/* User Image */}
            </div>
          </form>
        </div>
      )}
    </HomeLayout>
  );
};

export default UserDetails;
