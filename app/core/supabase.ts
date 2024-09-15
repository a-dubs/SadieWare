import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseKey) {
  throw new Error('Missing SUPABASE_KEY')
}
if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL')
}
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

export interface DeviceTypeRow {
  id: number;
  device_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AreaCodeRow {
  id: number;
  area_code: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentRow {
  id: number
  name: string
  area_code: number
  device_type: number
  application: string
  specs_description: string | null
  manufacturer: string | null
  vendor: string | null
  updated_at: string
  created_at: string
}

// create service that fetches rows from supabase and sends
// updates to supabase when rows are updated

export const SupabaseService = () => {
  type DeviceTypeDataGridRow = Omit<DeviceTypeRow, 'created_at' | 'updated_at'>;
  type AreaCodeDataGridRow = Omit<AreaCodeRow, 'created_at' | 'updated_at'>;
  type EquipmentDataGridRow = Omit<EquipmentRow, 'created_at' | 'updated_at'>;

  const [deviceTypeRows, setDeviceTypeRows] = useState<DeviceTypeDataGridRow[]>([]);
  const [areaCodeRows, setAreaCodeRows] = useState<AreaCodeDataGridRow[]>([]);
  const [equipmentRows, setEquipmentRows] = useState<EquipmentDataGridRow[]>([]);

  const fetchRows = async (tableName: string, setter: React.Dispatch<any>) => {
    const { data, error } = await supabase.from(tableName).select();
    if (error) {
      console.error('Error fetching rows:', error);
    } else {
      console.log('Fetched rows:', data);
      setter(data);
    }
  };

  const sendRowToSupabase  = async (tableName: string, row: any) => {
    // const { data, error } = await supabase.from(tableName).upsert([row]);
    const { data, error } = await supabase.from(tableName).upsert(row).eq('id', row.id);
    if (error) {
      console.error('Error updating row:', error);
    } else {
      console.log('Updated row:', data);
    }
  };

  // fetch all tables on load
  useEffect(() => {
    if (!deviceTypeRows.length) {
      fetchRows('DeviceType', setDeviceTypeRows);
    }
    if (!areaCodeRows.length) {
      fetchRows('AreaCode', setAreaCodeRows);
    }
    if (!equipmentRows.length) {
      fetchRows('Equipment', setEquipmentRows);
    }
  }, []);

  return {
    fetchRows,
    sendRowToSupabase,
    deviceTypeRows,
    areaCodeRows,
    equipmentRows,
    setDeviceTypeRows,
    setAreaCodeRows,
    setEquipmentRows,
  };
}
