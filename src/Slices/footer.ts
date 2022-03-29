import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const slice = createSlice({
  name: "footer",
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
        ...action.payload.footer,
      };
    },
  },
});

export default slice.reducer;

const { success, loading, error } = slice.actions;

export const fetchFooter = (subsec1) => async (dispatch) => {
  dispatch(loading);
  let url = `https://economictimes.indiatimes.com/pwa_footer_feed.cms?feedtype=etjson&subsec1=${subsec1}`;
  let res = await fetch(url);
  let data = await res.json();
  dispatch(success(data));
};
