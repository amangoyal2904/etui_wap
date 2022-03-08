import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState } from '../../app/store'

interface MenuSecProps {
  title: string;
  logo?: string;
  msid?: number;
  url?: string;
  sec?: MenuSecProps[];
}
interface MenuProps {
  logo: string;
  sec: MenuSecProps[];
}

const initialState = {
  data: {}
}

export const appHeaderSlice = createSlice({
  name: 'appHeader',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<{
      searchResult: MenuProps,
      parameters: Object
    }>) => {
      state.data = action.payload;
    }
  },
})

export const { setMenu } = appHeaderSlice.actions;

export const selectMenu = (state: AppState) => state.appHeader.data;

export default appHeaderSlice.reducer;