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
}

    // TRUE si no son suficientes, si son suficientes devuelve FALSE
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
function CartItem({ detalle}: CartItemProps) {  
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
    const { cart, limpiarCarrito, crearPedidoDetalle } = useCarrito();
    const [idPedido, setIdPedido] = useState<number | undefined>();
    const [pedidoCreado, setPedidoCreado] = useState(false);
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const [detalleCarrito, setCarritoFiltrado] = useState<DetallePedido[]>([]);
    const [sinStock, setSinStock] = useState<string>("");

    const handleLogin = () => {
        loginWithRedirect();
    }

    const filtrarCarrito = async () => {
        const carritoFiltrado = [];
        for (const detalle of cart) {
            const tieneStockSuficiente = await verificarStockInsuficiente(detalle, insumos, productos);
            if (!tieneStockSuficiente) {
                carritoFiltrado.push(detalle);
                setSinStock("");
            } else {
                setSinStock(detalle.articulo.denominacion)
            }
        }
        setCarritoFiltrado(carritoFiltrado);
    };

    useEffect(() => {
        filtrarCarrito();
    }, [cart, insumos, productos]);

    const totalProductos = detalleCarrito.reduce((total, detalle) => total + detalle.articulo.precioVenta * detalle.cantidad, 0);

    const handleGenerarPedido = async () => {
        try {
            const nuevoIdPedido = await crearPedidoDetalle();
            console.log(nuevoIdPedido)
            setIdPedido(nuevoIdPedido);
            setPedidoCreado(true)
            setTimeout(() => {
                limpiarCarrito();
                setIdPedido(undefined);
                setPedidoCreado(false);
            }, 3000); // Espera de 1 segundo antes de limpiar el carrito
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
                {/* {sinStock && (
                    <p className="text-danger">Sin stock suficiente de: {sinStock}</p>
                )} */}

                {detalleCarrito.length === 0 ? (
                    <p className="text-danger">Sin productos en el carrito.</p>
                ) : (
                    <>
                        {detalleCarrito.map((detalle, index) => (
                            <CartItem
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
                                    onClick={limpiarCarritoYResetearIdPedido}
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
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                        <path d="M17 17a2 2 0 1 0 2 2" />
                                        <path d="M17 17h-11v-11" />
                                        <path d="M9.239 5.231l10.761 .769l-1 7h-2m-4 0h-7" />
                                        <path d="M3 3l18 18" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {!pedidoCreado && idPedido === undefined && (
                            <>
                                <button hidden={!isAuthenticated} className='btn btn-outline-primary mt-3 w-100' onClick={handleGenerarPedido}>
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
