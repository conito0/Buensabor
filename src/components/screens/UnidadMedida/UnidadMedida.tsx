import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table";
import SearchBar from "../../ui/SearchBar/SearchBar";
import UnidadMedidaService from "../../../services/UnidadMedidaService";
import { toggleModal } from "../../../redux/slices/Modal";
import { handleSearch } from "../../../utils.ts/utils.ts";
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import { CCol, CContainer, CRow } from "@coreui/react";
import Sidebar from "../../ui/Sider/SideBar";
import ModalUnidadMedida from "../../ui/Modal/UnidadMedida/ModalUnidaMedida.tsx";
import ModalEliminarUnidadMedida from "../../ui/Modal/UnidadMedida/ModalEliminarUnidaMedida.tsx";
import UnidadMedida from "../../../types/UnidadMedida.ts";
import { setUnidades } from "../../../redux/slices/UnidaMedia.ts";

interface Row {
  [key: string]: any;
}
interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}
export const ListaUnidadesMedida = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const unidadMedidaService = new UnidadMedidaService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [unidadToEdit, setUnidadToEdit] = useState<UnidadMedida | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const globalUnidades = useAppSelector(state => state.unidadMedida.data);

  const fetchUnidades = useCallback(async () => {
    try {
      const unidades = await unidadMedidaService.getAll(url + 'unidadMedida');
      dispatch(setUnidades(unidades));
      setFilterData(unidades);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las unidades de medida:", error);
      setLoading(false);
    }
  }, [dispatch, unidadMedidaService, url]);

  useEffect(() => {
    fetchUnidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddUnidad = () => {
    setUnidadToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setUnidadToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      eliminado: rowData.eliminado
    });
    dispatch(toggleModal({ modalName: 'modal' }));
  };

  const onSearch = (query: string) => {
    handleSearch(query, globalUnidades, setFilterData);
  };

  const handleOpenDeleteModal = (rowData: Row) => {
    setUnidadToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      eliminado: rowData.eliminado
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteUnidad = async () => {
    try {
      if (unidadToEdit && unidadToEdit.id) {
        await unidadMedidaService.delete(url + 'unidades', unidadToEdit.id.toString());
        handleCloseDeleteModal();
        fetchUnidades();
      } else {
        console.error('No se puede eliminar la unidad de medida porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar la unidad de medida:', error);
    }
  };

  const columns: Column[] = [
    // { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id || ""}</> },
    { id: "denominacion", label: "Denominación", renderCell: (rowData) => <>{rowData.denominacion || ""}</> }
  ];

  return (
    <React.Fragment>
      <BaseNavBar title="" />
      <CContainer fluid style={{backgroundColor: "#fff"}}>
        <CRow>
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>
          <CCol>
            <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", my: 2 }}>
              <Container maxWidth="lg">
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Unidades de Medida
                  </Typography>
                  <Button sx={{ bgcolor: "#9c27b0", "&:hover": { bgcolor: "#9c27b0" } }} variant="contained" startIcon={<Add />} onClick={handleAddUnidad}>
                    Unidad de Medida
                  </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <SearchBar onSearch={onSearch} />
                </Box>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableComponent data={filterData} columns={columns} handleOpenEditModal={handleOpenEditModal} handleOpenDeleteModal={handleOpenDeleteModal} />
                )}

                <ModalUnidadMedida getUnidades={fetchUnidades} unidadToEdit={unidadToEdit !== null ? unidadToEdit : undefined} modalName="modal" />

                <ModalEliminarUnidadMedida show={deleteModalOpen} onHide={handleCloseDeleteModal} unidad={unidadToEdit} onDelete={handleDeleteUnidad} />
              </Container>
            </Box>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
}

export default ListaUnidadesMedida;
