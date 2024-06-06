import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import { toggleModal } from "../../../redux/slices/Modal";
import SearchBar from "../../ui/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import ModalEliminarArticuloInsumo from "../../ui/Modal/ArticuloInsumo/ModalEliminarArticuloInsumo.tsx";
import ModalArticuloInsumo from "../../ui/Modal/ArticuloInsumo/ModalArticuloInsumo.tsx";
import ArticuloInsumo from "../../../types/ArticuloInsumoType";
import {handleSearch} from "../../../utils.ts/utils.ts";
import { setArticuloInsumo } from "../../../redux/slices/ArticuloInsumo.ts";
import UnidadMedida from "../../../types/UnidadMedida.ts";
import Sidebar from "../../ui/Sider/SideBar.tsx";
import { BaseNavBar } from "../../ui/common/BaseNavBar.tsx";
import { CContainer, CRow, CCol } from "@coreui/react";
import { useParams } from "react-router-dom";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaArticulosInsumo = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const articuloInsumoService = new ArticuloInsumoService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [articuloToEdit, setArticuloToEdit] = useState<ArticuloInsumo | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const globalArticuloInsumo = useAppSelector(
    (state) => state.articuloInsumo.data
  );
  const {sucursalId} = useParams();

  const fetchImages = useCallback(async (articuloInsumoId: string) => {
    try {
      const response = await articuloInsumoService.get(url + 'articuloInsumo/getAllImagesByInsumoId', articuloInsumoId);

      if (Array.isArray(response) && response.length > 0) {
        return response[0].url;
      }
      return 'https://via.placeholder.com/150';
    } catch (error) {
      return 'https://via.placeholder.com/150';
    }
  }, [articuloInsumoService, url]);

  const fetchArticulosInsumo = useCallback(async () => {
    try {
      if (sucursalId) {
        const sucursalIdNumber = parseInt(sucursalId); // Convertir sucursalId a número si es una cadena
        const articulosInsumo = await articuloInsumoService.getAll(url + "articuloInsumo");
        const artInsumoConImagenes = await Promise.all(
          articulosInsumo.map(async (articuloInsumo) => {
            const imagenUrl = await fetchImages(articuloInsumo.id.toString());
            return { ...articuloInsumo, imagen: imagenUrl };
          })
        );
  
        // Filtrar los insumos por sucursal y categoría
        const insumosFiltrados = articulosInsumo.filter(insumo =>
          insumo.categoria && // Verificar si categoria está definido
          Array.isArray(insumo.categoria.sucursales) && // Verificar si sucursales es un array en categoria
          insumo.categoria.sucursales.some((sucursal: any) => sucursal.id === sucursalIdNumber)
        );
  
        console.log(insumosFiltrados);
        dispatch(setArticuloInsumo(artInsumoConImagenes));
        setFilterData(insumosFiltrados);
      }
    } catch (error) {
      console.error("Error al obtener los artículos de insumo:", error);
    }
  }, [dispatch, articuloInsumoService, url, fetchImages, sucursalId]);
  

  useEffect(() => {
    fetchArticulosInsumo();
    onSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenDeleteModal = (rowData: Row) => {
    setArticuloToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      precioCompra: rowData.precioCompra,
      stockActual: rowData.stockActual,
      stockMaximo: rowData.stockMaximo,
      stockMinimo: rowData.stockMinimo,
      esParaElaborar: rowData.esParaElaborar,
      unidadMedida: rowData.unidadMedida,
      categoria: rowData.categoria
    });
    setDeleteModalOpen(true);
  };

  // const handleDelete = async () => {
  //   try {
  //     if (articuloToEdit && articuloToEdit.id) {
  //       await articuloInsumoService.delete(
  //         url + "articuloInsumo",
  //         articuloToEdit.id.toString()
  //       );
  //       console.log("Artículo de insumo eliminado correctamente.");
  //       handleCloseDeleteModal();
  //       fetchArticulosInsumo();
  //     } else {
  //       console.error(
  //         "No se puede eliminar el artículo de insumo porque no se proporcionó un ID válido."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error al eliminar el artículo de insumo:", error);
  //   }
  // };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };
  const handleAddArticuloInsumo = () => {
    // Verificar si el insumo ya existe en la lista mostrada
    const insumoExistente = filterData.find((articulo) => articulo.id === articuloToEdit?.id);
    
    // Si el insumo existe, no permitir agregarlo
    if (insumoExistente) {
      // Mostrar un mensaje de error o realizar alguna otra acción, como alertar al usuario
      console.error("No se puede agregar un insumo que ya existe.");
      return;
    }
    
    // Si el insumo no existe, abrir el modal para agregar un nuevo artículo
    setArticuloToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };
  

  const handleOpenEditModal = (rowData: Row) => {
    setArticuloToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      precioCompra: rowData.precioCompra,
      stockActual: rowData.stockActual,
      stockMaximo: rowData.stockMaximo,
      stockMinimo: rowData.stockMinimo,
      esParaElaborar: rowData.esParaElaborar,
      unidadMedida: rowData.unidadMedida,
      categoria: rowData.categoria
    });
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const onSearch = (query: string) => {
    handleSearch(query, globalArticuloInsumo, setFilterData);
  };


  const columns: Column[] = [
    // { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "categoria", label: "Categoría", renderCell: (rowData) => <>{rowData.categoria.denominacion}</> },
    { id: "precioVenta", label: "Precio Venta", renderCell: (rowData) => <>{rowData.precioVenta}</> },
    { id: "precioCompra", label: "Precio Compra", renderCell: (rowData) => <>{rowData.precioCompra}</> },
    { id: "stockActual", label: "Stock Actual", renderCell: (rowData) => <>{rowData.stockActual}</> },
    { id: "stockMaximo", label: "Stock Maximo", renderCell: (rowData) => <>{rowData.stockMaximo}</> },
    { id: "stockMinimo", label: "Stock Minimo", renderCell: (rowData) => <>{rowData.stockMinimo}</> },
    { id: "esParaElaborar", label: "Es para elaborar", renderCell: (rowData) => <span>{rowData.esParaElaborar ? "Sí" : "No"}</span> },
    {
      id: "unidadMedida",
      label: "Unidad Medida",
      renderCell: (rowData) => {
        // Verifica si la unidad de medida está presente y si tiene la propiedad denominacion
        const unidadMedida: UnidadMedida = rowData.unidadMedida;
        if (unidadMedida && unidadMedida.denominacion) {
          return <span>{unidadMedida.denominacion}</span>;
        } else {
          // Si la unidad de medida no está presente o no tiene denominacion, muestra un valor por defecto
          return <span>Sin unidad de medida</span>;
        }
      }
    },
    {
      id: "imagenes",
      label: "Imágenes",
      renderCell: (rowData) => {
        const imagenes = rowData.imagenes;
        if (imagenes && imagenes.length > 0) {
          return (
            <div style={{ display: 'flex', gap: '5px' }}>
              {imagenes.map((imagen: any, index: number) => (
                <img key={index} src={imagen.url} alt={`Imagen ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
              ))}
            </div>
          );
        } else {
          return <span>No hay imágenes disponibles</span>;
        }
      }
    },

  ];

  {/*
    {
      id: "imagenes",
      label: "Imágenes",
      renderCell: (rowData) => {
        const imagenes = rowData.imagenes;
        if (imagenes && imagenes.length > 0) {
          return (
            <div style={{ display: 'flex', gap: '5px' }}>
              {imagenes.map((imagen: any, index: number) => (
                <img key={index} src={imagen.url} alt={`Imagen ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
              ))}
            </div>
          );
        } else {
          return <span>No hay imágenes disponibles</span>;
        }
      }
    },
     */}

  return (
    <React.Fragment>
      <BaseNavBar/>
      <CContainer fluid style={{backgroundColor: "#fff"}}>
        <CRow>
          {/* Sidebar */}
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>
          {/* Contenido principal */}
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
                    my: 1,
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Artículos de Insumo
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
                    onClick={handleAddArticuloInsumo}
                  >
                    Nuevo Artículo
                  </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <SearchBar onSearch={onSearch} /> 
                </Box>
                <TableComponent
                  data={filterData}
                  columns={columns}
                  handleOpenEditModal={handleOpenEditModal}
                  handleOpenDeleteModal={handleOpenDeleteModal}
                />
                <ModalEliminarArticuloInsumo
                  show={deleteModalOpen}
                  onHide={handleCloseDeleteModal}
                  articuloInsumo={articuloToEdit}
                //onDelete={handleDelete}
                />
                <ModalArticuloInsumo
                  getArticulosInsumo={fetchArticulosInsumo}
                  articuloToEdit={articuloToEdit !== null ? articuloToEdit : undefined}
                />
              </Container>
            </Box>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>

  );
};
