import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EquipmentRow } from '../interfaces';

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: [] as EquipmentRow[],
  reducers: {
    setEquipment: (state, action: PayloadAction<EquipmentRow[]>) => action.payload,
    updateEquipmentFromRealTime: (state, action: PayloadAction<EquipmentRow>) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    deleteEquipmentFromRealTime: (state, action: PayloadAction<number>) => {
      return state.filter(equipment => equipment.id !== action.payload);
    },
  },
});

export const { setEquipment, updateEquipmentFromRealTime, deleteEquipmentFromRealTime } = equipmentSlice.actions;
export default equipmentSlice.reducer;
