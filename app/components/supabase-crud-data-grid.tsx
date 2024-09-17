// import AddIcon from '@mui/icons-material/Add';
// import CancelIcon from '@mui/icons-material/Cancel';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import {
//   DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowId, GridRowModel, GridRowModes,
//   GridRowModesModel, GridSlots, GridToolbarContainer
// } from '@mui/x-data-grid';
// import * as React from 'react';
// import { useEffect } from 'react';
// import supabase from '../core/supabase'; // Adjust the path to your Supabase client setup

// // custom cells for editing: https://mui.com/x/react-data-grid/editing/#create-your-own-edit-component

// // function to query the database for highest id
// async function getHighestId(tableName: string) {
//   const { data, error } = await supabase.from(tableName).select('id').order('id', { ascending: false }).limit(1);
//   if (error) {
//     console.error('Error fetching highest id:', error.message);
//     return 0;
//   }
//   console.log(`Fetched highest id from table ${tableName}:`, data[0]?.id);
//   return data[0]?.id || 0;
// }

// interface Identifiable {
//   id: number | string;
// }

// interface EditableRow extends Identifiable {
//   isNew?: boolean; // This property tracks whether a row is new
// }


// interface ParameterizedCrudDataGridProps<
//   T extends EditableRow,
// > {
//   rows: Omit<T, 'created_at' | 'updated_at'>[]; // Omit 'created_at' and 'updated_at'
//   handleRowEdit: (id: GridRowId, newRow: T) => void;
//   columns: GridColDef[];
//   defaultRow: Omit<T, 'created_at' | 'updated_at'>;
//   tableName: string;
//   defaultFieldToFocus: string;
//   rowHasErrorRecord?: { [key: string]: boolean };
//   deleteRowFromSupabase: (id: number) => Promise<void>;
// }

// export function ParameterizedCrudDataGrid<
//   T extends EditableRow,
// >({
//   rows,
//   handleRowEdit,
//   columns,
//   defaultRow,
//   tableName,
//   defaultFieldToFocus,
//   rowHasErrorRecord,
//   deleteRowFromSupabase,
// }: ParameterizedCrudDataGridProps<T>) {



//   // // Add a row to the Supabase table
//   // const addRow = async (row: TInsert) => {
//   //   const { error } = await supabase.from(tableName).insert([row]).select();
//   //   if (error) {
//   //     console.error('Error adding row:', error);
//   //   }
//   // };

//   function EditToolbar<T>({
//     setRows,
//     setRowModesModel,
//     defaultRow,
//   }: {
//     setRows: (newRows: (oldRows: T[]) => T[]) => void;
//     setRowModesModel: (
//       newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
//     ) => void;
//     defaultRow: T;
//   }) {
//     const handleAddClick = () => {
//       // generate new id that is 1 higher than the highest id in the current rows
//       getHighestId(tableName).then((highestId: number) => {
//         setRows((oldRows) => [
//           ...oldRows,
//           { ...defaultRow, id: highestId + 1, isNew: true },
//         ]);
//         setRowModesModel((oldModel) => ({
//           ...oldModel,
//           [highestId + 1]: { mode: GridRowModes.Edit, fieldToFocus: defaultFieldToFocus },
//         }));
//       });
//     };

//     return (
//       <GridToolbarContainer>
//         <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
//           Add Row
//         </Button>
//       </GridToolbarContainer>
//     );
//   }

//   // const [rows, setRows] = React.useState(initialRows);
//   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

//   // when rows change, log the new rows
//   useEffect(() => {
//     console.log('Rows changed:', rows);
//   }, [rows]);

//   // Handle row update
//   // const processRowUpdate = async (newRow: GridRowModel) => {
//   //   // Cast newRow to the type T before passing to updateRow
//   //   const typedRow = newRow as unknown as T;
//   //   console.log(`Row #${newRow.id} updated to:`, typedRow);
//   //   if (!rowValuesAreValid(typedRow)) {
//   //     console.error('Row values are not valid:', typedRow);
//   //     return;
//   //   }

