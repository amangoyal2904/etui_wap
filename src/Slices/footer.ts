import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";

const slice = createSlice({
  name: "footer",
  initialState: {
    data: {
      widgets: []
    },
    isFetching: false,
    isFetchError: false,
    isFetchSuccess: false
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
      //state.data = [];
    },
    error: (state) => {
      state.isFetching = false;
      state.isFetchError = true;
      //state.data = [];
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.footer
      };
    }
  }
});

export default slice.reducer;

const { success, loading, error } = slice.actions;

export const fetchFooter =
  ({ subsecnames, page }) =>
  async (dispatch) => {
    try {
      dispatch(loading);
      const api = APIS_CONFIG.FEED;
      const extraParams = subsecnames
        ? {
            subsec1: subsecnames.subsec1,
            subsec2: subsecnames.subsec2
          }
        : {};
      const res = await Service.get({
        api,
        params: { type: "footermenu", feedtype: "etjson", ...extraParams, template_name: page }
      });
      const data = res.data || {};
      dispatch(success(data));
    } catch (e) {
      dispatch(error);
      return console.log("error in footer Slice", e);
    }
  };
