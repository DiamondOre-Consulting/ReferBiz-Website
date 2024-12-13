import React, { useState, useEffect } from "react";
import HomeLayout from "../../Layout/HomeLayout";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { userProfile, confirmPayment } from "../../Redux/Slices/vendorSlice";
import { toast } from "sonner";

const VendorHome = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state?.vendor?.vendorProfile);

  useEffect(() => {
    const savedRequests = localStorage.getItem(
      `paymentRequests_${vendor?._id}`
    );
    if (savedRequests) {
      setPaymentRequests(JSON.parse(savedRequests));
    }
  }, [vendor?._id]);

  useEffect(() => {
    if (vendor?._id && paymentRequests.length > 0) {
      localStorage.setItem(
        `paymentRequests_${vendor._id}`,
        JSON.stringify(paymentRequests)
      );
    }
  }, [paymentRequests, vendor?._id]);

  useEffect(() => {
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
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Connection error. Retrying...");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        console.log("Cleaning up socket connection");
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!socket || !vendor?._id) return;

    const vendorRoom = `vendor_${vendor._id}`;
    socket.emit("joinVendorRoom", vendor._id);
    console.log("Joined vendor room:", vendorRoom);

    const handlePaymentRequest = (data) => {
      console.log("Payment request received in VendorHome:", data);

      setPaymentRequests((prev) => {
        const exists = prev.some((req) => req.paymentId === data.paymentId);
        if (!exists) {
          const newRequests = [...prev, { ...data, timestamp: Date.now() }];
          localStorage.setItem(
            `paymentRequests_${vendor._id}`,
            JSON.stringify(newRequests)
          );

          setTimeout(() => {
            setPaymentRequests((currentRequests) => {
              const updatedRequests = currentRequests.filter(
                (req) => req.paymentId !== data.paymentId
              );
              localStorage.setItem(
                `paymentRequests_${vendor._id}`,
                JSON.stringify(updatedRequests)
              );

              socket.emit("payment-timeout", {
                paymentId: data.paymentId,
                vendorId: vendor._id,
                customerId: data.customerId,
                message:
                  "Vendor did not respond to your request. Please try again!",
              });

              return updatedRequests;
            });
          }, 60000);
          return newRequests;
        }
        return prev;
      });
    };

    socket.on("payment-request", handlePaymentRequest);

    return () => {
      socket.off("payment-request", handlePaymentRequest);
    };
  }, [socket, vendor?._id]);

  const handlePaymentConfirmation = async (paymentId, status, customerId) => {
    if (!socket || !vendor?._id) return;

    try {
      // Update local state and localStorage
      setPaymentRequests((prev) => {
        const newRequests = prev.filter((req) => req.paymentId !== paymentId);
        localStorage.setItem(
          `paymentRequests_${vendor._id}`,
          JSON.stringify(newRequests)
        );
        return newRequests;
      });

      // Emit the confirmation
      socket.emit("payment-confirmation", {
        paymentId: paymentId,
        vendorId: vendor._id,
        status: status,
        customerId: customerId,
      });

      toast.success(`Payment ${status}`);
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to process payment");
    }
  };

  return (
    <HomeLayout>
      <div className="flex flex-wrap justify-center gap-4 text-white">
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Total Visits</h3>
          <p className="text-[1.2rem] ">{vendor?.customerList?.length}</p>{" "}
        </div>
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Total Products</h3>
          <p className="text-[1.2rem]">{vendor?.products?.length}</p>
        </div>
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Total Transactions</h3>
          <p className="text-[1.2rem]">{vendor?.totalTransactions}</p>
        </div>
        <div className="bg-[#726CD1] relative max-w-full min-w-[18rem] overflow-hidden h-[9rem] p-4 rounded-lg">
          <h3 className="text-[1.6rem] font-semibold">Profit Earned</h3>
          <p className="text-[1.2rem]">0</p>
        </div>
      </div>

      <div className="text-white mt-10 text-center">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white p-2 bg-[#726CD1]  w-60 rounded-md text-center ">
            Payment Requests
          </h1>
        </div>

        {paymentRequests.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-center">
              <h2 className="text-xl font-semibold ">
                Pending Payment Requests ({paymentRequests.length})
              </h2>
            </div>
            <div className="space-y-4 grid grid-cols-3 max-w-7xl mx-auto">
              {paymentRequests.map((request) => (
                <div
                  key={request.paymentId}
                  className="bg-gray-800 p-4 rounded-lg max-w-md mx-auto"
                >
                  <p className="mb-3">New Payment Request</p>
                  <p>Customer: {request.customerName}</p>
                  <p>Amount: ₹{request.amount}</p>
                  <p>Message: {request.message}</p>
                  <div className="mt-4 space-x-4">
                    <button
                      className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                      onClick={() =>
                        handlePaymentConfirmation(
                          request.paymentId,
                          "accepted",
                          request.customerId
                        )
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                      onClick={() =>
                        handlePaymentConfirmation(
                          request.paymentId,
                          "rejected",
                          request.customerId
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default VendorHome;
