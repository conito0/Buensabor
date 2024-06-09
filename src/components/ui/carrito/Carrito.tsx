import { useState } from "react";
import { useCarrito } from "../../../hooks/useHooks";
import DetallePedido from "../../../types/DetallePedido";
import "./Carrito.css";
import { useAuth0 } from "@auth0/auth0-react";
import CheckoutMP from "../../screens/CheckoutMP/CheckoutMP";

interface CartItemProps {
  detalle: DetallePedido;
}

function CartItem({ detalle }: CartItemProps) {
  return (
    <div
      className="w-100 cart-item d-flex flex-row align-items-center"
      key={detalle.id}
    >
      <img
        width={50}
        height={50}
        src={`${detalle.articulo.imagen.url}`}
        alt={detalle.articulo.denominacion}
      />
      <div className={"w-100 text-left"}>
        <div>
          <b className={"text-truncate"}>{detalle.articulo.denominacion}</b>
        </div>
        <div>${detalle.articulo.precioVenta}</div>
        <div>
          <b>
            {detalle.cantidad} {detalle.cantidad === 1 ? "unidad" : "unidades"}{" "}
          </b>
        </div>
        <hr />
      </div>
    </div>
  );
}

export const Carrito = () => {
  const { cart, limpiarCarrito, crearPedidoDetalle } = useCarrito();
  const [idPedido, setIdPedido] = useState<number | undefined>();
  const [pedidoCreado, setPedidoCreado] = useState(false);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const totalProductos = cart.reduce(
    (total, detalle) => total + detalle.articulo.precioVenta * detalle.cantidad,
    0
  );

  // const handleGenerarPedido = async () => {
  //   try {
  //     const nuevoIdPedido = await crearPedidoDetalle();
  //     // console.log(nuevoIdPedido);
  //     setIdPedido(nuevoIdPedido);
  //     setPedidoCreado(true);
  //     setTimeout(() => {
  //       limpiarCarrito();
  //       setIdPedido(undefined);
  //       setPedidoCreado(false);
  //     }, 3000); // Espera de 1 segundo antes de limpiar el carrito
  //   } catch (error) {
  //     console.error("Error al generar el pedido:", error);
  //   }
  // };
  const handleGenerarPedido = async () => {
    try {
      const nuevoIdPedido = await crearPedidoDetalle();
      setIdPedido(nuevoIdPedido);
      setPedidoCreado(true)
    } catch (error) {
      console.error('Error al generar el pedido:', error);
    }
  };
  const limpiarCarritoYResetearIdPedido = () => {
    limpiarCarrito();
    setIdPedido(undefined); // Restablecer idPedido a undefined cuando se limpie el carrito
    setPedidoCreado(false);
  };

  // if (isAuthenticated && user) { // Verificamos si el usuario está autenticado y si hay datos de usuario

  //   return (
  //     <div>
  //       <h2>Bienvenido, {user.name}!</h2>
  //       <p>Email: {user.email}</p>
  //     </div>
  //   );
  // }
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
              <CartItem detalle={detalle} key={index} />
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
                <button
                  hidden={!isAuthenticated}
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={handleGenerarPedido}
                >
                  GENERAR PEDIDO
                </button>
                <button
                  hidden={isAuthenticated}
                  className="btn btn-outline-primary mt-3"
                  onClick={handleLogin}
                >
                  LOGEATE PARA GENERAR EL PEDIDO
                </button>
              </>
            )}
            {idPedido && <CheckoutMP idPedido={idPedido} />}

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
};
