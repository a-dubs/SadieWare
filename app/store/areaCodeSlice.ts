import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AreaCodeRow } from '../interfaces';

const areaCodeSlice = createSlice({
  name: 'areaCodes',
  initialState: [] as AreaCodeRow[],
  reducers: {
    setAreaCodes: (state, action: PayloadAction<AreaCodeRow[]>) => action.payload,
    updateAreaCodesFromRealTime: (state, action: PayloadAction<AreaCodeRow>) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    deleteAreaCodeFromRealTime: (state, action: PayloadAction<number>) => {
      return state.filter(areaCode => areaCode.id !== action.payload);
    },
  },
});

export const { setAreaCodes, updateAreaCodesFromRealTime, deleteAreaCodeFromRealTime } = areaCodeSlice.actions;
export default areaCodeSlice.reducer;
