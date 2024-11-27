import HomeLayout from "../../Layout/HomeLayout";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../Redux/Slices/vendorSlice";

export const VendorContact = () => {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state?.vendor?.vendorProfile);

  console.log("date", vendor);
  const fetchData = async () => {
    await dispatch(userProfile());
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [formData, setFormData] = useState({
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <HomeLayout>
        <div className="text-gray-300 text-3xl py-2 text-center font-bold">
          Contact Us
        </div>
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
            {status && (
              <p className="text-center mt-2 text-green-500">{status}</p>
            )}
          </form>
        </div>
      </HomeLayout>
    </>
  );
};
