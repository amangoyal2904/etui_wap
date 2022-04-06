import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const slice = createSlice({
  name: "Article",
  initialState: {
    data: [],
    isFetching: false,
    isFetchError: false,
  },
  reducers: {
    articleSuccess: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
    },
    articleLoading: (state) => {
      state.isFetching = true;
      state.isFetchError = false;
      state.data = [];
    },
    articleError: (state) => {
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
        ...action.payload.article,
      };
    },
  },
});

export default slice.reducer;

//Actions

const { articleSuccess, articleLoading, articleError } = slice.actions;

export const fetchArticle = (articleId) => async (dispatch) => {
  try {
    dispatch(articleLoading);
    let res = await fetch(
      `https://etpwaapi.economictimes.com/request?type=article&msid=${articleId}`
    );
    let data = await res.json();
    dispatch(articleSuccess(data));
  } catch (e) {
    return console.error(e.message);
  }
};
