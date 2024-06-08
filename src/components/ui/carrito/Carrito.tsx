import { useEffect, useState } from "react";
import { useCarrito } from "../../../hooks/useHooks"
import DetallePedido from "../../../types/DetallePedido";
import './Carrito.css'
import {useAuth0} from "@auth0/auth0-react";
import IArticuloManufacturado from "../../../types/ArticuloManufacturado";
import IArticuloInsumo from "../../../types/ArticuloInsumoType";
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
// import ArticuloDto from "../../../types/dto/ArticuloDto";

interface CartItemProps {
  detalle: DetallePedido;
  insumos : IArticuloInsumo[];
  productos: IArticuloManufacturado[]
}

const verificarStockInsuficiente = async (detalle: DetallePedido, insumos: IArticuloInsumo[], productos: IArticuloManufacturado[]) => {
    const productoService = new ArticuloManufacturadoService();
    const articuloInsumoService = new ArticuloInsumoService();
    const url = import.meta.env.VITE_API_URL;
    const idArticulo = detalle.articulo.id.toString();

    try {
        let stockInsuficiente = false;

        // Verificar si el artículo existe en los artículos insumos  
        const encontradoEnInsumos = insumos.find(insumo => insumo.id === detalle.articulo.id);
        if (encontradoEnInsumos) {
            const insumoId = detalle.articulo.id;
            const cantidad = detalle.cantidad;

            const insumData = await articuloInsumoService.descontarStock(url + `articuloInsumo/descontarStock`, insumoId, cantidad);

            console.log(insumData)
            if (insumData < encontradoEnInsumos.stockMinimo) {
                stockInsuficiente = true;
            }
        } else {
            // Si no se encuentra en los insumos, buscar en los artículos manufacturados
            const encontradoEnManufacturados = productos.some(manufacturado => manufacturado.id === detalle.articulo.id);

            if (encontradoEnManufacturados) {
                const productData = await productoService.get(url + 'articuloManufacturado', idArticulo);
                // Iterar sobre cada detalle de articuloManufacturadoDetalles
                for (const detalleProducto of productData.articuloManufacturadoDetalles) {
                    // Verificar si el detalle tiene un atributo 'articuloInsumo'
                    if (detalleProducto.articuloInsumo) {
                        const stockMinimo = detalleProducto.articuloInsumo.stockMinimo;
                        const insumoId = detalleProducto.articuloInsumo.id;
                        const cantidadProduct = detalleProducto.cantidad * detalle.cantidad;

                        const insumData = await articuloInsumoService.descontarStock(url + `articuloInsumo/descontarStock`, insumoId, cantidadProduct);
                        console.log(insumData)

                        if(insumData < stockMinimo){
                            stockInsuficiente = true;
                            break; // Si encontramos un stock insuficiente, no es necesario seguir iterando
                        }
                    }
                }
            } 
        }

        return stockInsuficiente;
    } catch (error) {
        console.error("Error al verificar el stock:", error);
        return true; // Si hay un error, consideramos que hay stock insuficiente
    }
};

function CartItem({ detalle, insumos, productos}: CartItemProps) {
    const [stockInsuficiente, setStockInsuficiente] = useState(false);
  
    useEffect(() => {
        verificarStockInsuficiente(detalle, insumos, productos)
        .then(resultado => {
            console.log("Resultado: ",resultado)
            if (resultado === false) {
                setStockInsuficiente(false);
                console.log("stock suficiente")
            } else {
                setStockInsuficiente(true);
                console.log("stock insuficiente")
            }
        })
        .catch(error => {
            console.error("Ocurrió un error al verificar el stock:", error);
        });
    }, [detalle, detalle.cantidad, insumos, productos]);
    

    console.log(stockInsuficiente)

    if (stockInsuficiente) {
      return <div>Sin stock insuficiente de {detalle.articulo.denominacion}</div>;
    }
  
    return (
      <div className="w-100 cart-item d-flex flex-row align-items-center" key={detalle.id}>
        <img
            width={50}
            height={50}
            src={`${detalle.articulo.imagen.url}`}
            alt={detalle.articulo.denominacion}
        />
        <div className={"w-100 text-left"}>
            <div>
                <b className={"text-truncate"}>
                    {detalle.articulo.denominacion}
                </b>
            </div>
            <div>
                ${detalle.articulo.precioVenta}
            </div>
            <div>
                <b>
                    {detalle.cantidad} {detalle.cantidad === 1 ? "unidad" : "unidades"}{" "}
                </b>
            </div>
            <hr/>
        </div>
      </div>
    );
  }

export const Carrito = ({ insumos, productos }: { insumos: IArticuloInsumo[], productos: IArticuloManufacturado[] }) => {
    const {cart, limpiarCarrito, crearPedidoDetalle} = useCarrito();
    const [idPedido, setIdPedido] = useState<number | undefined>();
    const totalProductos = cart.reduce((total, detalle) => total + detalle.articulo.precioVenta * detalle.cantidad, 0);
    const [pedidoCreado, setPedidoCreado] = useState(false);
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const handleLogin = () => {
        loginWithRedirect();
    }

    const handleGenerarPedido = async () => {

        try {
            const nuevoIdPedido = await crearPedidoDetalle();
            setIdPedido(nuevoIdPedido);
            setPedidoCreado(true)
            setTimeout(() => {
                limpiarCarrito();
                setIdPedido(undefined);
                setPedidoCreado(false)
            }, 1000); // Espera de 1 segundo antes de limpiar el carrito
        } catch (error) {
          console.error('Error al generar el pedido:', error);
        }
      };

  const limpiarCarritoYResetearIdPedido = () => {
    limpiarCarrito();
    setIdPedido(undefined); // Restablecer idPedido a undefined cuando se limpie el carrito
    setPedidoCreado(false);
  };

  return (
    <div className="text-center">
      <label className="cart-button">
        <i>Carrito de Compras</i>
      </label>

      <aside className="cart">
        {cart.length === 0 ? (
          <p className="text-danger">Sin productos en el carrito.</p>
        ) : (
            <>
            {cart.map((detalle, index) => (
                <CartItem
                    insumos={insumos}
                    productos={productos}
                    detalle={detalle}
                    key={index}
                />
            ))}
            <div>
                <h3>${totalProductos}</h3>
            </div>
            <div className="mt-3">
                {!pedidoCreado && idPedido === undefined && (
                    <button
                        className="btn btn-outline-danger"
                        onClick={limpiarCarritoYResetearIdPedido} // Utilizar la función que limpia el carrito y restablece idPedido
                        title="Limpiar Todo"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="1"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                            <path d="M17 17a2 2 0 1 0 2 2"/>
                            <path d="M17 17h-11v-11"/>
                            <path d="M9.239 5.231l10.761 .769l-1 7h-2m-4 0h-7"/>
                            <path d="M3 3l18 18"/>
                        </svg>
                    </button>
                )}
            </div>

            {!pedidoCreado && idPedido === undefined && ( // Mostrar botón solo si idPedido es undefined
                <>
                    <button hidden={!isAuthenticated}  className='btn btn-outline-primary mt-3 w-100' onClick={handleGenerarPedido}>
                        GENERAR PEDIDO
                    </button>
                    <button hidden={isAuthenticated} className='btn btn-outline-primary mt-3' onClick={handleLogin}>
                        LOGEATE PARA GENERAR EL PEDIDO
                    </button>
                </>
            )}

                {pedidoCreado && idPedido !== undefined && (
                    <div className="text-success">
                        El pedido con id {idPedido} se guardó correctamente!
                    </div>
                )}


            </>
        )}


      </aside>
    </div>

  );
}