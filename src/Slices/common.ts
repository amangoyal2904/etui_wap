import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { fetchFooter } from "./footer";

const slice = createSlice({
  name: "common",
  initialState: {
    data: {
      subsec: {},
      pageType: ""
    }
  },
  reducers: {
    update: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      //console.log('HYDRATE', action.payload);
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

export const setCommonData = (data) => async (dispatch) => {
  try {
    dispatch(update(data));
    await dispatch(fetchFooter(data.subsec));
  } catch (e) {
    return console.error(e.message);
  }
};
