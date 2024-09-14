import React, { useEffect, useState } from 'react';
import {
  ParameterizedCrudDataGrid,
  addRowToSupabase,
  updateRowInSupabase,
  deleteRowFromSupabase,
} from '../components/supabase-crud-data-grid'; // Adjust the path to your Supabase CRUD data grid
import supabase from '../core/supabase'; // Adjust the path to your Supabase client

const tableName = 'AreaCode'; // Name of the Supabase table for AreaCode

// Define the type for a row in the AreaCode table
interface AreaCodeRow {
  id: number;
  area_code: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const AreaCodeGrid = () => {
  const [rows, setRows] = useState<Omit<AreaCodeRow, 'created_at' | 'updated_at'>[]>([]);
  const [rowsFetched, setRowsFetched] = useState(false);

  // Define columns for AreaCode without created_at and updated_at
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'area_code', headerName: 'Area Code', width: 150, editable: true },
    { field: 'description', headerName: 'Description', width: 200, editable: true },
  ];

  // Default row structure for adding new rows (without created_at and updated_at)
  const defaultRow: Omit<AreaCodeRow, 'created_at' | 'updated_at'> = {
    id: 0, // Placeholder value for new rows
    area_code: '',
    description: '',
  };

  // Fetch rows from Supabase
  useEffect(() => {
    const fetchRows = async () => {
      const { data, error } = await supabase.from(tableName).select();
      if (error) {
        console.error('Error fetching rows:', error);
      } else {
        console.log('Fetched rows:', data);
        setRowsFetched(true);
        // Set rows, but only keep the fields that should be displayed/modified
        const processedRows = data.map((row: AreaCodeRow) => ({
          id: row.id,
          area_code: row.area_code,
          description: row.description,
        }));
        setRows(processedRows);
      }
    };
    if (!rowsFetched) {
      fetchRows();
    }
  }, []);

  return (
    <>
      {!rowsFetched ? (
        <p>Loading...</p>
      ) : (
        <ParameterizedCrudDataGrid<AreaCodeRow>
          rows={rows}
          columns={columns}
          addRow={(row) => addRowToSupabase(tableName, row)}
          updateRow={(id, row) => updateRowInSupabase(tableName, id, row)}
          deleteRow={(id) => deleteRowFromSupabase(tableName, id)}
          defaultRow={defaultRow}
          tableName={tableName}
          defaultFieldToFocus={"area_code"}
        />
      )}
    </>
  );
};

export default AreaCodeGrid;
