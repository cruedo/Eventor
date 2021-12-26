import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    user: {}
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = {...state.user, ...action.payload}
        }
    }
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer