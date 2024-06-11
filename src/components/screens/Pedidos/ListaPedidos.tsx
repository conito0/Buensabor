import React, { useEffect, useState } from "react";
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
import Cliente from "../../../types/Cliente.ts";

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
  const pedidoService = new PedidoService();
  const [filteredData, setFilterData] = useState<Row[]>([]);
  const { sucursalId } = useParams();
  const { isAuthenticated, user,isLoading } = useAuth0();
  const clienteService = new ClientService();
  const [originalData, setOriginalData] = useState<Row[]>([]);

  const traerPedidos = (cliente: Cliente) => {
    if (cliente) {
      pedidoService.pedidosCliente(url, cliente.id).then((pedidosCliente) => {
        dispatch(setPedido(pedidosCliente));
        setFilterData(pedidosCliente);
        setOriginalData(pedidosCliente);
      }).catch(e => { console.log(e)});
    }
  };
  const fetchData = async () => {
    try {
      if (isAuthenticated && user && user.email) {
        clienteService
          .getByEmail(url + "cliente", user.email)
          .then((cliente) => {
            if (cliente) {
              traerPedidos(cliente);
            }
          });
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
    onSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated,isLoading]);

  const onSearch = (query: string) => {
    // Verificamos si el campo de búsqueda está vacío o no
    const isQueryEmpty = query.trim() === "";
    // Si el campo de búsqueda está vacío o es "false", mostramos todos los resultados sin filtrar
    if (isQueryEmpty) {
      setFilterData(originalData);
      return;
    }
    // Aplicamos la búsqueda sobre los datos filtrados
    const filtered = originalData.filter(
      (row) =>
        // Verificamos si la propiedad es una cadena antes de llamar a toLowerCase()
        (typeof row.horaEstimadaFinalizacion === "string" &&
          row.horaEstimadaFinalizacion
            .toLowerCase()
            .includes(query.toLowerCase())) ||
        (typeof row.total === "string" &&
          row.total.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.estado === "string" &&
          row.estado.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.tipoEnvio === "string" &&
          row.tipoEnvio.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.formaPago === "string" &&
          row.formaPago.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.fechaPedido === "string" &&
          row.fechaPedido.toLowerCase().includes(query.toLowerCase()))
    );

    // Actualizamos los datos filtrados con los resultados de la búsqueda
    setFilterData(filtered);
  };

  const handleDownloadFactura = (rowData: any) => {
    const pedidoId = rowData.id;
    const url = `http://localhost:8080/factura/${pedidoId}`;
    window.open(url);
  };

  const isDownloadEnabled = (rowData: any) => {
    return rowData.estado === Estado.CANCELADO;
  };

  const columns: Column[] = [
    {
      id: "horaEstimadaFinalizacion",
      label: "Hora Estimada Finalización",
      renderCell: (rowData) => <>{rowData.horaEstimadaFinalizacion}</>,
    },
    {
      id: "total",
      label: "Total",
      renderCell: (rowData) => <>{rowData.total}</>,
    },
    {
      id: "estado",
      label: "Estado",
      renderCell: (rowData) => <>{rowData.estado}</>,
    },
    {
      id: "tipoEnvio",
      label: "Tipo Envío",
      renderCell: (rowData) => <>{rowData.tipoEnvio}</>,
    },
    {
      id: "formaPago",
      label: "Forma Pago",
      renderCell: (rowData) => <>{rowData.formaPago}</>,
    },
    {
      id: "fechaPedido",
      label: "Fecha Pedido",
      renderCell: (rowData) => (
        <span>{new Date(rowData.fechaPedido).toLocaleDateString()}</span>
      ),
    },
    {
      id: "detallePedidos",
      label: "Detalle del Pedido",
      renderCell: (rowData) => (
        <div>
          {rowData.detallePedidos.map((detalle: any, index: number) => (
            <div key={index}>
              <p>Cantidad: {detalle.cantidad}</p>
              <p>Artículo: {detalle.articulo.denominacion}</p>
            </div>
          ))}
        </div>
      ),
    },

    {
      id: "actions",
      label: "Acciones",
      renderCell: (rowData) => (
        <Button
          className="btn btn-primary"
          variant="contained"
          disabled={!isDownloadEnabled(rowData)}
          onClick={() => handleDownloadFactura(rowData)}
        >
          Descargar
        </Button>
      ),
    },
  ];
  return (
    <React.Fragment>
      <CContainer fluid style={{ backgroundColor: "#fff" }}>
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
                    + Pedido
                  </a>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <SearchBar onSearch={onSearch} />
                </Box>
                <TableComponent data={filteredData} columns={columns} />
              </Container>
            </Box>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};
