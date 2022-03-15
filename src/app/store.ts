import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {createWrapper} from 'next-redux-wrapper';


import article from '../Slices/article';

const reducer = combineReducers({
  article
})
const makeStore = () =>
    configureStore({
      reducer,
    });
    
export type AppStore = ReturnType<typeof makeStore>;
export const wrapper = createWrapper<AppStore>(makeStore);
