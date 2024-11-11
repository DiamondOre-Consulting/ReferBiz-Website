import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'
import axiosInstance from '../../Helper/axiosInstance';

const initialState = {
    vendorList: localStorage.getItem('vendorList') !== "undefined" ? JSON.parse(localStorage.getItem('vendorList')) : {},
};

export const getVendorListByLocation = createAsyncThunk('/vendor/nearby', async (data) => {
    try {
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
                localStorage.setItem('vendorList', JSON.stringify(action.payload.data));
                state.vendorList = action.payload.data;
            })

    }
});

export default vendorSlice.reducer;