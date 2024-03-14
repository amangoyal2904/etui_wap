import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import appHeader from "Slices/appHeader";
import login from "Slices/login";
import bookmark from "Slices/bookmark";

const reducer = combineReducers({
  appHeader,
  login,
  bookmark
});

export const store = configureStore({
  reducer
});
const makeStore = () => store;

// export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<typeof store.getState>;
