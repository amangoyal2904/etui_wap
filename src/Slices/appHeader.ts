import { createSlice } from "@reduxjs/toolkit";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";

const slice = createSlice({
  name: "appHeader",
  initialState: {
    data: {
      searchResult: []
    },
    isFetching: false,
    isFetchError: false,
    isFetchSuccess: false,
    isNavBar: true,
    isCta: true
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
    },
    error: (state) => {
      state.isFetching = false;
      state.isFetchError = true;
    },
    setNavBarStatus: (state, action) => {
      state.isNavBar = action.payload;
    },
    setCtaStatus: (state, action) => {
      state.isCta = action.payload;
    }
  }
});

export default slice.reducer;

export const { success, loading, error, setNavBarStatus, setCtaStatus } = slice.actions;

export const fetchMenu = () => async (dispatch) => {
  dispatch(loading);
  const api = APIS_CONFIG.REQUEST;
  const params = {
    type: "menu"
  };
  Service.get({ api, params })
    .then((res) => {
      dispatch(success(res.data));
    })
    .catch((err) => {
      console.error(err.message);
    });
};
