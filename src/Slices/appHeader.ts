import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import Service from 'network/service';
import APIS_CONFIG from "network/config.json";

const slice = createSlice({
  name: "appHeader",
  initialState: {
    data: [],
    isFetching: false,
    isFetchError: false,
    isFetchSuccess: false,
  },
  reducers: {
    success: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
      state.isFetchSuccess = true;
    },
    loading: (state) => {
      state.isFetching = true;
      state.isFetchError = false;
      state.data = [];
    },
    error: (state) => {
      state.isFetching = false;
      state.isFetchError = true;
      state.data = [];
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log("HYDRATE", action.payload);
      return {
        ...state,
        ...action.payload.appHeader,
      };
    },
  },
});

export default slice.reducer;

const { success, loading, error } = slice.actions;

export const fetchMenu = () => async (dispatch) => {
  dispatch(loading);
  let url = APIS_CONFIG.REQUEST;
  let params = {
    type: "menu",
  };
  Service.get(url, params)
  .then(res => {
    dispatch(success(res.data));
  })
  .catch(err => {
    console.error(err.message);  
  })
};
