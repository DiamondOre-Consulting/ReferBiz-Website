import HomeLayout from "../../Layout/HomeLayout";
import { useSelector, useDispatch } from "react-redux";
import { userProfile } from "../../Redux/Slices/vendorSlice";
import { useEffect } from "react";

export const VendorStore = () => {
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
    <>
      <HomeLayout>
        <div className="h-full">
          <div className="text-gray-300 text-3xl py-2 text-center font-bold">
            Vendor Store
          </div>
          <div className="p-6  h-full overflow-y-hidden flex items-center justify-center">
            <div className="bg-gray-900 shadow-2xl rounded-lg max-w-4xl w-full">
              {/* Header Section */}
              <div className="p-6 bg-[#6761D9] text-white rounded-t-lg flex items-center">
                <img
                  src={vendor?.vendorImage?.secure_url}
                  alt={vendor?.fullName}
                  className="w-20 h-20 rounded-full border-2 border-white"
                />
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{vendor?.fullName}</h1>
                  <p className="text-sm">{vendor?.businessName}</p>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="font-semibold text-gray-300">
                    Business Category
                  </h2>
                  <p className="text-gray-400">{vendor?.businessCategory}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-300">Shop Name</h2>
                  <p className="text-gray-400">{vendor?.shopName}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-300">Full Address</h2>
                  <p className="text-gray-400">{vendor?.fullAddress}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-300">
                    Nearby Location
                  </h2>
                  <p className="text-gray-400">{vendor?.nearByLocation}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-300">Phone Number</h2>
                  <p className="text-gray-400">{vendor?.phoneNumber}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-300">TIN Number</h2>
                  <p className="text-gray-400">{vendor?.tin_no}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-300">GST Number</h2>
                  <p className="text-gray-400">{vendor?.gst_no}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};
