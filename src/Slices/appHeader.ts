import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import Service from 'network/service';
import APIS_CONFIG from "network/config.json";

const slice = createSlice({
  name: "AppHeader",
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
        ...action.payload,
      };
    },
  },
});

export default slice.reducer;

//Actions

const { success, loading, error } = slice.actions;

export const fetchMenu = () => async (dispatch) => {
  dispatch(loading);
  let url = APIS_CONFIG.REQUEST;
  let params = {
    type: "menu",
  };
  Service.get(url, params)
  .then(res => {
    // setData(res.data || {});
    dispatch(success(res.data));
  })
  .catch(err => {
    console.error(err.message);
    return err.message;
  })

  // try {
  //   dispatch(loading);
  //   let res = await fetch(
  //     `https://etpwaapi.economictimes.com/request?type=menu`
  //   );
  //   let data = await res.json();
  //   dispatch(success(data));
  // } catch (e) {
  //   return console.error(e.message);
  // }
};
