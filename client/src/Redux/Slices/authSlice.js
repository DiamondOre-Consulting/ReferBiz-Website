import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axiosInstance from '../../Helper/axiosInstance';

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
    data: localStorage.getItem('data') !== "undefined" ? JSON.parse(localStorage.getItem('data')) : {},
    role: localStorage.getItem('role') || "",
};

export const createAccount = createAsyncThunk('/user/register', async (data) => {
    try {
        console.log(data)

        let res = axiosInstance.post('user/register', data);

        res = await res;
        toast.success(res.data.message)

        return res.data;
    } catch (e) {
        toast.error(e?.response?.data?.message);
        throw e;
    }
});

export const loginAccount = createAsyncThunk('/user/login', async (data) => {
    try {
        let res = axiosInstance.post('/user/login', data);

        res = await res;
        toast.success(res.data.message)
        return res.data;
    } catch (e) {
        toast.error(e?.response?.data?.message);

        throw e;

    }
});

export const logout = createAsyncThunk('/user/logout', async () => {
    try {
        let res = axiosInstance.get('/user/logout');

        res = await res;
        return res.data;
    } catch (e) {
        return e?.response?.data?.message;

    }
});

export const userProfile = createAsyncThunk('/user/details', async () => {
    try {
        const res = axiosInstance.get("/user/");
        return (await res).data;
    } catch (e) {
        toast.error(e?.message);
        throw e;
    }
});

export const editProfile = createAsyncThunk('user/update-profile', async (data) => {
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
});

export const changePassword = createAsyncThunk('user/update-password', async (data) => {
    try {
        let res = axiosInstance.post('user/change-password', data);
        res = await res;
        toast.success(res?.data.message);
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const forgotPassword = createAsyncThunk('user/forgot-password', async (data) => {
    try {
        let res = axiosInstance.post('user/forgot-password', data);
        res = await res;
        toast.success(res?.data.message);
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const resetPassword = createAsyncThunk('user/forgot-password', async (data) => {
    try {
        let res = axiosInstance.post('user/reset-password', data);
        res = await res;
        toast.success(res?.data.message);
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const vendorLoginAccount = createAsyncThunk('/vendor/login', async (data) => {
    try {
        let res = axiosInstance.post('/vendor/login', data);

        res = await res;
        toast.success(res.data.message)
        return res.data;
    } catch (e) {
        toast.error(e?.response?.data?.message);

        throw e;

    }
});

export const vendorLogout = createAsyncThunk('/vendor/logout', async () => {
    try {
        let res = axiosInstance.get('/vendor/logout');

        res = await res;
        return res.data;
    } catch (e) {
        return e?.response?.data?.message;

    }
});

export const vendorProfile = createAsyncThunk('/vendor/details', async () => {
    try {
        const res = axiosInstance.get("/vendor/");
        return (await res).data;
    } catch (e) {
        toast.error(e?.message);
        throw e;
    }
});

export const vendorEditProfile = createAsyncThunk('vendor/update-profile', async (data) => {
    try {
        let res = axiosInstance.put(`vendor/update/${data[0]}`, data[1]);
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
});

export const vendorChangePassword = createAsyncThunk('vendor/update-password', async (data) => {
    try {
        let res = axiosInstance.post('vendor/change-password', data);
        res = await res;
        toast.success(res?.data.message);
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const vendorForgotPassword = createAsyncThunk('vendor/forgot-password', async (data) => {
    try {
        let res = axiosInstance.post('vendor/forgot-password', data);
        res = await res;
        toast.success(res?.data.message);
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const vendorResetPassword = createAsyncThunk('vendor/forgot-password', async (data) => {
    try {
        let res = axiosInstance.post('vendor/reset-password', data);
        res = await res;
        toast.success(res?.data.message);
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

const authSlice = createSlice({
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
            console.log(action)
            localStorage.setItem('data', JSON.stringify(action?.payload?.user))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.user?.role)
            state.isLoggedIn = true
            state.data = action?.payload?.user
            state.role = action?.payload?.user?.role
        }).addCase(vendorLoginAccount.fulfilled, (state, action) => {
            localStorage.setItem('data', JSON.stringify(action?.payload?.vendor))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.vendor?.role)
            state.isLoggedIn = true
            state.data = action?.payload?.vendor
            state.role = action?.payload?.vendor?.role
        }).addCase(vendorLogout.fulfilled, (state) => {
            localStorage.clear()
            state.data = {}
            state.isLoggedIn = false
            state.role = ""
        }).addCase(vendorProfile.fulfilled, (state, action) => {
            console.log(action)
            localStorage.setItem('data', JSON.stringify(action?.payload?.vendor))
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('role', action?.payload?.vendor?.role)
            state.isLoggedIn = true
            state.data = action?.payload?.vendor
            state.role = action?.payload?.vendor?.role
        })


    }
});

export default authSlice.reducer;