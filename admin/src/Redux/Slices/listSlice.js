import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/axiosInstance"
import { toast } from "sonner";


const initialState = {
    userList: [{}],
    vendorList: [{}],
}

export const getUsersList = createAsyncThunk('/admin/user/list', async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        let res = axiosInstance.get(`/user-list?${params}`);

        res = await res;
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const getVendorsList = createAsyncThunk('/admin/vendor/list', async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        let res = axiosInstance.get(`/vendor-list?${params}`);

        res = await res;
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});



const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsersList.fulfilled, (state, action) => {
            state.userList = action?.payload?.list
        }).addCase(getVendorsList.fulfilled, (state, action) => {
            state.vendorList = action?.payload?.list
        })
    }
})


export default listSlice.reducer