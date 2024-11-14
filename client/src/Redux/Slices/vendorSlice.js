import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'
import axiosInstance from '../../Helper/axiosInstance';

const initialState = {
    vendorList: localStorage.getItem('vendorList') !== "undefined" ? JSON.parse(localStorage.getItem('vendorList')) : [],
};

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

export const getVendorListByLocation = createAsyncThunk('/vendor/nearby', async (data) => {
    try {
        console.log(data)
        let res = axiosInstance.post('/vendor/nearby', data);
        res = await res;
        return res.data;
    } catch (e) {
        toast.error("Something went wrong")
        return e?.response?.data?.message;
    }
});



const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVendorListByLocation.fulfilled, (state, action) => {
                localStorage.setItem('vendorList', JSON.stringify(action.payload.vendors));
                state.vendorList = action.payload.vendors;
            })

    }
});

export default vendorSlice.reducer;