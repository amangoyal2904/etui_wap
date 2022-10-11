import { ActionCreatorWithoutPayload, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import Service from "network/service";
import { setCommonData } from "./common";
import APIS_CONFIG from "network/config.json";
import { TopicDataProps } from "types/topic";
const slice = createSlice({
  name: "Topic",
  initialState: {
    data: {} as TopicDataProps,
    isFetching: false,
    isFetchError: false
  },
  reducers: {
    topicsfetchSuccess: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
    },
    topicsLoading: (state) => {
      state.isFetching = true;
      state.isFetchError = false;
      state.data = {} as TopicDataProps;
    },
    topicsfetchError: (state) => {
      state.isFetching = false;
      state.isFetchError = true;
      state.data = {} as TopicDataProps;
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.topics
      };
    }
  }
});

export default slice.reducer;

//Actions

const { topicsfetchSuccess, topicsLoading, topicsfetchError } = slice.actions;

export const fetchTopics = (params: string | string[]) => async (dispatch) => {
  const query: string = params?.slice(1, 2).toString();
  const type: string = params?.slice(2, 3).toString() || 'All';
  try {
    dispatch(topicsLoading());
    const api = APIS_CONFIG.FEED;
    const res = await Service.get({
      api,
      params: { name: "topic", query: query, platform: "wap", feedtype: "etjson" }
    });
    const data = res.data || {};
    await dispatch(topicsfetchSuccess(data));
    await dispatch(setCommonData({ page: "topic", data }));
  } catch (e) {
    dispatch(topicsfetchError());
    return console.error(e.message);
  }
};
export const fetchCategories = (query: string, type: string) => async (dispatch) => {
  query = query.replace(/-/g, "%20");
  try {
    dispatch(topicsLoading());
    const api = APIS_CONFIG.FEED;
    const res = await Service.get({
      api,
      params: { name: "topic", query: query, type: `${type ? type : ""}`, platform: "wap", feedtype: "etjson" }
    })
    const topicData = res.data || {};
    let data = topicData.searchResult && topicData.searchResult.find(item => item.name == 'topic');
    await dispatch(topicsfetchSuccess(data));
    await dispatch(setCommonData({ page: "topic", data }));
  } catch (e) {
    dispatch(topicsfetchError());
    return console.error(e.message);
  }
}
export const fetchMoreTopic = (params) => async (dispatch) => {
  try {
    dispatch(topicsLoading());
    const api = APIS_CONFIG.FEED;
    let { query, type, reqData, topicData } = params || {};
    let newsData = topicData && topicData.data;
    const res = await Service.get({
      api,
      params: { name: "topic", query: query, type: `${type ? type : ""}`, platform: "wap", feedtype: "etjson", curpg: `${reqData?.curpg}` }
    });
    const resData = res.data || {};
    let topicObj = resData.searchResult && resData.searchResult.find(item => item.name == 'topic');
    let latestNewsData = topicObj ? topicObj.data : [];
    let data = { data: [...topicData, ...latestNewsData] };
    await dispatch(topicsfetchSuccess(data));
    await dispatch(setCommonData({ page: "topic", data }));
  } catch (e) {
    dispatch(topicsfetchError());
    return console.error(e.message);
  }

};