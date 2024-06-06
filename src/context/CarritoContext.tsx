import React, { createContext, useState, ReactNode, useEffect } from "react";

import PedidoService from "../services/PedidoService";
import DetallePedido from "../types/DetallePedido";
// import DetallePedidoService from '../services/DetallePedidoService';
import ArticuloDto from "../types/dto/ArticuloDto";
import Pedido from "../types/Pedido";
import { useParams } from "react-router-dom";
import SucursalShortDtoService from "../services/dtos/SucursalShortDtoService";
import SucursalShorDto from "../types/dto/SucursalShortDto";

interface CartContextType {
  cart: DetallePedido[];
  addCarrito: (product: ArticuloDto) => void;
  removeCarrito: (product: ArticuloDto) => void;
  removeItemCarrito: (product: ArticuloDto) => void;
  limpiarCarrito: () => void;
  crearPedidoDetalle: () => Promise<number>;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addCarrito: () => {},
  removeCarrito: () => {},
  removeItemCarrito: () => {},
  limpiarCarrito: () => {},
  crearPedidoDetalle: async () => 0,
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<DetallePedido[]>([]);
  // const pedidoDetalleService = new DetallePedidoService();
  const pedidoService = new PedidoService();
  const url = import.meta.env.VITE_API_URL;
  const { sucursalId } = useParams();
  const sucursalService = new SucursalShortDtoService();
  const [sucursal, setSucursal] = useState<SucursalShorDto>(); // Inicialización del estado

  const fetchSucursalData = async () => {
    try {
      if (sucursalId) {
        const sucursal = await sucursalService.get(
          url + "sucursal",
          sucursalId
        );
        setSucursal(sucursal);
      }
    } catch (error) {
      console.error("Error al obtener los datos de la sucursal:", error);
    }
  };

  useEffect(() => {
    fetchSucursalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucursalId]); // Dependencia actualizada

  const addCarrito = (product: ArticuloDto) => {
    // lógica para agregar un producto al carrito
    const existe = cart.some((detalle) => detalle.articulo.id === product.id);

    console.log(existe);

    if (existe) {
      const cartClonado = cart.map((detalle) =>
        detalle.articulo.id === product.id
          ? { ...detalle, cantidad: detalle.cantidad + 1 }
          : detalle
      );
      setCart(cartClonado);
    } else {
      const nuevoDetalle: DetallePedido = {
        id: cart.length + 1,
        eliminado: false,
        cantidad: 1,
        subTotal: product.precioVenta,
        articulo: product,
        // pedido: new Pedido(),
      };
      const oldCart = cart;

      const newCart = [...oldCart, nuevoDetalle];

      setCart(newCart);
    }
  };

  const removeItemCarrito = (product: ArticuloDto) => {
    // lógica para eliminar un producto del carrito
    const existe = cart.some((detalle) => detalle.articulo.id === product.id);
    if (existe) {
      const cartClonado = cart
        .map((detalle) =>
          detalle.articulo.id === product.id
            ? { ...detalle, cantidad: detalle.cantidad - 1 }
            : detalle
        )
        .filter((detalle) => detalle.cantidad > 0);
      setCart(cartClonado);
    }
  };

  const removeCarrito = (product: ArticuloDto) => {
    // lógica para eliminar un producto completamente del carrito
    setCart((prevCart) =>
      prevCart.filter((detalle) => detalle.articulo.id !== product.id)
    );
  };

  const limpiarCarrito = () => {
    // lógica para limpiar todo el carrito
    setCart([]);
  };

  const crearPedidoDetalle = async (): Promise<number> => {
    try {
      // Crear detalles del pedido y asignarles el pedido
      const detallesConPedido: DetallePedido[] = cart.map((detalle) => {
        const pedidoDetalle = new DetallePedido();
        pedidoDetalle.articulo = detalle.articulo;
        pedidoDetalle.cantidad = detalle.cantidad;
        return pedidoDetalle;
      });
      console.log(cart);
      console.log(detallesConPedido);
     // Filtra los detalles del carrito cuyo tiempo estimado no sea 0
      const detallesConTiempo = cart.filter(detalle => detalle.articulo.tiempoEstimadoMinutos !== 0);

      // Calcula la suma de los tiempos estimados de los detalles filtrados
      const sumaTiempos = detallesConTiempo.reduce(
        (total, detalle) => total + detalle.articulo.tiempoEstimadoMinutos * detalle.cantidad,
        0
      );

      // Obtén la fecha y hora actual
      const fechaActual = new Date();

      // Calcula la hora estimada de finalización
      const horaActual = fechaActual.getHours();
      const minutosActuales = fechaActual.getMinutes();
      const sumaMinutos = sumaTiempos % 60;
      const sumaHoras = Math.floor(sumaTiempos / 60);
      // Calcula la hora estimada de finalización
      const horaEstimada = String(horaActual + sumaHoras).padStart(2, '0');
      const minutosEstimados = String(minutosActuales + sumaMinutos).padStart(2, '0');


      // Crea el objeto Pedido
      const nuevoPedido = new Pedido();
      nuevoPedido.fechaPedido = fechaActual;
      nuevoPedido.total = cart.reduce((total, detalle) => total + detalle.articulo.precioVenta * detalle.cantidad, 0);
      nuevoPedido.detallePedidos = cart;
      nuevoPedido.horaEstimadaFinalizacion = `${horaEstimada}:${minutosEstimados}`;
      if (sucursal) {
        nuevoPedido.sucursal = sucursal;
      } else {
        console.error('La sucursal no está definida');
      }

      // Guardar el pedido en el backend
      console.log(nuevoPedido);
      const respuestaPedido = await pedidoService.post(
        url + "pedido",
        nuevoPedido
      );

      // Guardar los detalles del pedido en el backend
      // const detallesRespuesta = await Promise.all(detallesConPedido.map(detalle => pedidoDetalleService.post(url + "pedidoDetalle", detalle)));
      // console.log(detallesRespuesta);

      // limpiarCarrito();

      // Devolver el ID del pedido como parte de la resolución de la promesa
      return respuestaPedido.id;
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addCarrito,
        limpiarCarrito,
        removeCarrito,
        removeItemCarrito,
        crearPedidoDetalle,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
