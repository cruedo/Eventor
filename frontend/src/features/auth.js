import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    authed: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateAuth: (state, action) => {
            state.authed = action.payload
        }
    }
})

export const { updateAuth } = authSlice.actions
export default authSlice.reducer