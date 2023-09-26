import { configureStore } from '@reduxjs/toolkit';
import userDataReducer from './reducers/view-user-data';

export const store = configureStore({
    reducer: {
        userData: userDataReducer,
    },
});
