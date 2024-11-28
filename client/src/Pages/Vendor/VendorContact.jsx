import HomeLayout from "../../Layout/HomeLayout";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../Redux/Slices/vendorSlice";
import { vendorContact } from "../../Redux/Slices/vendorSlice";

export const VendorContact = () => {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state?.vendor?.vendorProfile);

  console.log("data", vendor);

  const fetchData = async () => {
    await dispatch(userProfile());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if vendor data is loaded
    if (!vendor || !vendor.vendorEmail) {
      console.log("Vendor data not loaded");
      return;
    }

    const formPayload = {
      email: vendor.vendorEmail,
      message: message,
      name: vendor.fullName,
      phoneNumber: vendor.phoneNumber,
      shopName: vendor.shopName,
    };
    console.log("from", formPayload);
    await dispatch(vendorContact(formPayload));
  };

  return (
    <HomeLayout>
      <div className="py-10 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-300">Contact Us</h1>
          <p className="text-xl text-gray-300 mt-2">
            We'd love to hear from you. Please send us a message.
          </p>
        </div>

        <div className="flex justify-center items-center px-4">
          <div className="w-full max-w-2xl bg-gray-700 shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-semibold text-center text-gray-300 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-300">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  required
                  className="w-full p-4 bg-transparent border border-[#6761D9] text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6761D9]"
                  rows="6"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#6761D9] text-white rounded-lg  focus:ring-2 focus:ring-[#6761D9] transition"
              >
                Send Message
              </button>

              {status && (
                <p className="text-center mt-4 text-green-500 text-lg">
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};
