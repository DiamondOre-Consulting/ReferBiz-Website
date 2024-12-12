import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
import axiosInstance from "../../Helper/axiosInstance";

const initialState = {
  vendorList:
    localStorage.getItem("vendorList") !== "undefined"
      ? JSON.parse(localStorage.getItem("vendorList"))
      : [],
  categoryList: [],
  vendorListByCategories: [],
  subCategoryList: [],
  vendorListBySubCategory: [],
  vendorData: {},
  listOfSubCategories: [],
  customerList: [],
  vendorProfile: {},
  refferalList: [],
  purchaseHistory: [],
};

export const loginAccount = createAsyncThunk("/user/login", async (data) => {
  try {
    let res = axiosInstance.post("/user/login", data);

    res = await res;
    toast.success(res.data.message);
    return res.data;
  } catch (e) {
    toast.error(e?.response?.data?.message);

    throw e;
  }
});

export const logout = createAsyncThunk("/user/logout", async () => {
  try {
    let res = axiosInstance.get("/user/logout");

    res = await res;
    return res.data;
  } catch (e) {
    return e?.response?.data?.message;
  }
});

export const userProfile = createAsyncThunk("/user/details", async () => {
  try {
    const res = axiosInstance.get("/vendor/");
    const response = await res;

    return response.data;
  } catch (e) {
    toast.error(e?.message);
    throw e;
  }
});

