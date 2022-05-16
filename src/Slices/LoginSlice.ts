import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  userInfo: {}
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      console.log("setLoggedIn payload:", action);
      state.isLogin = true;
      state.userInfo = action.payload;
    },
    setLoggedOut: (state) => {
      state.isLogin = false;
      state.userInfo = {};
    }
  }
});

// Action creators are generated for each case reducer function
export const { setLoggedIn, setLoggedOut } = loginSlice.actions;

export default loginSlice.reducer;
