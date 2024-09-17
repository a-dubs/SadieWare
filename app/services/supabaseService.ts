// src/services/supabaseService.ts
import store from '../store';  // Import the Redux store
import { setDeviceTypes, updateDeviceTypesFromRealTime, deleteDeviceTypeFromRealTime } from '../store/deviceTypeSlice';
import { setAreaCodes, updateAreaCodesFromRealTime, deleteAreaCodeFromRealTime } from '../store/areaCodeSlice';
import { setEquipment, updateEquipmentFromRealTime, deleteEquipmentFromRealTime } from '../store/equipmentSlice';
import { DeviceTypeRow, AreaCodeRow, EquipmentRow } from '../interfaces';  // Import the row interfaces
import { RealtimePostgresChangesPayload, createClient } from '@supabase/supabase-js';

// setup supabaseUrl
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch the initial data for all tables
export const fetchInitialData = async () => {
  // Fetch DeviceType data
  const { data: deviceTypes, error: deviceTypeError } = await supabase.from('DeviceType').select('*');
  if (deviceTypeError) {
    console.error('Error fetching DeviceType data:', deviceTypeError);
  } else {
    store.dispatch(setDeviceTypes(deviceTypes as DeviceTypeRow[]));  // Dispatch initial data to Redux
  }

  // Fetch AreaCode data
  const { data: areaCodes, error: areaCodeError } = await supabase.from('AreaCode').select('*');
  if (areaCodeError) {
    console.error('Error fetching AreaCode data:', areaCodeError);
  } else {
    store.dispatch(setAreaCodes(areaCodes as AreaCodeRow[]));
  }

  // Fetch Equipment data
  const { data: equipment, error: equipmentError } = await supabase.from('Equipment').select('*');
  if (equipmentError) {
    console.error('Error fetching Equipment data:', equipmentError);
  } else {
    store.dispatch(setEquipment(equipment as EquipmentRow[]));
  }
};

// Set up real-time listeners for all tables
export const setupRealTimeListeners = () => {
  // DeviceType Listener
  supabase
    .channel('device-type-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'DeviceType' },
      (payload: RealtimePostgresChangesPayload<DeviceTypeRow>) => {  // Add payload typing
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newDeviceType = payload.new as DeviceTypeRow;  // Cast payload.new to DeviceTypeRow
          store.dispatch(updateDeviceTypesFromRealTime(newDeviceType));  // Dispatch the typed data
        } else if (payload.eventType === 'DELETE') {
          const deletedDeviceType = payload.old as DeviceTypeRow;  // Cast payload.old to DeviceTypeRow
          store.dispatch(deleteDeviceTypeFromRealTime(deletedDeviceType.id));  // Dispatch delete with ID
        }
      }
    )
    .subscribe();

  // AreaCode Listener
  supabase
    .channel('area-code-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'AreaCode' },
      (payload: RealtimePostgresChangesPayload<AreaCodeRow>) => {  // Add payload typing
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newAreaCode = payload.new as AreaCodeRow;  // Cast payload.new to AreaCodeRow
          store.dispatch(updateAreaCodesFromRealTime(newAreaCode));
        } else if (payload.eventType === 'DELETE') {
          const deletedAreaCode = payload.old as AreaCodeRow;  // Cast payload.old to AreaCodeRow
          store.dispatch(deleteAreaCodeFromRealTime(deletedAreaCode.id));  // Dispatch delete with ID
        }
      }
    )
    .subscribe();

  // Equipment Listener
  supabase
    .channel('equipment-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Equipment' },
      (payload: RealtimePostgresChangesPayload<EquipmentRow>) => {  // Add payload typing
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newEquipment = payload.new as EquipmentRow;  // Cast payload.new to EquipmentRow
          store.dispatch(updateEquipmentFromRealTime(newEquipment));
        } else if (payload.eventType === 'DELETE') {
          const deletedEquipment = payload.old as EquipmentRow;  // Cast payload.old to EquipmentRow
          store.dispatch(deleteEquipmentFromRealTime(deletedEquipment.id));  // Dispatch delete with ID
        }
      }
    )
    .subscribe();
};

// Upsert Functions for each table
export const upsertDeviceTypeToDB = async (deviceTypeData: Omit<DeviceTypeRow, 'created_at' | 'updated_at'>) => {
  console.log('upsertDeviceTypeToDB', deviceTypeData);
  await supabase
    .from('DeviceType')
    .upsert(deviceTypeData, { onConflict: 'id' });
};

export const upsertAreaCodeToDB = async (areaCodeData: Omit<AreaCodeRow, 'created_at' | 'updated_at'>) => {
  console.log('upsertAreaCodeToDB', areaCodeData);
  await supabase
    .from('AreaCode')
    .upsert(areaCodeData, { onConflict: 'id' });
};

export const upsertEquipmentToDB = async (equipmentData: Omit<EquipmentRow, 'created_at' | 'updated_at'>) => {
  console.log('upsertEquipmentToDB', equipmentData);
  await supabase
    .from('Equipment')
    .upsert(equipmentData, { onConflict: 'id' });
};

// Delete Functions for each table
export const deleteDeviceTypeFromDB = async (id: number) => {
  console.log('deleteDeviceTypeFromDB by id:', id);
  await supabase
    .from('DeviceType')
    .delete()
    .eq('id', id);
};

export const deleteAreaCodeFromDB = async (id: number) => {
  console.log('deleteAreaCodeFromDB by id:', id);
  await supabase
    .from('AreaCode')
    .delete()
    .eq('id', id);
};

export const deleteEquipmentFromDB = async (id: number) => {
  console.log('deleteEquipmentFromDB by id:', id);
  await supabase
    .from('Equipment')
    .delete()
    .eq('id', id);
};
