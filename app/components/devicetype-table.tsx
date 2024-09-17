// import { GridPreProcessEditCellProps } from '@mui/x-data-grid';
// import { useEffect, useState } from 'react';
// import { ParameterizedCrudDataGrid } from '../components/supabase-crud-data-grid'; // Adjust the path to your Supabase CRUD data grid
// import { useSelector } from 'react-redux';
// import { RootState } from '../store';
// import { DeviceTypeRow } from '../interfaces';
// import { upsertDeviceTypeToDB, deleteDeviceTypeFromDB } from '../services/supabaseService';

// const tableName = 'DeviceType'; // Name of the Supabase table for DeviceType

// const DeviceTypeGrid = () => {
//   // Select deviceTypes from the Redux store
//   const deviceTypes = useSelector((state: RootState) => state.deviceTypes) as DeviceTypeRow[];

//   // Track errors for each row
//   const [rowHasErrorRecord, setRowHasErrorRecord] = useState<{ [key: string]: boolean }>({});

//   // Track local draft rows separately from the Redux state
//   const [draftRows, setDraftRows] = useState<Omit<DeviceTypeRow, 'created_at' | 'updated_at'>[]>([]);
//   const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set()); // Track modified row IDs

//   const allCapsValueParser = (newValue: string) => newValue.toUpperCase();

//   const handlePreProcessing = (params: GridPreProcessEditCellProps) => {
//     const cellHasError = !deviceTypeValueIsValid(params.props.value as string);
//     const rowHasError = !isValidRow(params.row as DeviceTypeRow);
//     const hasError = cellHasError || rowHasError;
//     setRowHasErrorRecord((prev) => ({ ...prev, [params.row.id as string]: hasError }));
//     return {
//       ...params.props,
//       style: { boxShadow: hasError ? 'inset 0px 0px 1px 1px red' : '' },
//     };
//   };

//   // Define columns for DeviceType without created_at and updated_at and id
//   const columns = [
//     {
//       field: 'device_type',
//       headerName: 'Device Type',
//       width: 150,
//       editable: true,
//       valueParser: allCapsValueParser,
//       preProcessEditCellProps: handlePreProcessing,
//     },
//     { field: 'description', headerName: 'Description', width: 250, editable: true },
//   ];

//   const defaultRow: Omit<DeviceTypeRow, 'created_at' | 'updated_at'> = {
//     id: 0, // Placeholder value for new rows
//     device_type: '',
//     description: '',
//   };

//   const deviceTypeValueIsValid = (value: string) => value.trim() !== '';

//   const isUniqueDeviceType = (deviceTypeValue: string, id: number) => {
//     const rowsWithSameDeviceType = deviceTypes.filter(row => row.device_type === deviceTypeValue);
//     return rowsWithSameDeviceType.length === 0 || (rowsWithSameDeviceType.length === 1 && rowsWithSameDeviceType[0].id === id);
//   };

//   const isValidRow = (row: DeviceTypeRow) => {
//     return deviceTypeValueIsValid(row.device_type) && isUniqueDeviceType(row.device_type, row.id);
//   };

//   const processRowAndSendToSupabase = async (row: DeviceTypeRow) => {
//     upsertDeviceTypeToDB(row);  // Commit the row to Supabase when explicitly saved
//   };

//   // Sync draftRows with Redux state when deviceTypes changes, but only for non-modified rows
//   useEffect(() => {
//     const nonModifiedRows = deviceTypes.filter((row) => !modifiedRows.has(row.id));
//     setDraftRows(nonModifiedRows);
//   }, [deviceTypes, modifiedRows]);

//   // Whenever a row is edited in the grid, update only the local state
//   const handleRowEdit = (id: number, updatedRow: DeviceTypeRow) => {
//     setDraftRows((prevRows) => prevRows.map((row) => (row.id === id ? updatedRow : row)));
//     setModifiedRows((prevModifiedRows) => new Set(prevModifiedRows).add(id));
//   };

//   // Save modified rows and commit to Supabase
//   const handleSaveRow = async (id: number) => {
//     const rowToSave = draftRows.find((row) => row.id === id);
//     if (rowToSave) {
//       await processRowAndSendToSupabase(rowToSave as DeviceTypeRow);
//       setModifiedRows((prevModifiedRows) => {
//         const newSet = new Set(prevModifiedRows);
//         newSet.delete(id); // Remove from modified rows
//         return newSet;
//       });
//     }
//   };

//   return (
//     <>
//       {!draftRows ? (
//         <p>Loading...</p>
//       ) : (
//         <ParameterizedCrudDataGrid<DeviceTypeRow>
//           rows={draftRows}  // Use draftRows instead of Redux-backed rows
//           setRows={handleRowEdit}  // Update the local draft row state
//           columns={columns}
//           defaultRow={defaultRow}
//           tableName={tableName}
//           defaultFieldToFocus={"device_type"}
//           // rowValuesAreValid={isValidRow}
//           rowHasErrorRecord={rowHasErrorRecord}
//           sendRowToSupabase={handleSaveRow}  // Only send modified rows to Supabase when saved
//           deleteRowFromSupabase={deleteDeviceTypeFromDB}
//         />
//       )}
//     </>
//   );
// };

// export default DeviceTypeGrid;
