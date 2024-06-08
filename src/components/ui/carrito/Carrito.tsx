import { useState } from "react";
import { useCarrito } from "../../../hooks/useHooks"
import DetallePedido from "../../../types/DetallePedido";
import './Carrito.css'

interface CartItemProps {
  detalle: DetallePedido;
}

function CartItem({ detalle }: CartItemProps) {
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

export const Carrito = () => {
    const {cart, limpiarCarrito, crearPedidoDetalle} = useCarrito();
    const [idPedido, setIdPedido] = useState<number | undefined>();
    const totalProductos = cart.reduce((total, detalle) => total + detalle.articulo.precioVenta * detalle.cantidad, 0);
    const [pedidoCreado, setPedidoCreado] = useState(false);

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

            {!pedidoCreado && idPedido === undefined && ( // Mostrar botón solo si idPedido es undefined
              <button className='btn btn-outline-primary mt-3' onClick={handleGenerarPedido}>
                GENERAR PEDIDO
              </button>
            )}

            {pedidoCreado && idPedido !== undefined && (
              <div className="text-success">
                El pedido con id {idPedido} se guardó correctamente!
              </div>
            )}




          </>
        )}


      </aside >
    </div>

  );
}