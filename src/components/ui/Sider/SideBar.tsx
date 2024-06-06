import React from "react";
import { Link, useParams } from "react-router-dom";
import * as icon from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CNavItem,
  CNavTitle,
  CSidebar,
  CSidebarNav,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

const Sidebar: React.FC = () => {
  const { sucursalId } = useParams(); // Obtén el ID de la URL

  return (
    <div>
      <CSidebar
        className="border-end d-flex flex-column"
        style={{ height: "100vh" }}
      >
        <CSidebarNav style={{ display: "flex", flexDirection: "column" }}>
          <CNavTitle style={{ marginBottom: "10px" }}>Dashboard</CNavTitle>
          {/* <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#ffeeba",
              color: "#856404",
              padding: "5px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            <CNavItem>
              <Link
                to={`/usuario/${sucursalId}`}
                className="nav-link"
                style={{ color: "#856404" }}
              >
                <CIcon customClassName="nav-icon" icon={icon.cilPeople} />
                Usuarios
              </Link>
            </CNavItem>
          </div> */}
          <CNavItem>
            <Link to="/" className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilHamburgerMenu} />
              Inicio
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to={`/productos/lista/${sucursalId}`} className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilFastfood} />
              Productos
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to={`/categorias/${sucursalId}`} className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilSitemap} />
              Categorías
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to={`/unidadMedida/${sucursalId}`} className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilMediaStop} />
              Unidad de Medida
            </Link>
          </CNavItem>
          <CNavItem>
            <Link
              to={`/articuloInsumo/Lista/${sucursalId}`} className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilClipboard} />
              Articulo Insumo
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to={`/promociones/lista/${sucursalId}`} className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilCash} />
              Promociones
            </Link>
          </CNavItem>
          <CNavItem>
            <Link 
              to={`/carrito/${sucursalId}`} className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilFastfood} />
              Carrito
            </Link>
          </CNavItem>
        </CSidebarNav>

      </CSidebar>
    </div>
  );
};

export default Sidebar;
