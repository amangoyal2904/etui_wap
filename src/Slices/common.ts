import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { fetchFooter } from "./footer";

const slice = createSlice({
  name: "common",
  initialState: {
    data: {
      subsecnames: {},
      page: "home",
      version_control: {}
    }
  },
  reducers: {
    update: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.common
      };
    }
  }
});

export default slice.reducer;

//Actions

const { update } = slice.actions;

export const setCommonData =
  ({ page, data }) =>
  async (dispatch) => {
    try {
      const { seo = {}, version_control = {} } = data || {};
      const { subsecnames = {} } = seo;
      dispatch(update({ subsecnames, page, version_control }));
      await dispatch(fetchFooter({ subsecnames, page }));
    } catch (e) {
      return console.error("error in common Slice", e.message);
    }
  };