export const editProfile = createAsyncThunk(
  "user/update-profile",
  async (data) => {
    try {
      let res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
      // toast.promise(res, {
      //     loading: "Updating Profile!",
      //     success: (data) => data?.data.message,
      //     error: "Failed to update!"
      // });
      res = await res;
      return res.data;
    } catch (e) {
      return e?.response?.data?.message;
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/update-password",
  async (data) => {
    try {
      let res = axiosInstance.post("user/change-password", data);
      res = await res;
      toast.success(res?.data.message);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgot-password",
  async (data) => {
    try {
      let res = axiosInstance.post("user/forgot-password", data);
      res = await res;
      toast.success(res?.data.message);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/forgot-password",
  async (data) => {
    try {
      let res = axiosInstance.post("user/reset-password", data);
      res = await res;
      toast.success(res?.data.message);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const getVendorListByLocation = createAsyncThunk(
  "/vendor/nearby",
  async (data) => {
    try {
      console.log(data);
      let res = axiosInstance.post("/vendor/nearby", data);
      res = await res;
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);

export const getCategoryList = createAsyncThunk(
  "/user/categories",
  async (location) => {
    console.log("loc", location);
    try {
      let res = axiosInstance.get(`/user/get-allCategories/${location}`);
      console.log(res);
      res = await res;
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const getVendorByCategory = createAsyncThunk(
  "/user/vendorByCategory",
  async (data) => {
    try {
      console.log(1);
      const { category, location } = data;
      console.log(data);
      let res = axiosInstance.get(
        `/user/search-vendor-category/${location}/${category}`
      );
      console.log("res", res);
      res = await res;
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const getVendorBySubCategory = createAsyncThunk(
  "/user/vendorBySubCategory",
  async (data) => {
    try {
      console.log(1);
      const { category, location, item } = data;
      console.log(data);
      let res = axiosInstance.get(
        `/user/search-vendor-subcategory/${location}/${category}/${item}`
      );
      console.log("res", res);
      res = await res;
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);

export const getSubCategoryList = createAsyncThunk(
  "/user/subCategories",
  async (data) => {
    const { location, category } = data;
    console.log("loc", location, category);
    try {
      let res = axiosInstance.get(
        `/user/get-subCategory/${location}/${category}`
      );

      res = await res;
      console.log("response for subcategory", res);

      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const getVendorData = createAsyncThunk(
  "/vendor/vendorData",
  async (data) => {
    try {
      let res = axiosInstance.get(`/vendor/get-vendor-data/${data}`);

      res = await res;
      console.log("res", res);
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const listOfAllSubCategories = createAsyncThunk(
  "/admin/category",
  async (data) => {
    try {
      let res = axiosInstance.put(`/admin/category/${data}`);
      console.log(res);
      res = await res;
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);

export const addSubCategories = createAsyncThunk(
  "/vendor/subcategory",
  async (data) => {
    const id = data[0];
    const items = data[1];
    try {
      let res = axiosInstance.post(`/vendor/add-product/${data[0]}`, data[1]);
      console.log("result", res);
      res = await res;
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const deleteSubCategories = createAsyncThunk(
  "/vendor/subcategory",
  async (data) => {
    console.log("data", data);
    try {
      let res = axiosInstance.post(
        `/vendor/delete-product/${data[0]}`,
        data[1]
      );
      console.log("result", res);
      res = await res;
      toast.success("Deleted successfully");
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const addPayment = createAsyncThunk(
  "/user/add-payment",
  async (data) => {
    const amount = data[1];
    console.log("data", data[1]);
    try {
      let res = axiosInstance.post(`/user/add-payment/${data[0]}`, data[1]);
      console.log("result", res);
      res = await res;
      toast.success("Payment done successfully");
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);

export const getCustomers = createAsyncThunk(
  "/vendor/getCustomers",
  async (data) => {
    try {
      const params = new URLSearchParams(data).toString();
      let res = axiosInstance.get(`/vendor/customer-list?${params}`);

      res = await res;
      console.log("result", res);
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);

export const editVendorProfile = createAsyncThunk(
  "vendor/update-profile",
  async (data) => {
    try {
      let res = axiosInstance.put(`vendor/update/${data[0]}`, data[1]);

      res = await res;
      console.log("update res", res);
      return res.data;
    } catch (e) {
      return e?.response?.data?.message;
    }
  }
);
export const vendorContact = createAsyncThunk(
  "/vendor/contact",
  async (data) => {
    console.log("vendorcontact", data);

    try {
      let res = axiosInstance.post(`/vendor/contact-us`, data);

      res = await res;
      console.log(res);
      toast.success("Email Send Successfully");
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const userContact = createAsyncThunk("/vendor/contact", async (data) => {
  console.log("vendorcontact", data);

  try {
    let res = axiosInstance.post(`/user/user-contact-us`, data);

    res = await res;
    console.log(res);
    toast.success("Email Send Successfully");
    return res.data;
  } catch (e) {
    toast.error("Something went wrong");
    return e?.response?.data?.message;
  }
});
export const getReferralList = createAsyncThunk(
  "/user/getReferralList",
  async (data) => {
    console.log("data for refer", data);
    try {
      const params = new URLSearchParams(data).toString();
      let res = axiosInstance.get(`/user/referral-list?${params}`);

      res = await res;
      console.log("result for referral", res);
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const ratingToVendor = createAsyncThunk(
  "/vendor/contact",
  async (data) => {
    try {
      console.log(data);
      let res = axiosInstance.post(`/user/rating/${data[0]}`, data[1]);

      res = await res;
      console.log(res);
      toast.success("Rating Added Successfully");
      return res.data;
    } catch (e) {
      toast.error("Something went wrong");
      return e?.response?.data?.message;
    }
  }
);
export const getPurchaseHistory = createAsyncThunk(
  "/user/purchaseData",
  async (data) => {
    try {
      const vendorId = data;
      console.log(data);
      let res = axiosInstance.get(`/user/get-purchase-history/${vendorId}`);

      res = await res;
      console.log(res);
      return res.data;
    } catch (e) {
      return e?.response?.data?.message;
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "/user/confirm-payment",
  async (data) => {
    try {
      const { vendorId, paymentId, status } = data;
      let res = await axiosInstance.post(
        `/user/confirm-payment/${vendorId}/${paymentId}`,
        { status }
      );
      toast.success("Payment processed successfully");
      return res.data;
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to process payment");
      throw e;
    }
  }
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVendorListByLocation.fulfilled, (state, action) => {
        localStorage.setItem(
          "vendorList",
          JSON.stringify(action.payload.vendors)
        );
        state.vendorList = action.payload.vendors;
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.categoryList = action?.payload?.categories;
      })
      .addCase(getVendorByCategory.fulfilled, (state, action) => {
        state.vendorListByCategories = action?.payload?.vendors;
      })
      .addCase(getSubCategoryList.fulfilled, (state, action) => {
        state.subCategoryList = action?.payload?.items;
      })
      .addCase(getVendorBySubCategory.fulfilled, (state, action) => {
        state.vendorListBySubCategory = action?.payload?.vendors;
      })
      .addCase(getVendorData.fulfilled, (state, action) => {
        console.log("cation", action);
        state.vendorData = action?.payload?.user;
      })
      .addCase(listOfAllSubCategories.fulfilled, (state, action) => {
        state.listOfSubCategories = action?.payload?.category;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customerList = action?.payload?.customers;
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.vendorProfile = action?.payload?.user;
      })
      .addCase(getReferralList.fulfilled, (state, action) => {
        state.refferalList = action?.payload?.referrals;
      })
      .addCase(getPurchaseHistory.fulfilled, (state, action) => {
        state.purchaseHistory = action?.payload?.lastPurchases;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        // You can update any state if needed after payment confirmation
      });
  },
});

export default vendorSlice.reducer;
