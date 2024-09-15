import {
  GridPreProcessEditCellProps,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import {
  ParameterizedCrudDataGrid,
} from '../components/supabase-crud-data-grid'; // Adjust the path to your Supabase CRUD data grid
import supabase, { DeviceTypeRow, SupabaseService } from '../core/supabase'; // Adjust the path to your Supabase client
const tableName = 'DeviceType'; // Name of the Supabase table for DeviceType

// Define the type for a row in the DeviceType table


type TInsert = Omit<DeviceTypeRow, 'created_at' | 'updated_at'>;

const DeviceTypeGrid = () => {
  // const [rows, setRows] = useState<Omit<DeviceTypeRow, 'created_at' | 'updated_at'>[]>([]);
  // const [rowsFetched, setRowsFetched] = useState(false);

  // use record to keep track of any rows that have errors by id (this will be set by handlePreProcessing)
  const [rowHasErrorRecord, setRowHasErrorRecord] = useState<{ [key: string]: boolean }>({});

  const allCapsValueParser = (newValue: string) => newValue.toUpperCase();

  const handlePreProcessing = (params: GridPreProcessEditCellProps) => {
    const hasError = !deviceTypeValueIsValid(params.props.value as string);
    if (hasError) {  // set the rowHasError state to true for this row
      setRowHasErrorRecord((prev) => ({ ...prev, [params.row.id as string]: true }));
    } else {  // set the rowHasError state to false for this row
      setRowHasErrorRecord((prev) => ({ ...prev, [params.row.id as string]: false }));
    }
    return {
      ...params.props,
      error: hasError,
      // add inset shadow to cell that is 1px wide and red if there is an error with no blur
      style: { boxShadow: hasError ? 'inset 0px 0px 1px 1px red' : '' },
    };
  }

  useEffect(() => {
    console.log('Rows with errors:', rowHasErrorRecord);
  }, [rowHasErrorRecord]);

  // Define columns for DeviceType without created_at and updated_at and id
  const columns = [
    {
      field: 'device_type',
      headerName: 'Device Type',
      width: 150,
      editable: true,
      valueParser: allCapsValueParser,
      preProcessEditCellProps: handlePreProcessing,
    },
    { field: 'description', headerName: 'Description', width: 250, editable: true, },
  ];

  // Default row structure for adding new rows (without created_at and updated_at)
  const defaultRow: Omit<DeviceTypeRow, 'created_at' | 'updated_at'> = {
    id: 0, // Placeholder value for new rows
    device_type: '',
    description: '',
  };

  // // Fetch rows from Supabase
  // useEffect(() => {
  //   const fetchRows = async () => {
  //     const { data, error } = await supabase.from(tableName).select();
  //     if (error) {
  //       console.error('Error fetching rows:', error);
  //     } else {
  //       console.log('Fetched rows:', data);
  //       setRowsFetched(true);
  //       // Set rows, but only keep the fields that should be displayed/modified
  //       const processedRows = data.map((row: DeviceTypeRow) => ({
  //         id: row.id,
  //         device_type: row.device_type,
  //         description: row.description,
  //       }));
  //       setRows(processedRows);
  //     }
  //   };
  //   if (!rowsFetched) {
  //     fetchRows();
  //   }
  // }, []);

  const deviceTypeValueIsValid = (value: string) => {
    return value.trim() !== ''
  }

  const isValidRow = (row: DeviceTypeRow) => {
    return deviceTypeValueIsValid(row.device_type);
  }

  const getInsertValues = (row: DeviceTypeRow) => {
    const insertObject: TInsert = {
      id: row.id,
      device_type: row.device_type,
      description: row.description,
    };
    return insertObject;
  }


  const { deviceTypeRows: rows, setDeviceTypeRows: setRows, sendRowToSupabase } = SupabaseService();

  const processRowAndSendToSupabase = async (row: DeviceTypeRow) => {
    // call getInsertValues to get the row to send to Supabase
    const insertValues = getInsertValues(row);
    sendRowToSupabase(tableName, insertValues);
  };


  return (
    <>
      {!rows ? (
        <p>Loading...</p>
      ) : (
        <ParameterizedCrudDataGrid<DeviceTypeRow, TInsert>
          rows={rows}
          setRows={setRows}
          columns={columns}
          defaultRow={defaultRow}
          tableName={tableName}
          defaultFieldToFocus={"device_type"}
          rowValuesAreValid={isValidRow}
          rowHasErrorRecord={rowHasErrorRecord}
          getInsertValues={getInsertValues}
          sendRowToSupabase={processRowAndSendToSupabase}
        />
      )}
    </>
  );
};

export default DeviceTypeGrid;
