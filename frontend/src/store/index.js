import { configureStore } from "@reduxjs/toolkit"
import userReducer from '../features/user'
import authReducer from '../features/auth'

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
    }
})

export default store