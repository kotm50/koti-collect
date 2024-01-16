import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    userName: "",
    accessToken: "",
    admin: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
    },
    clearUser: state => {
      state.userId = "";
      state.userName = "";
      state.accessToken = "";
      state.admin = false;
    },
    getNewToken: (state, action) => {
      return { ...state, accessToken: action.payload.accessToken };
    },
  },
});

export const { loginUser, clearUser, getNewToken } = userSlice.actions;
export default userSlice.reducer;
