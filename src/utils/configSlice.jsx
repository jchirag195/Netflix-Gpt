import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
    name: "config",
    initialState: {
        lang:"en",
    },
    reducers:{
        changedLanguage: (state, action) => {
            state.lang = action.payload;
        }
    }
})

export const { changedLanguage } = configSlice.actions;
export default configSlice.reducer;