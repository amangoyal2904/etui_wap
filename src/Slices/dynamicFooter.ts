import { createSlice } from '@reduxjs/toolkit'


const slice = createSlice({
    name: 'Article',
    initialState: {
        data: [],
        isFetching: false,
        isFetchError: false
    },
    reducers: {
        articleSuccess: (state, action) => {
            state.data = action.payload;
            state.isFetching = false;
        },
        articleLoading: (state) => {
            state.isFetching= true;
            state.isFetchError = false
            state.data =  [];
        },
        articleError: (state) => {
            state.isFetching= false;
            state.isFetchError = true
            state.data =  [];
        }
    },
});

export default slice.reducer;

//Actions

import useRequest from "../network/service";

const { articleSuccess, articleLoading, articleError } = slice.actions;

export const fetchArticle = (articleId) => async dispatch => {
    try {
        const { data, isLoading, error } = useRequest({
            url: "request",
            params: { type: "article", msid: articleId }
          });

          console.log(data, isLoading);

    }
    catch (e) {
        return console.error(e.message);
    }
}