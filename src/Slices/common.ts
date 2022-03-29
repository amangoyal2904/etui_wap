import { createSlice } from '@reduxjs/toolkit'
import {HYDRATE} from 'next-redux-wrapper';
import { fetchFooter } from './footer';

const slice = createSlice({
    name: 'common',
    initialState: {
        data: {
          subsec: {
            subsec1: '',
            subsec2: '',
            subsec3: '',
            subsec4: '',
            subsec5: ''
          }
          
        }
    },
    reducers: {
        update: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', action.payload);
            return {
                ...state,
                ...action.payload.common,
            };
        },
    },
});

export default slice.reducer;

//Actions


const { update } = slice.actions;

export const setCommonData = (data) => async dispatch => {
    try {
        dispatch(update(data));
        await dispatch(fetchFooter(data.subsec.subsec1));
    }
    catch (e) {
        return console.error(e.message);
    }
}
