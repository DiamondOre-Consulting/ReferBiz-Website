import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addPayment, getVendorData } from "../Redux/Slices/vendorSlice";
import { userProfile } from "../Redux/Slices/authSlice";
import BreadCrumbs from "../Components/BreadCrumbs";
import { IndianRupee } from "lucide-react";
import { IoMdStar } from "react-icons/io";
import { toast } from "sonner";
import { IoIosPeople } from "react-icons/io";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../Components/Dialogue";
import { ratingToVendor } from "../Redux/Slices/vendorSlice";

const VendorDetail = () => {
  const vendorData = useSelector((state) => state?.vendor?.vendorData);
  const data = useSelector((state) => state?.auth?.data);
  console.log("user", data);
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const { id } = useParams();
  console.log(id);

  const dispatch = useDispatch();
  console.log("vendor", vendorData);
  console.log(
    "res",
    vendorData.totalRatingSum,
    vendorData.totalNumberGivenReview
  );
  const fetchData = async () => {
    await dispatch(getVendorData(id));
  };

  useEffect(() => {
    fetchData();
  }, []);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: vendorData.shopName },
  ];
  const copyToClipboard = () => {
    const link = `http://localhost:5173/register?referralCode=${data.referralCode}`;
    navigator.clipboard.writeText(link).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };
  const handlePay = async () => {
    await dispatch(addPayment([id, { amount: Number(amount) }]));
    setIsPaid(true);
    // setTimeout(() => {
    //   setIsModalOpen(false);
    // }, 100);
  };
  const handleRating = async (star) => {
    setRating(star);
    await dispatch(ratingToVendor([vendorData._id, { starRating: rating }]));
    await dispatch(getVendorData(vendorData._id));
  };

  return (
    <>
      <Header />
      <BreadCrumbs headText={vendorData.shopName} items={breadcrumbItems} />;
      <div className="max-w-[85rem] mx-auto  shadow-xl bg-gray-50 rounded-xl">
        <div className="grid gap-20 lg:grid-cols-2 grid-cols-1">
          <div className="p-5">
            <div className="flex justify-between items-center py-2 ">
              <div className="font-semibold  text-gray-700 text-4xl">
                {vendorData.businessName}
              </div>
              <div>
                <div className="text-lg text-gray-700 items-center flex justify-center font-semibold">
                  <div>
                    {" "}
                    {(
                      vendorData?.totalRatingSum /
                      vendorData?.totalNumberGivenReview
                    ).toFixed(1)}
                  </div>

                  <div>
                    <IoMdStar className="ml-1 text-yellow-500" size={24} />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  rated by {vendorData?.totalNumberGivenReview} people
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 mx-2"></div>
            <div className="flex justify-between">
              <div className="text-gray-700 text-xl py-2 ">
                {vendorData?.fullAddress}
              </div>
              <div className="flex justify-center"></div>
            </div>
            <div className="flex justify-between items-center mt-10 ">
              <div className="text-2xl text-gray-800">
                {vendorData?.businessCategory}
              </div>

              <div className="text-lg flex items-center ml-1">
                Total visits:
                <IoIosPeople size={22} className="mx-1" />
                <span className="flex items-center ">
                  {vendorData?.customerList?.length}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between items-center text-xl my-4">
              <div className="text-blue-600">
                Open now <span className="text-black ml-2"> |</span>
                <span className="text-black ml-2">7am-11pm</span>
              </div>
              <div className="text-lg flex items-center justify-center ml-1">
                Referbiz Transactions:
                <IndianRupee size={15} className="ml-1" />
                <span className="flex items-center justify-center">
                  {vendorData?.totalTransactions}
                </span>
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={copyToClipboard}
                class=" cursor-pointer transition-all w-1/2 bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              >
                Refer
              </button>
              <Dialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                className="w-1/2"
              >
                <DialogTrigger className="w-1/2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    class=" w-full group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]"
                  >
                    <div class="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2">
                      <div class="flex gap-2 items-center justify-center">
                        {isPaid ? (
                          <>
                            <div className="font-semibold text-center flex items-center">
                              Amount <IndianRupee size={18} className="ml-1" />
                              {amount} Paid{" "}
                            </div>
                          </>
                        ) : (
                          <span className="font-semibold text-center flex items-center">
                            {" "}
                            <IndianRupee size={18} className="ml-1" />
                            Pay
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:w-[px] rounded-[20px] max-h-[652px] py-[20px] px-[24px]">
                  <DialogHeader>
                    <DialogTitle className="">
                      Payment
                      <div className="border-t border-neutral-300 text-neutral-300 mt-2"></div>
                    </DialogTitle>
                  </DialogHeader>
                  {isPaid ? (
                    <>
                      <div className="text-green-600 text-lg text-center font-semibold">
                        Amount {amount} Sucessfully Paid
                      </div>
                      <div className="flex justify-center">
                        <div className="mt-4 text-center ">
                          <div className="font-semibold">
                            Please rate your experience:
                          </div>
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                onClick={() => handleRating(star)}
                                className={`cursor-pointer text-2xl ${
                                  rating >= star
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4 mt-4">
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handlePay}
                        disabled={!amount}
                        className={`w-full text-white px-6 py-2 rounded-lg transition-all ${
                          isPaid
                            ? "bg-green-500 border-green-600 cursor-default"
                            : "bg-blue-500 border-blue-600 hover:brightness-110"
                        }`}
                      >
                        {isPaid ? "Processing" : "Pay"}
                      </button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            {isPaid && (
              <div className="flex justify-center">
                <div className="mt-4 text-center ">
                  <div className="font-semibold">
                    Please rate your experience:
                  </div>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`cursor-pointer text-2xl ${
                          rating >= star ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-5 pr-4">
            <div className="flex justify-between items-center py-2 ">
              <div className="font-semobold  text-gray-700 text-4xl">
                Contact Details
              </div>
            </div>
            <div className="border-t border-gray-200 mx-2"></div>
            <div className="text-gray-700 text-xl mt-2">
              <div className="mb-2">Piyush Gupta</div>
              <div className="border-t border-gray-200 my-2"></div>

              <div className="mb-2">piyushguptaji123@gmail.com</div>
              <div className="border-t border-gray-200 my-2"></div>

              <div className="mb-2">+91 8174075872</div>
              <div className="border-t border-gray-200 my-2"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDetail;
