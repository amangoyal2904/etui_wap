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
      //console.log("HYDRATE", action.payload);
      return {
        ...state,
        ...action.payload.footer,
      };
    },
  },
});

export default slice.reducer;

const { success, loading, error } = slice.actions;

export const fetchFooter = (subsec) => async (dispatch) => {
  try{
    dispatch(loading);
    const params = subsec ? (`subsec1=${subsec.subsec1}&subsec2=${subsec.subsec2}`) : (`subsec1=46286967`);
    const url = `https://economictimes.indiatimes.com/pwa_footer_feed.cms?feedtype=etjson&${params}`;
    console.log(url)
    let res = await fetch(url);
    let data = await res.json();
    dispatch(success(data));
  }catch(e){
    console.log(e.message)
  }  
};