//   //   // await updateRow(newRow.id, typedRow);
//   //   await sendRowToSupabase(typedRow);
//   //   setRows(rows.map((row) => (row.id === newRow.id ? typedRow : row)));
//   //   return typedRow;
//   // };

//   // const handleRowEdit = (id: GridRowId, newRow: T) => {
//   //   setRows((prevRows) => prevRows.map((row) => (row.id === id ? newRow : row)));
//   // };

//   // Handle row delete
//   const handleDeleteClick = (id: GridRowId) => () => {
//     console.log("Deleting row with id: ", id);
//     deleteRowFromSupabase(Number(id));
//     setRows(rows.filter((row) => row.id !== id));
//   };

//   const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
//     if (params.reason === 'rowFocusOut') {
//       event.defaultMuiPrevented = true;
//     }
//     // check if the row has errors and if not, don't save the row
//     if (rowHasError(params.id)) {
//       console.error('[handleRowEditStop] Row has errors, not saving:', params.id);
//       return;
//     }
//   };

//   const handleEditClick = (id: GridRowId) => () => {
//     console.log("Editing row with id: ", id);
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
//   };

//   const handleSaveClick = (id: GridRowId) => () => {
//     console.log("Saved row with id: ", id);
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
//   };

//   const handleCancelClick = (id: GridRowId) => () => {
//     console.log("Cancelled editing row with id: ", id);
//     setRowModesModel({
//       ...rowModesModel,
//       [id]: { mode: GridRowModes.View, ignoreModifications: true },
//     });

//     const editedRow = rows.find((row) => row.id === id);
//     if (editedRow?.isNew) {
//       setRows(rows.filter((row) => row.id !== id));
//     }
//   };

//   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
//     setRowModesModel(newRowModesModel);
//   };

//   // whenever rowsWithErrors change, log the new rowsWithErrors and

//   const rowHasError = (id: GridRowId) => {
//     // if rowsWithErrors is undefined, return false
//     // if rowsWithErrors[id] is undefined, return true (new row has to be filled out first so should start with error)
//     // otherwise return rowsWithErrors[id]
//     return rowHasErrorRecord ? rowHasErrorRecord[id] || false : false;
//   }

//   const columnsWithActions: GridColDef[] = [
//     ...columns,
//     {
//       field: "actions",
//       type: "actions",
//       headerName: "Actions",
//       width: 100,
//       cellClassName: "actions",
//       getActions: ({ id }) => {
//         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

//         if (isInEditMode) {
//           return [
//             <GridActionsCellItem
//               icon={<SaveIcon />}
//               label="Save"
//               sx={{
//                 color: "primary.main",
//               }}
//               onClick={handleSaveClick(id)}
//               disabled={rowHasError(id)}
//               key={`save-${id}`}
//             />,
//             <GridActionsCellItem
//               icon={<CancelIcon />}
//               label="Cancel"
//               className="textPrimary"
//               onClick={handleCancelClick(id)}
//               color="inherit"
//               key={`cancel-${id}`}
//             />,
//           ];
//         }

//         return [
//           <GridActionsCellItem
//             icon={<EditIcon />}
//             label="Edit"
//             className="textPrimary"
//             onClick={handleEditClick(id)}
//             color="inherit"
//             key={`edit-${id}`}
//           />,
//           <GridActionsCellItem
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={handleDeleteClick(id)}
//             color="inherit"
//             key={`delete-${id}`}
//           />,
//         ];
//       },
//     },
//   ];

//   return (
//     <Box sx={{ height: 500, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columnsWithActions}
//         editMode="row"
//         onRowEditStop={handleRowEditStop}
//         onRowModesModelChange={handleRowModesModelChange}
//         rowModesModel={rowModesModel}
//         processRowUpdate={handleRowEdit}
//         slots={{
//           toolbar: EditToolbar as GridSlots["toolbar"],
//         }}
//         slotProps={{
//           toolbar: { setRows, setRowModesModel, defaultRow },
//         }}
//       />
//     </Box>
//   );
// }
