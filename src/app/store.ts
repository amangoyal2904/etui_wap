import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { createWrapper } from "next-redux-wrapper";

import articleshow from "Slices/article";
import videoshow from "Slices/videoshow";
import appHeader from "Slices/appHeader";
import footer from "Slices/footer";
import common from "Slices/common";
import loginSlice from "components/Login/LoginSlice";

const reducer = combineReducers({
  common,
  articleshow,
  videoshow,
  appHeader,
  footer,
  loginSlice
});
export const store = configureStore({
  reducer
});
const makeStore = () => store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<typeof store.getState>;
export const wrapper = createWrapper<AppStore>(makeStore);
