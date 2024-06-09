import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { toggleModal } from "../../../redux/slices/Modal";
import TableComponent from "../../ui/Table/Table.tsx";
//import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
//import {handleSearch} from "../../../utils.ts/utils.ts";
import { CCol, CContainer, CRow } from "@coreui/react";
import { handleSearch } from "../../../utils.ts/utils.ts";
import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
import { useParams } from "react-router-dom";
import PedidoService from "../../../services/PedidoService.ts";
import Pedido from "../../../types/Pedido.ts";
import { setPedido } from "../../../redux/slices/Pedido.ts";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaPedidos = () => {

  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const pedidoService = new PedidoService();
  const [filteredData, setFilterData] = useState<Row[]>([]);
  const [pedidoToEdit, setPedidoToEdit] = useState<Pedido | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const {sucursalId} = useParams();

  const globalArticuloManufacturado = useAppSelector(
      (state) => state.articuloManufacturado.data
  );
  

  const fetchPedidos = useCallback(async () => {
    try {
      const pedidos = (await pedidoService.getAll(url + 'pedido')).filter((v) => !v.eliminado);
      
      // Asegúrate de que sucursalId esté definido y conviértelo a un número
      if (sucursalId) {
        const sucursalIdNumber = parseInt(sucursalId); // Convertir sucursalId a número si es una cadena
        
        // Filtrar los productos por sucursal y categoría
        const pedidosFiltrados = pedidos.filter(pedido =>
          pedido.sucursal && // Verificar si categoria está definido
          pedido.sucursal && pedido.sucursal.id === sucursalIdNumber
        );

        dispatch(setPedido(pedidosFiltrados));
        setFilterData(pedidosFiltrados);
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  }, [dispatch, pedidoService, url, sucursalId]);
  
  useEffect(() => {
    fetchPedidos();
    onSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleOpenDeleteModal = (rowData: Row) => {
    setPedidoToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      horaEstimadaFinalizacion: rowData.horaEstimadaFinalizacion,
      total: rowData.total,
      totalCosto: rowData.totalCosto,
      estado: rowData.estado,
      tipoEnvio: rowData.tipoEnvio,
      formaPago: rowData.FormaPago,
      fechaPedido: rowData.fechaPedido,
      detallePedidos: rowData.detallePedidos,
      sucursal: rowData.sucursal,
      cliente: rowData.cliente
    });
    
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {

    console.log(deleteModalOpen)

    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
    fetchPedidos();
  };

  const handleDelete = async () => {
    try {
      if (pedidoToEdit && pedidoToEdit.id) {
        await pedidoService.delete(url + 'pedido', pedidoToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); // Cerrar el modal de eliminación
        fetchPedidos();
      } else {
        console.error('No se puede eliminar el pedido porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };


  const handleOpenEditModal = (rowData: Row) => {
    setPedidoToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      horaEstimadaFinalizacion: rowData.horaEstimadaFinalizacion,
      total: rowData.total,
      totalCosto: rowData.totalCosto,
      estado: rowData.estado,
      tipoEnvio: rowData.tipoEnvio,
      formaPago: rowData.formaPago,
      fechaPedido: rowData.fechaPedido,
      detallePedidos: rowData.detallePedidos,
      sucursal: rowData.sucursal,
      cliente: rowData.cliente
    });
    dispatch(toggleModal({ modalName: 'modal' }));
  };


  // Función para manejar la búsqueda de artículos manufacturados
  const onSearch = (query: string) => {
    handleSearch(query, globalArticuloManufacturado, setFilterData);
  };

  // Definición de las columnas para la tabla de artículos manufacturados
  const columns: Column[] = [
    // { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "horaEstimadaFinalizacion", label: "Hora Estimada Finalizacion", renderCell: (rowData) => <>{rowData.horaEstimadaFinalizacion}</> },
    { id: "total", label: "Total", renderCell: (rowData) => <>{rowData.total}</> },
    { id: "totalCosto", label: "Total Costo", renderCell: (rowData) => <>{rowData.totalCosto}</> },
    { id: "estado", label: "Estado", renderCell: (rowData) => <>{rowData.estado}</> },
    { id: "tipoEnvio", label: "Tipo Envio", renderCell: (rowData) => <>{rowData.tipoEnvio}</> },
    { id: "formaPago", label: "Forma Pago", renderCell: (rowData) => <>{rowData.formaPago}</> },
    { id: "fechaPedido", label: "Fecha Pedido", renderCell: (rowData) => <>{rowData.fechaPedido}</> },
    {
      id: "detallePedidos",
      label: "Detalle del Pedido",
      renderCell: (rowData) => {
        const detalles = rowData.detallePedidos;
        return (
          <div>
            {detalles.map((detalle: any, index: number) => (
              <div key={index}>
                <p>Cantidad: {detalle.cantidad}</p>
                {/* Renderiza más atributos relevantes del detalle aquí */}
                <p>Artículo: {detalle.articulo.denominacion}</p>
                {/* Si hay más atributos anidados, puedes seguir accediendo a ellos de manera similar */}
                {/* Por ejemplo, detalle.articulo.precioVenta, detalle.articulo.imagenes, etc. */}
              </div>
            ))}
          </div>
        );
      }
    }
    
  ];
  if (filteredData.length === 0) {
    return (
        <>
          <div style={{height: "calc(100vh - 56px)"}} className={"d-flex flex-column justify-content-center align-items-center w-100"}>
            <div className="spinner-border" role="status">
            </div>
            <div>Cargando los pedidos</div>
          </div>
        </>
    );
  }

  return (
  <React.Fragment>
    <CContainer fluid style={{backgroundColor: "#fff"}}>
      <CRow>
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
                  Pedidos
                </Typography>
                <a
                  className="btn btn-primary"
                  href={`../productos/${sucursalId}`}
                >
                  +
                  Pedido
                </a>
              </Box>
              {/* Barra de búsqueda */}
              <Box sx={{ mt: 2 }}>
                <SearchBar onSearch={onSearch} />
              </Box>
              {/* Componente de tabla para mostrar los artículos manufacturados */}
              <TableComponent data={filteredData} columns={columns} handleOpenDeleteModal={handleOpenDeleteModal} handleOpenEditModal={handleOpenEditModal} />

              {/* Llamando a ModalCupon con la prop fetchCupones y cuponToEdit */}
              {/* <ModalProducto getProducts={fetchPedidos} pedidoToEdit={pedidoToEdit !== null ? pedidoToEdit : undefined} /> */}

              {/* <ModalEliminarProducto show={deleteModalOpen} onHide={handleCloseDeleteModal} product={pedidoToEdit} onDelete={handleDelete} /> */}
            </Container>
          </Box>
        </CCol>
      </CRow>
      </CContainer>
      </React.Fragment>

  );
}
