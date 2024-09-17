import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceTypeRow } from '../interfaces';

const deviceTypeSlice = createSlice({
  name: 'deviceTypes',
  initialState: [] as DeviceTypeRow[],
  reducers: {
    setDeviceTypes: (state, action: PayloadAction<DeviceTypeRow[]>) => action.payload,
    updateDeviceTypesFromRealTime: (state, action: PayloadAction<DeviceTypeRow>) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;  // Update existing row
      } else {
        state.push(action.payload);  // Add new row if it doesn't exist
      }
    },
    deleteDeviceTypeFromRealTime: (state, action: PayloadAction<number>) => {
      return state.filter(deviceType => deviceType.id !== action.payload);  // Remove row by ID
    },
  },
});

export const { setDeviceTypes, updateDeviceTypesFromRealTime, deleteDeviceTypeFromRealTime } = deviceTypeSlice.actions;
export default deviceTypeSlice.reducer;
