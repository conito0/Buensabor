import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TablePagination, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element; 
}

interface Props {
  data: Row[];
  columns: Column[];
  handleOpenEditModal: (rowData: Row) => void;
  handleOpenDeleteModal: (rowData: Row) => void; // Nueva prop para manejar la apertura de la modal de eliminación
}

const TableComponent: React.FC<Props> = ({ data, columns, handleOpenEditModal, handleOpenDeleteModal }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.renderCell ? column.renderCell(row) : row[column.id]}
                </TableCell>
              ))}
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton aria-label="editar" onClick={() => handleOpenEditModal(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="eliminar" onClick={() => handleOpenDeleteModal(row)}>
                    <DeleteIcon />
                  </IconButton>

                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableComponent;
