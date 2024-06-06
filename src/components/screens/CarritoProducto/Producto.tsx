import {  useEffect, useState } from "react"
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ItemProducto from "../ItemProducto/ItemProducto";
import './Producto.css'
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import { CCol, CContainer } from "@coreui/react";
import Sidebar from "../../ui/Sider/SideBar";
import { Row } from "react-bootstrap";
import ArticuloDto from "../../../types/dto/ArticuloDto";
import { CarritoContextProvider } from "../../../context/CarritoContext";
import { Carrito } from "../../ui/carrito/Carrito";

const Producto = () => {

    const [productos, setProductos] = useState <ArticuloDto[]> ([]);
    const productoService = new ArticuloManufacturadoService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const productData = await productoService.getAll(url + 'articuloManufacturado')
            setProductos(productData.map((value) => {
                return {
                    id: value.id,
                    categoria: value.categoria,
                    denominacion: value.denominacion,
                    precioVenta: value.precioVenta,
                    esParaElaborar: true,
                    eliminado: value.eliminado,
                    imagen: value.imagenes[0] || undefined,
                    precioCompra: 0,
                    stockActual: 0,
                    stockMaximo: 0,
                    unidadMedida: value.unidadMedida
                }
            }));
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
            <CarritoContextProvider>
            <CCol md="9">
                <div className="row">
                    {productos.map((producto: ArticuloDto, index) => (
                        <div className="col-md-9 mb-4" key={index}>
                        <ItemProducto
                            id={producto.id}
                            denominacion={producto.denominacion}
                            descripcion=""
                            precioVenta={producto.precioVenta}
                            imagenes={[producto.imagen]}
                            tiempoEstimadoMinutos={20}
                            productoObject={producto}
                        />
                        </div>
                    ))}
                </div>
            </CCol>
            <CCol md="3">
                <div className="sticky-top">
                <b>Carrito Compras</b>
                <hr />
                <Carrito></Carrito>
                </div>
            </CCol>
            </CarritoContextProvider>
        </Row>
      </CCol>
    </div>
  </CContainer>
</>

    );
}
export default Producto;