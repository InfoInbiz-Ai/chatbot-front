// src/material-kit/tables/PaginationTable.jsx

import { useState } from "react";
import {
  Box,
  Icon,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  TextField,
  Button,
  Stack
} from "@mui/material";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

const PaginationTable = ({ data,columns, onUpdate, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingRow, setEditingRow] = useState(null);
  const [editForm, setEditForm] = useState({
    userQuestion: "",
    botResponse: "",
    includeWords: "",
    startWith: ""
  });

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = (index) => {
    setEditingRow(index);
    setEditForm(data[index]);
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleSave = () => {
    if (editingRow === null) return;
    const rowId = data[editingRow].id;
    onUpdate(rowId, editForm);
    setEditingRow(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleDeleteClick = (index) => {
    const rowId = data[index].id;
    onDelete(rowId);
    if (editingRow === index) setEditingRow(null);
  };

  return (
    <Box width="100%" overflow="auto">
 <StyledTable>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>{col.label}</TableCell>
            ))}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
            const actualIndex = page * rowsPerPage + index;
            const isEditing = editingRow === actualIndex;

            return (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.field}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name={col.field}
                        value={editForm[col.field] || ""}
                        onChange={handleInputChange}
                        variant="standard"
                      />
                    ) : (
                      row[col.field]
                    )}
                  </TableCell>
                ))}

                <TableCell align="right">
                  {isEditing ? (
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button variant="contained" size="small" onClick={handleSave}>Save</Button>
                      <Button variant="outlined" size="small" onClick={handleCancel}>Cancel</Button>
                    </Stack>
                  ) : (
                    <Box>
                      <IconButton onClick={() => handleEditClick(actualIndex)} size="small">
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(actualIndex)} size="small">
                        <Icon color="error">delete</Icon>
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default PaginationTable;
