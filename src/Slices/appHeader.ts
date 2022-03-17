import { createSlice } from '@reduxjs/toolkit'
import {HYDRATE} from 'next-redux-wrapper';

const slice = createSlice({
    name: 'AppHeader',
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
            state.isFetching= true;
            state.isFetchError = false
            state.data =  [];
        },
        error: (state) => {
            state.isFetching= false;
            state.isFetchError = true
            state.data =  [];
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', action.payload);
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

export const fetchMenu = () => async dispatch => {
    try {
        dispatch(loading);
        let res = await fetch(`https://etpwaapi.economictimes.com/request?type=menu`);
        let data = await res.json();
        dispatch(success(data));
    }
    catch (e) {
        return console.error(e.message);
    }
}