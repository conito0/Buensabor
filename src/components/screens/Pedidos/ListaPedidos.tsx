import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table.tsx";
import { CCol, CContainer, CRow } from "@coreui/react";
import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
import { useParams } from "react-router-dom";
import PedidoService from "../../../services/PedidoService.ts";
import { setPedido } from "../../../redux/slices/Pedido.ts";
import { useAuth0 } from "@auth0/auth0-react";
import ClientService from "../../../services/ClienteService.ts";
import { Estado } from "../../../types/enums/Estado.ts";
import { Button } from "react-bootstrap";
import {BaseNavBar} from "../../ui/common/BaseNavBar.tsx";

interface Row {
  [key: string]: any;
}
export const ListaPedidos = () => {

  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const pedidoService = new PedidoService();
  const [filteredData, setFilterData] = useState<Row[]>([]);
  const {sucursalId} = useParams();
  const { isAuthenticated, user } = useAuth0();
  const clienteService = new ClientService();
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [_, setNoResults] = useState(false);
  const [originalData, setOriginalData] = useState<Row[]>([]);


  const fetchData = async () => {
    try {
      if (isAuthenticated && user && user.email) {
        const cliente = await clienteService.getByEmail(url + "cliente", user.email, await getAccessTokenSilently({}));
        if(cliente){
          setClienteId(cliente.id);
        }
      }
    } catch (error) {
      console.log("Cliente no encontrado");
    }
  };
  
  fetchData(); // Llama a la función asíncrona para ejecutar el código.

  const fetchPedidos = useCallback(async () => {
    try {
      const pedidos = (await pedidoService.getAll(url + 'pedido', await getAccessTokenSilently({}))).filter((v) => !v.eliminado);
      console.log(pedidos)
      // Asegúrate de que sucursalId esté definido y conviértelo a un número
      if (clienteId) {        
        // Filtrar los productos por sucursal y categoría
        const pedidosFiltrados = pedidos.filter(pedido =>
          pedido.cliente && 
          pedido.cliente && pedido.cliente.id === clienteId
        );

        dispatch(setPedido(pedidosFiltrados));
        console.log(pedidosFiltrados)
        setFilterData(pedidosFiltrados);
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  }, [dispatch, pedidoService, url, sucursalId]);
  
  useEffect(() => {
    fetchPedidos();
    onSearch('');
    setOriginalData(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (query: string) => {
    // Verificamos si el campo de búsqueda está vacío o no
    const isQueryEmpty = query.trim() === "";
    console.log(isQueryEmpty)
    // Si el campo de búsqueda está vacío o es "falsy", mostramos todos los resultados sin filtrar
    if (isQueryEmpty) {
      setFilterData(originalData);
      return;
    }
  
    // Aplicamos la búsqueda sobre los datos filtrados
    const filtered = originalData.filter(row =>
      // Verificamos si la propiedad es una cadena antes de llamar a toLowerCase()
      (typeof row.horaEstimadaFinalizacion === 'string' && row.horaEstimadaFinalizacion.toLowerCase().includes(query.toLowerCase())) ||
      (typeof row.total === 'string' && row.total.toLowerCase().includes(query.toLowerCase())) ||
      (typeof row.estado === 'string' && row.estado.toLowerCase().includes(query.toLowerCase())) ||
      (typeof row.tipoEnvio === 'string' && row.tipoEnvio.toLowerCase().includes(query.toLowerCase())) ||
      (typeof row.formaPago === 'string' && row.formaPago.toLowerCase().includes(query.toLowerCase())) ||
      (typeof row.fechaPedido === 'string' && row.fechaPedido.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Actualizamos los datos filtrados con los resultados de la búsqueda
    setFilterData(filtered);
  
    // Si no se encuentran resultados, mostramos un mensaje "Sin coincidencias"
    if (filtered.length === 0 && !isQueryEmpty) {
      setNoResults(false);
      // Aquí puedes mostrar el mensaje "Sin coincidencias" en tu interfaz de usuario
    }

  };
  
const handleDownloadFactura = (rowData: any) => {
  const pedidoId = rowData.id;
  const url = `http://localhost:8080/factura/${pedidoId}`;
  window.open(url);
};

const isDownloadEnabled = (rowData: any) => {
  return rowData.estado === Estado.CANCELADO;
};

const columns = [
  { id: 'horaEstimadaFinalizacion', label: 'Hora Estimada Finalización' },
  { id: 'total', label: 'Total' },
  { id: 'estado', label: 'Estado' },
  { id: 'tipoEnvio', label: 'Tipo Envío' },
  { id: 'formaPago', label: 'Forma Pago' },
  { id: 'fechaPedido', label: 'Fecha Pedido', renderCell: (rowData: any) => <span>{new Date(rowData.fechaPedido).toLocaleDateString()}</span> },
  { id: 'detallePedidos', label: 'Detalle del Pedido', renderCell: (rowData: any) => (
    <div>
      {rowData.detallePedidos.map((detalle: any, index: number) => (
        <div key={index}>
          <p>Cantidad: {detalle.cantidad}</p>
          <p>Artículo: {detalle.articulo.denominacion}</p>
        </div>
      ))}
    </div>
  ) },
  { id: 'actions', label: 'Acciones', renderCell: (rowData: any) => (
    <Button 
      className="btn btn-primary"
      variant="contained" 
      disabled={!isDownloadEnabled(rowData)}
      onClick={() => handleDownloadFactura(rowData)}
    >
      Descargar 
    </Button>
  ) },
];
// if (!isAuthenticated) {
//   return (
//     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//       <h3>Debes loguearte para ver tus pedidos</h3>
//     </div>
//   );
// }

  return (
      <>
        <BaseNavBar />
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
                        Mis Pedidos
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
                    {filteredData.length === 0 ? (
                        <Typography variant="body1">Sin resultados</Typography>
                    ) : (
                        <TableComponent
                            data={filteredData}
                            columns={columns}
                        />
                    )}


                  </Container>
                </Box>
              </CCol>
            </CRow>
          </CContainer>
        </React.Fragment>
      </>


  );
}
