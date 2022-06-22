import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  userInfo: {},
  permissions: [],
  isprimeuser: 0
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.login = true;
      const { login, userInfo, permissions, isprimeuser } = action.payload;
      state.userInfo = userInfo;
      state.login = login;
      state.permissions = permissions;
      state.isprimeuser = isprimeuser;
    },
    setLoggedOut: (state) => {
      state.login = false;
      state.userInfo = {};
      state.permissions = [];
      state.isprimeuser = 0;
    },
    setIsPrime: (state, action) => {
      state.isprimeuser = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setLoggedIn, setLoggedOut, setIsPrime } = loginSlice.actions;

export default loginSlice.reducer;
