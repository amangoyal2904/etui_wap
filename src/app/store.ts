import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { createWrapper } from "next-redux-wrapper";

import article from "Slices/article";
import appHeader from "Slices/appHeader";
import loginReducer from "../components/Login/LoginSlice";

const reducer = combineReducers({
  article,
  appHeader,
  userDetails: loginReducer
});
const store = configureStore({
  reducer
});
const makeStore = () => store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<typeof store.getState>;
export const wrapper = createWrapper<AppStore>(makeStore);
