import { useEffect } from "react";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HomeLayout from "../../Layout/HomeLayout";
import { useSelector, useDispatch } from "react-redux";
import { FaEye } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { getCustomers } from "../../Redux/Slices/vendorSlice";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export const CustomerList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const list = useSelector((state) => state?.vendor?.customerList);
  console.log("list", list);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        searchQuery,
      };
      const response = await dispatch(getCustomers(params)).unwrap();
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

  return (
    <HomeLayout>
      <div className="overflow-x-auto">
        <h1 className="text-3xl text-gray-500 font-bold text-center mb-6">
          Customer List
        </h1>
        <div className="flex flex-col lg:flex-row border border-borderDark items-center justify-between gap-4 p-3 mt-4 bg-[#1c202a] rounded ">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-[#242a34] outline-none text-white rounded p-2 lg:w-[20rem] w-full"
          />
          <div className="flex items-center justify-between w-full lg:w-fit lg:gap-2 xl:gap-10">
            <div>
              <label htmlFor="" className="text-white text-[1.1rem] mr-2">
                Show:
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-[#242a34]  outline-none text-white rounded p-2 sm:w-[6rem] w-[4rem]"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-2 overflow-x-scroll scrollbar scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-gray-800 scrollbar-thumb-gray-600 scrollbar-thin md:w-custom">
          <div className="flex border  flex-col items-center justify-center border-[#242a34] rounded-t  min-w-[55.5rem]">
            <div className="flex items-center relative justify-between w-full gap-3 bg-[#242a34] rounded-t text-white px-3 py-4 lg:px-6 font-semibold">
              <p className="min-w-[3rem] text-center">S.no</p>
              <div className="min-w-[13rem] lg:min-w-[15rem] line-clamp-1">
                <p>Name</p>
              </div>
              <div className="min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1">
                <p>Phone Number</p>
              </div>
              <p className="min-w-[7.5rem]  text-center">Amount Paid</p>
              <p className="min-w-[6.8rem] text-center">Last Purchase Date</p>

              <p className="min-w-[3.3rem] sticky px-2 right-0 bg-[#242a34] text-center">
                Store Visits
              </p>
            </div>
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, index) => (
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
                    <div className="flex items-center gap-2 min-w-[6.8rem]">
                      <Skeleton width={70} />
                    </div>
                    <div className="min-w-[3.3rem] flex items-center justify-center">
                      <Skeleton width={24} height={24} />
                    </div>
                  </div>
                ))
              : list?.map((data, index) => (
                  <div
                    key={data?._id}
                    className="relative text-[0.95rem] flex items-center border-t font-normal border-borderDark justify-between w-full gap-3 px-3 py-3 text-white bg-[#1c202a]"
                  >
                    <p className="min-w-[3rem] text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </p>
                    <div className="min-w-[13rem] lg:min-w-[15rem] line-clamp-1">
                      <p>{data?.fullName}</p>
                    </div>
                    <div className="min-w-[13rem] lg:min-w-[15rem] truncate line-clamp-1">
                      <p>{data?.phoneNumber}</p>
                    </div>
                    <div className="min-w-[7rem]  truncate line-clamp-1">
                      <p>{data?.totalPaid}</p>
                    </div>
                    <div className="min-w-[7rem]  truncate line-clamp-1">
                      <p>
                        {data?.lastPurchaseDate
                          ? new Date(data.lastPurchaseDate).toLocaleString(
                              "en-US",
                              {
                                // 'long' | 'short' | 'narrow'
                                year: "numeric",
                                month: "short", // 'long' | 'short' | 'narrow'
                                day: "numeric",
                                // Use 12-hour clock
                              }
                            )
                          : ""}
                      </p>
                    </div>
                    <div className="min-w-[7rem]  truncate line-clamp-1">
                      <p>{data?.purchaseCount}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 border border-[#242a34] bg-[#1c202a] text-white rounded overflow-hidden ">
          <button
            className="flex items-center justify-center bg-[#7367F0] p-3"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <GrFormPrevious className="text-[1.4rem] mt-1" /> Previous
          </button>
          <span className="font-semibold ">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="flex items-center justify-center bg-[#7367F0] p-3"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next <GrFormNext className="text-[1.4rem] mt-1" />
          </button>
        </div>
      </div>
    </HomeLayout>
  );
};
