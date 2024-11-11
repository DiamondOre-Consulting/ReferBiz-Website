import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axiosInstance from '../../Helper/axiosInstance';

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === true || false,
    data: localStorage.getItem('data') !== "undefined" ? JSON.parse(localStorage.getItem('data')) : {},
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

    }
});

export default authSlice.reducer;