import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: {},
};

export const userDataReducer = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        changeUserData: (state, action) => {
            state.userData = action.payload;
        },
    },
});

export const { changeUserData } = userDataReducer.actions;

export default userDataReducer.reducer;
