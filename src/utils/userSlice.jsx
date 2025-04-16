import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: null, // Initial state is null until a user logs in or signs up
  reducers: {
    addUser: (state, action) => {
      return action.payload; // Set the user data in Redux state
    },
    removeUser: () => {
      return null; // Reset user data when logged out
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
