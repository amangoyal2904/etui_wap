import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import Service from "network/service";
import APIS_CONFIG from "network/config.json";
import { setCommonData } from "./common";

const slice = createSlice({
  name: "Article",
  initialState: {
    data: [],
    isFetching: false,
    isFetchError: false
  },
  reducers: {
    articleshowSuccess: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
    },
    articleshowLoading: (state) => {
      state.isFetching = true;
      state.isFetchError = false;
      state.data = [];
    },
    articleshowError: (state) => {
      state.isFetching = false;
      state.isFetchError = true;
      state.data = [];
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.articleshow
      };
    }
  }
});

export default slice.reducer;

//Actions

const { articleshowSuccess, articleshowLoading, articleshowError } = slice.actions;

export const fetchArticle = (articleId) => async (dispatch) => {
  try {
    dispatch(articleshowLoading);
    const api = APIS_CONFIG.REQUEST;
    const res = await Service.get({ api, params: { type: "article", msid: articleId } });
    const data = res.data || {};
    await dispatch(articleshowSuccess(data));
    await dispatch(setCommonData({ page: "articleshow", data }));
  } catch (e) {
    dispatch(articleshowError);
    return console.error(e.message);
  }
};
