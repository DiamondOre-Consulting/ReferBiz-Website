import React, { useState } from "react";
import HomeLayout from "../../Layout/HomeLayout";
import { HiOutlineUsers } from "react-icons/hi2";
import { GrMoney } from "react-icons/gr";
import { GiTakeMyMoney } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const VendorHome = () => {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state?.vendor?.vendorProfile);

  console.log("date", vendor);
  const fetchData = async () => {
    await dispatch(userProfile());
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <HomeLayout>
      <div className="flex flex-wrap justify-center gap-4 text-white">
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Total Visits</h3>
          <p className="text-[1.2rem] ">{vendor?.customerList?.length}</p>{" "}
          {/* <HiOutlineUsers className="absolute bottom-[-3rem] right-[-1rem] text-[#ffffff66] text-[11rem]" /> */}
        </div>
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Total Products</h3>
          <p className="text-[1.2rem]">{vendor?.products?.length}</p>
          {/* <GiTakeMyMoney className="absolute bottom-[-3rem] right-[-2rem] text-[#ffffff66] text-[11rem]" /> */}
        </div>
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Total Transactions</h3>
          <p className="text-[1.2rem]">{vendor?.totalTransactions}</p>
          {/* <HiOutlineUsers className="absolute bottom-[-3rem] right-[-1rem] text-[#ffffff66] text-[11rem]" /> */}
        </div>
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Profit Earned</h3>
          <p className="text-[1.2rem]">0</p>
          {/* <HiOutlineUsers className="absolute bottom-[-3rem] right-[-1rem] text-[#ffffff66] text-[11rem]" /> */}
        </div>
      </div>
    </HomeLayout>
  );
};

export default VendorHome;
