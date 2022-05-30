import { createSlice } from "@reduxjs/toolkit";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { APP_ENV, getCookie } from "utils";

const slice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarkData: {}
  },
  reducers: {
    fetchBookmarkStatus: (state, action) => {
      state.bookmarkData = action.payload;
    }
  }
});

export default slice.reducer;

export const { fetchBookmarkStatus } = slice.actions;

export const fetchBookmark = () => async (dispatch) => {
  const Authorization = getCookie("peuuid") != undefined ? getCookie("peuuid") : getCookie("ssoid");
  const url = APIS_CONFIG.getSavedNewsStatus[APP_ENV];
  const params = {
    stype: 0,
    pagesize: 100,
    pageno: 1
  };
  const headers = {
    Accept: "application/json",
    Authorization: Authorization
  };
  Service.get({ url, headers, params })
    .then((res) => {
      console.log("axios response", res);
      dispatch(fetchBookmarkStatus(res));
    })
    .catch((err) => {
      console.error("Get Book Mark Status Error", err.message);
    });
};
