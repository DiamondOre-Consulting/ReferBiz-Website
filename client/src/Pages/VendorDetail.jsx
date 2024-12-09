import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addPayment,
  getPurchaseHistory,
  getVendorData,
} from "../Redux/Slices/vendorSlice";
import PhoneInput from "react-phone-input-2";
import { FaCopy, FaWhatsapp } from "react-icons/fa";
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
  const purchases = useSelector((state) => state?.vendor?.purchaseHistory);
  const data = useSelector((state) => state?.auth?.data);
  console.log("user", data);
  console.log("history", purchases);
  const [amount, setAmount] = useState("");
  const [isReferOptionVisible, setIsReferOptionVisible] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isPaid, setIsPaid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const message = `Check out this amazing link: http://localhost:5173/register?referralCode=${data.referralCode}`;
  const { id } = useParams();
  console.log(id);
  const [videoId, setVideoId] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const videoUrl = "https://www.youtube.com/watch?v=BZlVNdJrYfM";
    const match = videoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&]+)|youtu\.be\/([^?]+)/
    );
    const videoLinkId = match ? match[1] || match[2] : null;
    console.log("videoId", videoLinkId);
    if (videoLinkId) {
      setVideoId(videoLinkId);
    }
  }, []); // Dependency array ensures it runs only once

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const sendMessage = () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    console.log("lenggh", phoneNumber?.length);
    if (phoneNumber?.length != 12) {
      toast.error("Please enter a 10 digit number");
      return;
    }
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const dispatch = useDispatch();
  console.log("vendor", vendorData);
  console.log(
    "res",
    vendorData?.totalRatingSum,
    vendorData?.totalNumberGivenReview
  );
  const fetchData = async () => {
    await dispatch(getVendorData(id));
    await dispatch(getPurchaseHistory(id));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: vendorData?.shopName },
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
  const handleAddAmount = () => {
    if (amount) {
      const discount = Math.floor((amount * 7) / 100);
      const payableAmount = amount - discount;

      setDiscountedAmount(payableAmount); // Display up to 2 decimal places
    }
  };

  const handlePay = async () => {
    if (!discountedAmount) return;

    setIsProcessing(true); // Start processing
    const response = await dispatch(
      addPayment([id, { amount: discountedAmount }])
    );

    await dispatch(getPurchaseHistory(id));
    setIsPaid(true);
    setIsProcessing(false); // Stop processing

    console.log("response", response?.payload?.message);
    if (response?.payload?.message === "Transaction successful.") {
      setIsModalOpen(false);
      setIsPaid(false);
    }
  };
  const handleRating = async (star) => {
    setRating(star);
    await dispatch(ratingToVendor([vendorData._id, { starRating: star }]));
    await dispatch(getVendorData(vendorData._id));
  };

  return (
    <>
      <Header />
      <BreadCrumbs headText={vendorData.shopName} items={breadcrumbItems} />;
      <div className="max-w-[85rem] w-full mx-auto shadow-xl bg-gray-50 rounded-xl">
        <div className="space-y-4 p-4">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : videoId ? (
            <div className="w-full border border-gray-600 mx-auto mt-4 aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-96 rounded-md"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&rel=0`}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <p>Loading video...</p>
          )}
        </div>

        <div className="grid gap-20 lg:grid-cols-2 grid-cols-1">
          <div className="p-5">
            <div className="flex justify-between items-center py-2 ">
              <div className="font-semibold  text-gray-700 text-4xl">
                {vendorData?.shopName}
              </div>
              <div>
                <div className="text-lg text-gray-700 items-center flex justify-center font-semibold">
                  <div>
                    {vendorData?.totalNumberGivenReview > 0
                      ? (
                          vendorData.totalRatingSum /
                          vendorData.totalNumberGivenReview
                        ).toFixed(1)
                      : "0"}
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
                onClick={() => setIsReferOptionVisible(!isReferOptionVisible)}
                className="cursor-pointer transition-all w-1/2 bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              >
                Refer
              </button>

              {/* Options below the Refer Button */}
              <Dialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                className="w-1/2"
              >
                <DialogTrigger className="w-1/2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]"
                  >
                    <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2">
                      <div className="flex gap-2 items-center justify-center">
                        <span className="font-semibold text-center flex items-center">
                          <IndianRupee size={18} className="ml-1" />
                          Pay
                        </span>
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:w-[px] rounded-[20px] max-h-[652px] py-[20px] px-[24px]">
                  <DialogHeader>
                    <DialogTitle>
                      Payment
                      <div className="border-t border-neutral-300 text-neutral-300 mt-2"></div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 mt-2">
                    <div>
                      <label className="text-base  font-semibold text-black">
                        Enter Bill Amount
                      </label>
                      <div className="flex mt-2 items-center gap-4">
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddAmount}
                          disabled={!amount}
                          className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:brightness-110"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {/* {discountedAmount !== null && (
                      <div className="text-sm text-gray-700">
                        <p>Original Amount: ₹{amount}</p>
                        <p>Discount (7%): -₹{(amount * 7) / 100}</p>
                        <p className="font-semibold">
                          Payable Amount: ₹{discountedAmount}
                        </p>
                      </div>
                    )} */}
                    <div>
                      <label className="text-base  font-semibold text-black">
                        Amount To be Paid
                      </label>
                      <div className="flex flex-col gap-4 mt-2">
                        <input
                          type="number"
                          value={discountedAmount || ""}
                          readOnly
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                        />
                        <button
                          onClick={handlePay}
                          disabled={!discountedAmount || isProcessing || isPaid}
                          className={`w-full text-white px-6 py-2 rounded-lg transition-all ${
                            isPaid
                              ? "bg-green-500 border-green-600 cursor-default"
                              : isProcessing
                              ? "bg-gray-400 border-gray-500 cursor-not-allowed"
                              : "bg-blue-500 border-blue-600 hover:brightness-110"
                          }`}
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></span>
                              Processing...
                            </div>
                          ) : isPaid ? (
                            "Paid"
                          ) : (
                            "Pay"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {isReferOptionVisible && (
              <>
                <div className="flex mt-5 flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 gap-3">
                  <PhoneInput
                    country={"in"}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: true,
                    }}
                    containerClass="w-full"
                    placeholder="Please Enter Phone Number"
                    inputClass="focus:outline-none focus:border-blue-900 border-gray-700 text-gray-800 rounded-md w-full py-2 px-3"
                    buttonClass="bg-gray-300 focus:outline-none focus:border focus:border-blue-600 rounded-l-md"
                    dropdownClass="custom-dropdown bg-gray-200 shadow-lg"
                  />

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                    <button
                      onClick={sendMessage}
                      className="cursor-pointer w-full sm:w-32 h-12 transition-all bg-blue-500 text-white px-4 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    >
                      Send
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center w-full sm:w-12 h-12 bg-gray-300 text-gray-700 rounded-lg sm:rounded-full border-gray-300 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    >
                      <FaCopy size={20} />
                    </button>

                    <button
                      onClick={shareOnWhatsApp}
                      className="flex items-center justify-center w-full sm:w-12 h-12 bg-green-600 text-white rounded-lg sm:rounded-full border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    >
                      <FaWhatsapp size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}

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
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <img
                    src={vendorData?.vendorImage?.secure_url}
                    className={` hidden  duration-300 lg:block border-borderDark shadow-[0px_0px_10px_-3px_#808080] h-[3rem] w-[3rem] border-white rounded-full`}
                  />
                </div>
                <div className="border-t border-gray-200 mx-2"></div>
                <div className="text-gray-700 text-xl mt-2">
                  <div className="mb-2">{vendorData?.fullName}</div>
                  <div className="border-t border-gray-200 my-2"></div>

                  <div className="mb-2">{vendorData?.vendorEmail}</div>
                  <div className="border-t border-gray-200 my-2"></div>

                  <div className="mb-2">{vendorData?.phoneNumber}</div>
                  <div className="border-t border-gray-200 my-2"></div>
                </div>
              </div>
              <div className=" bg-gray-200  text-gray-600">
                <div className="flex items-center justify-center">
                  Youtube video coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-md shadow-lg">
          {/* Header */}
          <div className="grid grid-cols-3 sm:grid-cols-3 font-semibold bg-blue-500 text-base text-white p-3 rounded-t-md">
            <div className="text-center">#</div>
            <div className="text-center">Amount</div>
            <div className="text-center">Date</div>
          </div>

          {/* Body */}
          {purchases
            ?.slice()
            .reverse()
            .map((purchase, index) => (
              <div
                key={index}
                className={`text-base grid grid-cols-3 sm:grid-cols-3  ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                } p-3`}
              >
                <div className="text-center">{index + 1}</div>
                <div className="text-center font-medium text-gray-800">
                  ₹{purchase.amount}
                </div>
                <div className="text-center text-gray-600">
                  {new Date(purchase.date).toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default VendorDetail;
