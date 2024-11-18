import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Slices/authSlice'
import listReducer from './Slices/listSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        list: listReducer,
    },
    devTools: true
})

export default store