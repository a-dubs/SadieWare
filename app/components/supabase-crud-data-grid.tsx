import * as React from 'react';
import { DataGrid, GridColDef, GridRowModel, GridRowId, GridSlots } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowModesModel,
  GridEventListener,
} from '@mui/x-data-grid';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import supabase from '../core/supabase'; // Adjust the path to your Supabase client setup
import { useEffect } from 'react';

// Add a row to the Supabase table
export const addRowToSupabase = async (tableName: string, row: any) => {
  const { error } = await supabase.from(tableName).insert([row]);
  if (error) {
    console.error('Error adding row:', error);
  }
};

// Update a row in Supabase
export const updateRowInSupabase = async (tableName: string, id: GridRowId, row: any) => {
  const { error } = await supabase.from(tableName).update(row).eq('id', id);
  if (error) {
    console.error('Error updating row:', error);
  }
};

// Delete a row from Supabase
export const deleteRowFromSupabase = async (tableName: string, id: GridRowId) => {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    console.error('Error deleting row:', error);
  }
};



// function to query the database for highest id
async function getHighestId(tableName: string) {
  const { data, error } = await supabase.from(tableName).select('id').order('id', { ascending: false }).limit(1);
  if (error) {
    console.error('Error fetching highest id:', error.message);
    return 0;
  }
  console.log(`Fetched highest id from table ${tableName}:`, data[0]?.id);
  return data[0]?.id || 0;
}

interface Identifiable {
  id: number | string;
}

interface EditableRow extends Identifiable {
  isNew?: boolean; // This property tracks whether a row is new
}


interface ParameterizedCrudDataGridProps<T extends EditableRow> {
  rows: Omit<T, 'created_at' | 'updated_at'>[]; // Omit 'created_at' and 'updated_at'
  columns: GridColDef[];
  addRow: (row: Omit<T, 'created_at' | 'updated_at'>) => Promise<void>;
  updateRow: (id: GridRowId, row: Omit<T, 'created_at' | 'updated_at'>) => Promise<void>;
  deleteRow: (id: GridRowId) => Promise<void>;
  defaultRow: Omit<T, 'created_at' | 'updated_at'>;
  tableName: string;
  defaultFieldToFocus: string;
}

export function ParameterizedCrudDataGrid<T extends EditableRow>({
  rows: initialRows,
  columns,
  addRow,
  updateRow,
  deleteRow,
  defaultRow,
  tableName,
  defaultFieldToFocus,
}: ParameterizedCrudDataGridProps<T>) {


  function EditToolbar<T>({
    setRows,
    setRowModesModel,
    defaultRow,
  }: {
    setRows: (newRows: (oldRows: T[]) => T[]) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
    defaultRow: T;
  }) {
    const handleAddClick = async () => {
      // generate new id that is 1 higher than the highest id in the current rows
      getHighestId(tableName).then((highestId:number) => {
        setRows((oldRows) => [
          ...oldRows,
          { ...defaultRow, id: highestId+1, isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [highestId+1]: { mode: GridRowModes.Edit, fieldToFocus: defaultFieldToFocus },
        }));
      });

    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add Row
        </Button>
      </GridToolbarContainer>
    );
  }



  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  // when rows change, log the new rows
  useEffect(() => {
    console.log('Rows changed:', rows);
  }, [rows]);

  // Handle row update
  const processRowUpdate = async (newRow: GridRowModel) => {
    // Cast newRow to the type T before passing to updateRow
    const typedRow = newRow as unknown as T;
    console.log(`Updating row with id ${newRow.id} to:`, typedRow);
    await updateRow(newRow.id, typedRow);
    setRows(rows.map((row) => (row.id === newRow.id ? typedRow : row)));
    return typedRow;
  };

  // Handle row delete
  const handleDeleteClick = (id: GridRowId) => () => {
    console.log("Deleting row with id: ", id);
    deleteRow(id);
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === 'rowFocusOut') {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    console.log("Editing row with id: ", id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    console.log("Saved row with id: ", id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    console.log("Cancelled editing row with id: ", id);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columnsWithActions: GridColDef[] = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columnsWithActions}
        editMode="row"
        onRowEditStop={handleRowEditStop}
        onRowModesModelChange={handleRowModesModelChange}
        rowModesModel={rowModesModel}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, defaultRow },
        }}
      />
    </Box>
  );
}
