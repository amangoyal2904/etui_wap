import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import Service from "network/service";
import { setCommonData } from "./common";
import APIS_CONFIG from "network/config.json";

const slice = createSlice({
  name: "VideoshowNew",
  initialState: {
    data: {},
    isFetching: false,
    isFetchError: false
  },
  reducers: {
    videoshowSuccess: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
    },
    videoshowLoading: (state) => {
      state.isFetching = true;
      state.isFetchError = false;
      state.data = {};
    },
    videoshowError: (state) => {
      state.isFetching = false;
      state.isFetchError = true;
      state.data = {};
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.videoshow
      };
    }
  }
});

export default slice.reducer;

//Actions

const { videoshowSuccess, videoshowLoading, videoshowError } = slice.actions;

export const fetchVideoshowNew = (videoshowId) => async (dispatch) => {
  try {
    dispatch(videoshowLoading);
    const api = APIS_CONFIG.FEED;
    const res = await Service.get({
      api,
      params: { type: "videoshow", msid: videoshowId, platform: "wap", feedtype: "etjson" }
    });
    const data = res.data || {};
    await dispatch(videoshowSuccess(data));
    await dispatch(setCommonData({ page: "videoshownew", data }));
  } catch (e) {
    dispatch(videoshowError);
    return console.error(e.message);
  }
};
