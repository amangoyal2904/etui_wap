import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  userInfo: {},
  isprimeuser: 0
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      console.log("setLoggedIn payload:", action);
      state.login = true;
      state.userInfo = action.payload;
    },
    setLoggedOut: (state) => {
      state.login = false;
      state.userInfo = {};
    },
    setIsPrime: (state, action) => {
      state.isprimeuser = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setLoggedIn, setLoggedOut, setIsPrime } = loginSlice.actions;

export default loginSlice.reducer;
