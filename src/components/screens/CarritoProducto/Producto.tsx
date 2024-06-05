import { useEffect, useState } from "react"
import ArticuloManufacturado from "../../../types/ArticuloManufacturado"
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ItemProducto from "../ItemProducto/ItemProducto";
import './Producto.css'

const Producto = () => {

    const [productos, setProductos] = useState <ArticuloManufacturado[]> ([]);
    const productoService = new ArticuloManufacturadoService();
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
            <div className="row">
                <div className="col-9">
                    <div className="row">
                        {productos.map((producto: ArticuloManufacturado, index) => {
                            return (
                                <ItemProducto
                                    productoObject={producto}
                                    key={index}
                                    id={producto.id}
                                    denominacion={producto.denominacion}
                                    precioVenta={producto.precioVenta}
                                    imagenes={producto.imagenes}
                                    descripcion={producto.descripcion}
                                    tiempoEstimadoMinutos={producto.tiempoEstimadoMinutos}

                                >
                                </ItemProducto>

                            )
                        })}
                    </div>
                </div>
                <div className="col-3">
                    <b>Carrito Compras</b>
                    <hr></hr>
                </div>
            </div>
        </>
    );
}
export default Producto;