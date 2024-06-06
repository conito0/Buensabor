import { useEffect, useState } from "react"
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ItemProducto from "../ItemProducto/ItemProducto";
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import ArticuloDto from "../../../types/dto/ArticuloDto";
import { CarritoContextProvider } from "../../../context/CarritoContext";
import { Carrito } from "../../ui/carrito/Carrito";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";

const Producto = () => {

    const [productos, setProductos] = useState<ArticuloDto[]>([]);
    const productoService = new ArticuloManufacturadoService();
    const articuloInsumoService = new ArticuloInsumoService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const productData = await productoService.getAll(url + 'articuloManufacturado');
            const insumData = await articuloInsumoService.getAll(url + 'articuloInsumo');
    
            // Filtrar los productos manufacturados y los insumos
            const insumos = insumData.filter(insumo => !insumo.esParaElaborar);
    
            // Combinar los productos manufacturados y los insumos en un solo array
            const combinedData = [...productData, ...insumos];
    
            // Mapear el array combinado y ajustar los atributos necesarios
            const mergedProducts = combinedData.map((value) => ({
                id: value.id,
                categoria: value.categoria,
                denominacion: value.denominacion,
                precioVenta: value.precioVenta,
                eliminado: value.eliminado,
                imagen: value.imagenes[0] || undefined,
                precioCompra: 0,
                stockActual: 0,
                stockMaximo: 0,
                tiempoEstimadoMinutos: value.tiempoEstimadoMinutos || 0,
                unidadMedida: value.unidadMedida
            }));
    
            // Actualizar el estado con los productos combinados
            setProductos(mergedProducts);
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

    return (
        <>
          <BaseNavBar />
          <div className="container-fluid">
            <div className="row">
              <CarritoContextProvider>
                <div className="col-md-9">
                  <div className="row">
                    {productos.map((producto: ArticuloDto, index) => (
                      <div className="col-sm-3 mb-3" key={index}>
                        <ItemProducto
                          id={producto.id}
                          denominacion={producto.denominacion}
                          descripcion=""
                          precioVenta={producto.precioVenta}
                          imagenes={[producto.imagen]}
                          tiempoEstimadoMinutos={producto.tiempoEstimadoMinutos}
                          productoObject={producto}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-3 mt-3">
                    <div className="card">
                        <b className="text-center">Carrito Compras</b>
                        <Carrito></Carrito>
                    </div>
                </div>
              </CarritoContextProvider>
            </div>
          </div>
        </>
      );
      
}

export default Producto;
