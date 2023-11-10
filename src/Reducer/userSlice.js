import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: "",
    admin: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
    },
    clearUser: state => {
      state.accessToken = "";
      state.admin = false;
    },
    getNewToken: (state, action) => {
      return { ...state, accessToken: action.payload.accessToken };
    },
    refreshPoint: (state, action) => {
      state.point = action.payload.point;
    },
    buyGift: (state, action) => {
      state.point = action.payload.point;
    },
  },
});

export const { loginUser, clearUser, buyGift, getNewToken, refreshPoint } =
  userSlice.actions;
export default userSlice.reducer;
