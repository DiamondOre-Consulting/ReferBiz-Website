import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "sonner";

const initialState = {
  userList: [{}],
  vendorList: [{}],
  categoriesList: [{}],
  categoryDetail: {},
  vendorData: {},
  userData: {},
};

export const getUsersList = createAsyncThunk(
  "/admin/user/list",
  async (data) => {
    try {
      const params = new URLSearchParams(data).toString();
      let res = axiosInstance.get(`admin/user-list?${params}`);

      res = await res;
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const getVendorsList = createAsyncThunk(
  "/admin/vendor/list",
  async (data) => {
    try {
      const params = new URLSearchParams(data).toString();
      let res = axiosInstance.get(`admin/vendor-list?${params}`);

      res = await res;
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const getCategoriesList = createAsyncThunk(
  "/admin/category/list",
  async (data) => {
    try {
      const params = new URLSearchParams(data).toString();
      let res = axiosInstance.get(`admin/category-list?${params}`);

      res = await res;
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  "/admin/category/add",
  async (data) => {
    try {
      let res = axiosInstance.post(`admin/add-category`, data);

      res = await res;
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "/admin/category/delete",
  async (data) => {
    try {
      let res = axiosInstance.delete(`admin/delete-category/${data}`);

      res = await res;
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "/admin/category/update",
  async (data) => {
    try {
      console.log(data);
      let res = axiosInstance.put(`admin/update-category/${data[0]}`, data[1]);

      res = await res;
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const getCategory = createAsyncThunk("/admin/category", async (data) => {
  try {
    let res = axiosInstance.put(`admin/category/${data}`);

    res = await res;
    return res.data;
  } catch (e) {
    return toast.error(e?.response?.data?.message);
  }
});

export const deleteSubCategory = createAsyncThunk(
  "/admin/category/delete/subcategory",
  async (data) => {
    try {
      console.log(data);
      let res = axiosInstance.put(
        `admin/delete-subCategory/${data[0]}`,
        data[1]
      );

      res = await res;
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const getVendorDetail = createAsyncThunk(
  "/user/detail",
  async (data) => {
    try {
      let res = axiosInstance.get(`admin/vendor-data/${data}`);

      res = await res;
      console.log("respionse gotted", res);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);
export const getUserDetails = createAsyncThunk(
  "/vendor/detail",
  async (data) => {
    try {
      let res = axiosInstance.get(`user/get-user/${data}`);

      res = await res;
      console.log("respionse gotted", res);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const updateVendor = createAsyncThunk(
  "/admin/vendor/update",
  async (data) => {
    try {
      let res = axiosInstance.post(`admin/update-vendor`, data);

      res = await res;
      console.log("upadeted vendr", res);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);
export const updateUserStatus = createAsyncThunk(
  "/user/update-status",
  async (data) => {
    try {
      let res = axiosInstance.put(`admin/update-status/${data[0]}`, data[1]);

      res = await res;
      console.log("updateds status", res);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);
export const uploadCsvForCategoriesAndSubCategories = createAsyncThunk(
  "/admin/upload",
  async (data) => {
    console.log("file", data);
    try {
      let res = axiosInstance.post(`/admin/upload`, data);

      res = await res;
      console.log(res);
      return res.data;
    } catch (e) {
      return e?.response?.data?.message;
    }
  }
);
export const uploadCsvForSubCategories = createAsyncThunk(
  "/admin/upload-subcategory",
  async (data) => {
    try {
      let res = axiosInstance.post(
        `/admin/upload-subcategory/${data[0]}`,
        data[1]
      );

      res = await res;
      console.log(res);
      return res.data;
    } catch (e) {
      return e?.response?.data?.message;
    }
  }
);

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.userList = action?.payload?.list;
      })
      .addCase(getVendorsList.fulfilled, (state, action) => {
        state.vendorList = action?.payload?.list;
      })
      .addCase(getCategoriesList.fulfilled, (state, action) => {
        state.categoriesList = action?.payload?.list;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoriesList = action?.payload?.list;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoriesList = action?.payload?.list;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categoriesList = action?.payload?.list;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.categoryDetail = action?.payload?.category;
      })
      .addCase(getVendorDetail.fulfilled, (state, action) => {
        console.log("action", action.payload);
        state.vendorData = action?.payload?.user;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        console.log("action", action.payload);
        state.userData = action?.payload?.user;
      });
  },
});

export default listSlice.reducer;
