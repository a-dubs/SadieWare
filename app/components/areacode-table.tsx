// import {
//   GridPreProcessEditCellProps,
// } from '@mui/x-data-grid';
// import { useEffect, useState } from 'react';
// import {
//   ParameterizedCrudDataGrid,
// } from '../components/supabase-crud-data-grid'; // Adjust the path to your Supabase CRUD data grid
// import supabase, { AreaCodeRow, SupabaseService } from '../core/supabase'; // Adjust the path to your Supabase client

// const tableName = 'AreaCode'; // Name of the Supabase table for AreaCode

// // Define the type for a row in the AreaCode table


// type TInsert = Omit<AreaCodeRow, 'created_at' | 'updated_at'>;

// const AreaCodeGrid = () => {
//   // const [rows, setRows] = useState<Omit<AreaCodeRow, 'created_at' | 'updated_at'>[]>([]);
//   // const [rowsFetched, setRowsFetched] = useState(false);

//   // use record to keep track of any rows that have errors by id (this will be set by handlePreProcessing)
//   const [rowHasErrorRecord, setRowHasErrorRecord] = useState<{ [key: string]: boolean }>({});

//   const allCapsValueParser = (newValue: string) => newValue.toUpperCase();

//   const handlePreProcessing = (params: GridPreProcessEditCellProps) => {
//     const hasError = !areaCodeValueIsValid(params.props.value as string);
//     if (hasError) {  // set the rowHasError state to true for this row
//       setRowHasErrorRecord((prev) => ({ ...prev, [params.row.id as string]: true }));
//     } else {  // set the rowHasError state to false for this row
//       setRowHasErrorRecord((prev) => ({ ...prev, [params.row.id as string]: false }));
//     }
//     return {
//       ...params.props,
//       error: hasError,
//       // add inset shadow to cell that is 1px wide and red if there is an error with no blur
//       style: { boxShadow: hasError ? 'inset 0px 0px 1px 1px red' : '' },
//     };
//   }

//   useEffect(() => {
//     console.log('Rows with errors:', rowHasErrorRecord);
//   }, [rowHasErrorRecord]);

//   // Define columns for AreaCode without created_at and updated_at and id
//   const columns = [
//     {
//       field: 'area_code',
//       headerName: 'Area Code',
//       width: 150,
//       editable: true,
//       valueParser: allCapsValueParser,
//       preProcessEditCellProps: handlePreProcessing,
//     },
//     { field: 'description', headerName: 'Description', width: 250, editable: true, },
//   ];

//   // Default row structure for adding new rows (without created_at and updated_at)
//   const defaultRow: Omit<AreaCodeRow, 'created_at' | 'updated_at'> = {
//     id: 0, // Placeholder value for new rows
//     area_code: '',
//     description: '',
//   };

//   const areaCodeValueIsValid = (value: string) => {
//     return value.trim() !== ''
//   }

//   const isValidRow = (row: AreaCodeRow) => {
//     return areaCodeValueIsValid(row.area_code);
//   }

//   const getInsertValues = (row: AreaCodeRow) => {
//     const insertObject: TInsert = {
//       id: row.id,
//       area_code: row.area_code,
//       description: row.description,
//     };
//     return insertObject;
//   }

//   const { areaCodeRows: rows, setAreaCodeRows: setRows, sendRowToSupabase } = SupabaseService();

//   const processRowAndSendToSupabase = async (row: AreaCodeRow) => {
//     // call getInsertValues to get the row to send to Supabase
//     const insertValues = getInsertValues(row);
//     sendRowToSupabase(tableName, insertValues);
//   };


//   return (
//     <>
//       {!rows ? (
//         <p>Loading...</p>
//       ) : (

//         <ParameterizedCrudDataGrid<AreaCodeRow, TInsert>
//           rows={rows}
//           setRows={setRows}
//           columns={columns}
//           defaultRow={defaultRow}
//           tableName={tableName}
//           defaultFieldToFocus={"area_code"}
//           rowValuesAreValid={isValidRow}
//           rowHasErrorRecord={rowHasErrorRecord}
//           getInsertValues={getInsertValues}
//           sendRowToSupabase={processRowAndSendToSupabase}
//         />

//       )}
//     </>
//   );
// };

// export default AreaCodeGrid;
