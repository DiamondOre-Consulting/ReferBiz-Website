import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/axiosInstance"
import { toast } from "sonner";


const initialState = {
    userList: [{}],
    vendorList: [{}],
    categoriesList: [{}],
}

export const getUsersList = createAsyncThunk('/admin/user/list', async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        let res = axiosInstance.get(`admin/user-list?${params}`);

        res = await res;
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const getVendorsList = createAsyncThunk('/admin/vendor/list', async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        let res = axiosInstance.get(`admin/vendor-list?${params}`);

        res = await res;
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const getCategoriesList = createAsyncThunk('/admin/category/list', async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        let res = axiosInstance.get(`admin/category-list?${params}`);

        res = await res;
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});


export const addCategory = createAsyncThunk('/admin/category/add', async (data) => {
    try {
        let res = axiosInstance.post(`admin/add-category`, data);

        res = await res;
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const deleteCategory = createAsyncThunk('/admin/category/delete', async (data) => {
    try {
        let res = axiosInstance.delete(`admin/delete-category/${data}`);

        res = await res;
        return res.data;
    } catch (e) {
        return toast.error(e?.response?.data?.message);
    }
});

export const updateCategory = createAsyncThunk('/admin/category/update', async (data) => {
    try {
        let res = axiosInstance.delete(`admin/update-category/${data[0]}`, data[1]);

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
        }).addCase(getCategoriesList.fulfilled, (state, action) => {
            state.categoriesList = action?.payload?.list
        }).addCase(addCategory.fulfilled, (state, action) => {
            state.categoriesList = action?.payload?.list
        }).addCase(deleteCategory.fulfilled, (state, action) => {
            state.categoriesList = action?.payload?.list
        }).addCase(updateCategory.fulfilled, (state, action) => {
            state.categoriesList = action?.payload?.list
        })
    }
})


export default listSlice.reducer