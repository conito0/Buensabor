import { useState } from "react";
import { useCarrito } from "../../../hooks/useHooks"

export const Carrito = () => {
    const { cart, limpiarCarrito, crearPedidoDetalle } = useCarrito();
    const [idPedido, setIdPedido] = useState<number | undefined>();

    const handleGenerarPedido = async () => {
        try {
          const nuevoIdPedido = await crearPedidoDetalle();
          setIdPedido(nuevoIdPedido);
        } catch (error) {
          console.error('Error al generar el pedido:', error);
        }
      };
    console.log(cart)
    const limpiarCarritoYResetearIdPedido = () => {
        limpiarCarrito();
        setIdPedido(undefined); // Restablecer idPedido a undefined cuando se limpie el carrito
      };
      
    return <>
        {cart.map((value) => <>
            <div>{value.articulo.denominacion} x{value.cantidad}</div>
            {idPedido !== undefined && (
              <div className="text-green m-3">
                El pedido con id {idPedido} se guardó correctamente!
              </div>
            )}
            <button
              className="btn btn-orange"
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
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17a2 2 0 1 0 2 2" />
                <path d="M17 17h-11v-11" />
                <path d="M9.239 5.231l10.761 .769l-1 7h-2m-4 0h-7" />
                <path d="M3 3l18 18" />
              </svg>
            </button>
            {idPedido === undefined && ( // Mostrar botón solo si idPedido es undefined
              <button className="btn btn-green" onClick={handleGenerarPedido}>
                GENERAR PEDIDO
              </button>
            )}
        </>)}
    </>
}