import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table";
import SearchBar from "../../ui/SearchBar/SearchBar";
import UsuarioService from "../../../services/UsuarioService";
import { setUsuario } from "../../../redux/slices/Usuario";
import ModalUsuario from "../../ui/Modal/Usuario/ModalUsuario.tsx";
import ModalEliminarUsuario from "../../ui/Modal/Usuario/ModalEliminarUsuario.tsx";
import Usuario from "../../../types/Usuario.ts";
import { toggleModal } from "../../../redux/slices/Modal";
import {handleSearch} from "../../../utils.ts/utils.ts";
import { BaseNavBar } from "../../ui/common/BaseNavBar.tsx";
import { CCol, CContainer, CRow } from "@coreui/react";
import Sidebar from "../../ui/Sider/SideBar.tsx";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaUsuarios = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const usuarioService = new UsuarioService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null); // Estado para el usuario seleccionado para eliminar

  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Estado para controlar la apertura y cierre del modal de eliminar
  const [loading, setLoading] = useState(true);
  // Estado global de Redux
  const globalUsuario = useAppSelector(
      (state) => state.usuario.data
  );

  // Definiendo fetchUsuarios con useCallback
  const fetchUsuarios = useCallback(async () => {
    try {
      const usuarios = await usuarioService.getAll(url + 'usuarios');
      dispatch(setUsuario(usuarios));
      setFilterData(usuarios);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setLoading(false);
    }
  }, [dispatch, usuarioService, url]);

  useEffect(() => {
    // Llamando a fetchUsuarios dentro de useEffect
    fetchUsuarios();
    onSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []); 
  const handleAddUsuario = () => {
    setUsuarioToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setUsuarioToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      auth0Id: rowData.auth0Id,
      username: rowData.username
    });
    dispatch(toggleModal({ modalName: 'modal' }));
  };


  const onSearch = (query: string) => {
    handleSearch(query, globalUsuario, setFilterData);
  };

  const handleOpenDeleteModal = (rowData: Row) => {
    setUsuarioToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      auth0Id: rowData.auth0Id,
      username: rowData.username
    });
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };


  // Función para eliminar el usuario
  const handleDeleteUsuario = async () => {
    try {
      if (usuarioToEdit && usuarioToEdit.id) {
        await usuarioService.delete(url + 'usuarios', usuarioToEdit.id.toString());
        console.log('Usuario eliminado correctamente.');
        // Cerrar el modal de eliminar
        handleCloseDeleteModal();
        // Actualizar la lista de usuarios después de la eliminación
        fetchUsuarios();
      } else {
        console.error('No se puede eliminar el usuario porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id || ""}</> },
    { id: "username", label: "Nombre de usuario", renderCell: (rowData) => <>{rowData.username || ""}</> },
    { id: "auth0Id", label: "Auth0Id", renderCell: (rowData) => <>{rowData.auth0Id || ""}</> }
  ];

  return (
    <React.Fragment>
    <BaseNavBar title="" />
    <CContainer fluid>
      <CRow>
        {/* Sidebar */}
        <CCol xs="auto" className="sidebar">
          <Sidebar />
        </CCol>
        <CCol>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Usuarios
                </Typography>
                <Button
                  sx={{
                    bgcolor: "#9c27b0",
                    "&:hover": {
                      bgcolor: "#9c27b0",
                    },
                  }}
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddUsuario}
                >
                  Usuario
                </Button>
              </Box>

              {/* Barra de búsqueda */}
              <Box sx={{ mb: 2 }}>
                <SearchBar onSearch={onSearch} />
              </Box>

              {/* Tabla de usuarios */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableComponent data={filterData} columns={columns} handleOpenEditModal={handleOpenEditModal} handleOpenDeleteModal={handleOpenDeleteModal} />
              )}

              
              {/* Modal de Usuario */}
              <ModalUsuario getUsuarios={fetchUsuarios} usuarioToEdit={usuarioToEdit !== null ? usuarioToEdit : undefined} />

              {/* Modal de Eliminar Usuario */}
              <ModalEliminarUsuario show={deleteModalOpen} onHide={handleCloseDeleteModal} usuario={usuarioToEdit} onDelete={handleDeleteUsuario} />
            </Container>
          </Box>
        </CCol>
      </CRow>
    </CContainer>
  </React.Fragment>
  );
}

export default ListaUsuarios;
