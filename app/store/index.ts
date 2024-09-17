// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import deviceTypeReducer from './deviceTypeSlice';
import areaCodeReducer from './areaCodeSlice';
import equipmentReducer from './equipmentSlice';

// Configure your Redux store
const store = configureStore({
  reducer: {
    deviceTypes: deviceTypeReducer,
    areaCodes: areaCodeReducer,
    equipment: equipmentReducer,
  },
});

// Define RootState type based on the store's reducer
export type RootState = ReturnType<typeof store.getState>;

// Export the store
export default store;
