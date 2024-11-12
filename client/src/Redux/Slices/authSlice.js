import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axiosInstance from '../../Helper/axiosInstance';

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === true || false,
    data: localStorage.getItem('data') !== "undefined" ? JSON.parse(localStorage.getItem('data')) : {},
};

export const createAccount = createAsyncThunk('/user/register', async (data) => {
    try {
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

    }
});

export default authSlice.reducer;