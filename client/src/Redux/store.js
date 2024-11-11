import { configureStore } from '@reduxjs/toolkit'
import vendorReducer from './Slices/vendorSlice'
import authReducer from './Slices/authSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        vendor: vendorReducer
    },
    devTools: true
})

export default store