import { Box, Grid, Container, Typography } from "@mui/material";
// import InicioCard from "../../ui/common/InicioCard";
import ChartCard from "./ChartCard";
import BaseBar from "./BaseBar";
import BasePie from "./BasePie";
import React from "react";
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import Sidebar from "../../ui/Sider/SideBar";
import { CCol, CContainer, CRow } from "@coreui/react";

// Contenido para las tarjetas de inicio

// const EstadisticaContent = {
//     url: 'https://img.freepik.com/foto-gratis/grafico-barras-crecimiento-marketing-flecha-icono-compras-linea-signo-o-simbolo-concepto-comercio-electronico-sobre-fondo-azul-ilustracion-3d_56104-1787.jpg?t=st=1714963640~exp=1714967240~hmac=8552b84f75da0abe3845183fa21489047a486ef00e1df37dc51d6223cc008841&w=740',
//     title: 'Estadistica',
//     content: 'En esta sección encontraras la información general de tu empresa',
//     verMasUrl: '/estadisticas',
// };
// const CuponesContent = {
//     url: 'https://img.freepik.com/foto-gratis/cono-cupon-venta-o-compra-descuento-especial-promocion-marketing-compra-pago-comercio-electronico-compras-linea-ilustracion-3d_56104-2104.jpg?t=st=1714846472~exp=1714850072~hmac=23cc0754f9b08c9cb3d053e731ec73b7e25c376edf9141b0838e43dc9f9aae00&w=740',
//     title: 'Cupones',
//     content: 'Aqui puedes ver los cupones a los que pueden acceder tus clientes',
//     verMasUrl: '/cupones/lista',
// };

// const cardStyle = {
//   width: "100%",
//   height: "100%",
//   backgroundColor: "#9c27b0",
// };

const Inicio: React.FC = () => {
  return (
    <React.Fragment>
      <BaseNavBar/>
      <CContainer fluid>
        <CRow>
          {/* Sidebar */}
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>

          {/* Contenido principal */}
          <CCol>
            <Box component="main" sx={{ flexGrow: 1, pl: 9, pt: 4 }}>
              <Container>
                <Typography component="h1" variant="h5" color="initial">
                  Welcome
                </Typography>

                <Grid
                  container
                  spacing={3}
                  sx={{
                    py: 2,
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <ChartCard title="Gráfico de Pastel">
                      <BasePie />
                    </ChartCard>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ChartCard title="Gráfico de Barras">
                      <BaseBar />
                    </ChartCard>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={3}
                  sx={{ alignContent: "center", justifyContent: "center" }}
                >
                  {/* <Grid item xs={12} md={4}>
                            <Box sx={cardStyle}>
                                <InicioCard content={EstadisticaContent} />

                            </Box>
                        </Grid> */}
                
                  {/* <Grid item xs={12} md={4}>
                            <Box sx={cardStyle}>
                                <InicioCard content={CuponesContent} />

                            </Box>
                        </Grid> */}
                </Grid>
              </Container>
            </Box>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};

export default Inicio;
