import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {createWrapper} from 'next-redux-wrapper';

import article from 'Slices/article';
import appHeader from 'Slices/appHeader';

const reducer = combineReducers({
  article,
  appHeader
})
const makeStore = () =>
    configureStore({
      reducer,
    });
    
export type AppStore = ReturnType<typeof makeStore>;
export const wrapper = createWrapper<AppStore>(makeStore);
