import { createSlice } from "@reduxjs/toolkit";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV, getCookie } from "utils";

const slice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarkData: {
      details: []
    },
    isFetched: false
  },
  reducers: {
    fetchBookmarkSuccess: (state, action) => {
      state.bookmarkData = action.payload;
      state.isFetched = true;
    },
    fetchBookmarkError: (state, action) => {
      state.bookmarkData = {
        details: []
      };
      state.isFetched = false;
    },
    fetchBookmarkDefault: (state) => {
      state.bookmarkData = {
        details: []
      };
      state.isFetched = false;
    }
  }
});

export default slice.reducer;

export const { fetchBookmarkSuccess, fetchBookmarkError, fetchBookmarkDefault } = slice.actions;

export const fetchBookmark = (msid, type) => async (dispatch) => {
  const Authorization = typeof getCookie("peuuid") == "string" ? getCookie("peuuid") : getCookie("ssoid");
  const url = APIS_CONFIG.getSavedNewsStatus[APP_ENV];
  const params = {
    prefdataval: msid,
    usersettingsubType: type
  };
  const headers = {
    Accept: "application/json",
    Authorization: Authorization
  };
  Service.get({ url, headers, params })
    .then((res) => {
      dispatch(fetchBookmarkSuccess(res.data));
    })
    .catch((err) => {
      dispatch(fetchBookmarkError);
      console.error("Book Mark Status Error", err.message);
    });
};
