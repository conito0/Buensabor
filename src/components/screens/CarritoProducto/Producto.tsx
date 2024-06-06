import { useEffect, useState } from "react"
import ItemProducto from "../ItemProducto/ItemProducto";
import './Producto.css'
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import { CCol, CContainer } from "@coreui/react";
import Sidebar from "../../ui/Sider/SideBar";
import { Row } from "react-bootstrap";
import ArticuloDto from "../../../types/dto/ArticuloDto";
import ArticuloDtoService from "../../../services/ArticuloDto";

const Producto = () => {

    const [productos, setProductos] = useState <ArticuloDto[]> ([]);
    const productoService = new ArticuloDtoService();
    const url = import.meta.env.VITE_API_URL;


    useEffect(() => {
        const fetchData = async () => {
            const productData = await productoService.getAll(url + 'articuloManufacturado')
            setProductos(productData);
            console.log(productData);
        };
        fetchData();
    }, []);

    if (productos.length === 0) {
        return (
            <div className="alert alert-danger" role="alert">
                No hay productos disponibles
            </div>
        );
    }

    return(
        <>
  <BaseNavBar title="" />
  <CContainer fluid>
    <div className="row">
      {/* Sidebar */}
      <CCol sm="2">
        <Sidebar />
      </CCol>
      <CCol sm="10">
        <Row>
            <CCol md="9">
                <div className="row">
                {productos.map((producto: ArticuloDto, index) => (
                    <div className="col-md-9 mb-4" key={index}>
                    <ItemProducto
                        productoObject={producto}
                        id={producto.id}
                        denominacion={producto.denominacion}
                        precioVenta={producto.precioVenta}
                        imagenes={producto.imagenes}
                        descripcion={producto.descripcion}
                        tiempoEstimadoMinutos={producto.tiempoEstimadoMinutos}
                    />
                    </div>
                ))}
                </div>
            </CCol>
            <CCol md="3">
                <div className="sticky-top">
                <b>Carrito Compras</b>
                <hr />
                {/* Aquí va el contenido del carrito */}
                </div>
            </CCol>
        </Row>
      </CCol>
    </div>
  </CContainer>
</>

    );
}
export default Producto;