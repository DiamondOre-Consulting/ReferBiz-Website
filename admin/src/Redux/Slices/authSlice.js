import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axiosInstance from "../../Helper/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  data:
    localStorage.getItem("data") !== "undefined"
      ? JSON.parse(localStorage.getItem("data"))
      : {},
  role: localStorage.getItem("role") || "",
};

export const createAccount = createAsyncThunk(
  "/admin/register",
  async (data) => {
    try {
      let res = axiosInstance.post("admin/register", data);
      res = await res;
      toast.success(res.data.message);
      return res.data;
    } catch (e) {
      toast.error(e?.response?.data?.message);
      throw e;
    }
  }
);

export const loginAccount = createAsyncThunk("/admin/login", async (data) => {
  try {
    let res = axiosInstance.post("admin/login", data);

    res = await res;
    toast.success(res.data.message);
    return res.data;
  } catch (e) {
    toast.error(e?.response?.data?.message);

    throw e;
  }
});

export const logout = createAsyncThunk("/admin/logout", async () => {
  try {
    let res = axiosInstance.get("admin/logout");

    res = await res;
    return res.data;
  } catch (e) {
    return e?.response?.data?.message;
  }
});

export const userProfile = createAsyncThunk("/admin/details", async () => {
  try {
    const res = axiosInstance.get("admin/");
    return (await res).data;
  } catch (e) {
    toast.error(e?.message);
    throw e;
  }
});

export const editProfile = createAsyncThunk(
  "admin/update-profile",
  async (data) => {
    try {
      let res = axiosInstance.put(`admin/update/${data[0]}`, data[1]);
      // toast.promise(res, {
      //     loading: "Updating Profile!",
      //     success: (data) => data?.data.message,
      //     error: "Failed to update!"
      // })
      res = await res;
      return res.data;
    } catch (e) {
      return e?.response?.data?.message;
    }
  }
);

export const changePassword = createAsyncThunk(
  "admin/update-password",
  async (data) => {
    try {
      let res = axiosInstance.post("admin/change-password", data);
      res = await res;
      toast.success(res?.data.message);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "admin/forgot-password",
  async (data) => {
    try {
      let res = axiosInstance.post("/admin/forgot-password", data);
      res = await res;
      toast.success(res?.data.message);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "admin/forgot-password",
  async (data) => {
    try {
      let res = axiosInstance.post("/admin/reset-password", data);
      res = await res;
      toast.success(res?.data.message);
      return res.data;
    } catch (e) {
      return toast.error(e?.response?.data?.message);
    }
  }
);

export const registerVendor = createAsyncThunk('/vendor/register', async (data) => {
    try {
        let res = axiosInstance.post('admin/vendor-register', data)
        res = await res
        toast.success(res.data.message)
        return res.data
    } catch (e) {
        toast.error(e?.response?.data?.message)
        throw e
    }
})

const authSlice = createSlice({
<<<<<<< HEAD
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginAccount.fulfilled, (state, action) => {
            localStorage.setItem('data', JSON.stringify(action?.payload?.user))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.user?.role)
            state.isLoggedIn = true
            state.data = action?.payload?.user
            state.role = action?.payload?.user?.role
        }).addCase(createAccount.fulfilled, (state, action) => {
            localStorage.setItem('data', JSON.stringify(action?.payload?.user))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.user?.role)
            state.isLoggedIn = true
            state.data = action?.payload?.user
            state.role = action?.payload?.user?.role
        }).addCase(logout.fulfilled, (state) => {
            localStorage.clear()
            state.data = {}
            state.isLoggedIn = false
            state.role = ""
        }).addCase(userProfile.fulfilled, (state, action) => {
            localStorage.setItem('data', JSON.stringify(action?.payload?.user))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.user?.role)
            state.isLoggedIn = true
            state.data = action?.payload?.user
            state.role = action?.payload?.user?.role
        })
    }
})

export default authSlice.reducer
=======
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAccount.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      });
  },
});

export default authSlice.reducer;
>>>>>>> 7b8c7f8cdfeafbf0e5304c6111a2cdbccc45ad13
