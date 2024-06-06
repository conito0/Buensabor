import React, { createContext, useState, ReactNode } from 'react';
import IArticuloManufacturado from '../types/ArticuloManufacturado';
import DetallePedido from '../types/DetallePedido';
import Pedido from '../types/Pedido';
import DetallePedidoService from '../services/DetallePedidoService';
import PedidoService from '../services/PedidoService';
import ArticuloDto from '../types/dto/ArticuloDto';


interface CartContextType {
  cart: DetallePedido[];
  addCarrito: (product: IArticuloManufacturado) => void;
  removeCarrito: (product: IArticuloManufacturado) => void;
  removeItemCarrito: (product: IArticuloManufacturado) => void;
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
  const pedidoDetalleService = new DetallePedidoService();
  const pedidoService = new PedidoService();
  const url = import.meta.env.VITE_API_URL;

  const addCarrito = (product: ArticuloDto) => {
    // lógica para agregar un producto al carrito
    const existe = cart.some((detalle) => detalle.articulo.id === product.id);
    if (existe) {
      const cartClonado = cart.map((detalle) =>
        detalle.articulo.id === product.id
          ? { ...detalle, cantidad: detalle.cantidad + 1, subTotal: (detalle.cantidad + 1) * product.precioVenta }
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
      };
      setCart((prevCart) => [...prevCart, nuevoDetalle]);
    }
  };

  const removeItemCarrito = (product: IArticuloManufacturado) => {
    // lógica para eliminar un producto del carrito
    const existe = cart.some((detalle) => detalle.articulo.id === product.id);
    if (existe) {
      const cartClonado = cart.map((detalle) =>
        detalle.articulo.id === product.id
          ? { ...detalle, cantidad: detalle.cantidad - 1, subTotal: (detalle.cantidad - 1) * product.precioVenta }
          : detalle
      ).filter((detalle) => detalle.cantidad > 0);
      setCart(cartClonado);
    }
  };

  const removeCarrito = (product: IArticuloManufacturado) => {
    // lógica para eliminar un producto completamente del carrito
    setCart((prevCart) => prevCart.filter((detalle) => detalle.articulo.id !== product.id));
  };

  const limpiarCarrito = () => {
    // lógica para limpiar todo el carrito
    setCart([]);
  };

  const crearPedidoDetalle = async (): Promise<number> => {
    try {
      // lógica para crear el pedido con los detalles del carrito
      const nuevoPedido: Pedido = {
        id: 0,
        horaEstimadaFinalizacion: "00:00:00",
        total: cart.reduce((total, detalle) => total + detalle.subTotal, 0),
        totalCosto: 0,
        estado: "PREPARACION",
        tipoEnvio: "delivery",
        formaPago: "EFECTIVO",
        fechaPedido: new Date().toISOString().split('T')[0],
        detallePedidos: cart,
        sucursal: { id: 1, eliminado: false, nombre: "Sucursal 1", 
            domicilio: { id: 1, eliminado: false, calle: "Calle 1", cp: 1234 } },
        eliminado: false
      };
  
      // Guardar el pedido en el backend
      const respuestaPedido = await pedidoService.post(url + "pedido", nuevoPedido);
  
      // Crear detalles del pedido y asignarles el pedido
      const detallesConPedido: DetallePedido[] = cart.map(detalle => ({
        ...detalle,
        pedido: respuestaPedido,
      }));
  
      // Guardar los detalles del pedido en el backend
      const detallesRespuesta = await Promise.all(detallesConPedido.map(detalle => pedidoDetalleService.post(url + "pedidoDetalle", detalle)));
      console.log(detallesRespuesta);
  
      limpiarCarrito();
  
      // Devolver el ID del pedido como parte de la resolución de la promesa
      return respuestaPedido.id;
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, addCarrito, limpiarCarrito, removeCarrito, removeItemCarrito, crearPedidoDetalle }}>
      {children}
    </CartContext.Provider>

    <NavBar></NavBar>
  );
}
