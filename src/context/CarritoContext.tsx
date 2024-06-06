import React, { createContext, useState, ReactNode, useEffect } from 'react';
import DetallePedido from '../types/DetallePedido';
import Pedido from '../types/Pedido';
import DetallePedidoService from '../services/DetallePedidoService';
import PedidoService from '../services/PedidoService';
import ArticuloDto from '../types/dto/ArticuloDto';
import { Estado } from '../types/enums/Estado';
import { TipoEnvio } from '../types/enums/TipoEnvio';
import { FormaPago } from '../types/enums/FormaPago';
import { useParams } from 'react-router-dom';
import SucursalService from '../services/SucursalService';
import SucursalShorDto from '../types/dto/SucursalShortDto';

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
  const pedidoDetalleService = new DetallePedidoService();
  const pedidoService = new PedidoService();
  const url = import.meta.env.VITE_API_URL;
  const { sucursalId } = useParams(); // Obtén el ID de la URL
  const sucursalService = new SucursalService();
  const [sucursal, setSucursal] = useState<SucursalShorDto | null>(null); // Variable de estado para almacenar el nombre de la sucursal

  const fetchSucursalData = async () => {
    try {
      if (sucursalId) {
        const sucursal = await sucursalService.get(url + 'sucursal', sucursalId);
        setSucursal(sucursal);
      }
    } catch (error) {
      console.error("Error al obtener los datos de la sucursal:", error);
    }
  };

  useEffect(() => {
    fetchSucursalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucursalId]);

  const addCarrito = (product: ArticuloDto) => {
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

  const removeItemCarrito = (product: ArticuloDto) => {
    const existe = cart.some((detalle) => detalle.articulo.id === product.id);
    if (existe) {
      const cartClonado = cart
        .map((detalle) =>
          detalle.articulo.id === product.id
            ? { ...detalle, cantidad: detalle.cantidad - 1, subTotal: (detalle.cantidad - 1) * product.precioVenta }
            : detalle
        )
        .filter((detalle) => detalle.cantidad > 0);
      setCart(cartClonado);
    }
  };

  const removeCarrito = (product: ArticuloDto) => {
    setCart((prevCart) => prevCart.filter((detalle) => detalle.articulo.id !== product.id));
  };

  const limpiarCarrito = () => {
    setCart([]);
  };

  const crearPedidoDetalle = async (): Promise<number> => {
    if (!sucursal) {
      throw new Error("Sucursal no definida");
    }

    try {
      const nuevoPedido: Pedido = {
        id: 0,
        horaEstimadaFinalizacion: "00:00:00",
        total: cart.reduce((total, detalle) => total + detalle.subTotal, 0),
        totalCosto: 0,
        estado: Estado.PREPARACION,
        tipoEnvio: TipoEnvio.DELIVERY,
        formaPago: FormaPago.MERCADOPAGO,
        fechaPedido: new Date().toISOString().split('T')[0],
        detallePedidos: cart,
        sucursal: sucursal,
        eliminado: false,
      };

      const respuestaPedido = await pedidoService.post(url + "pedido", nuevoPedido);

      const detallesConPedido: DetallePedido[] = cart.map((detalle) => ({
        ...detalle,
        pedido: respuestaPedido,
      }));

      const detallesRespuesta = await Promise.all(
        detallesConPedido.map((detalle) => pedidoDetalleService.post(url + "pedidoDetalle", detalle))
      );
      console.log(detallesRespuesta);

      limpiarCarrito();

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
  );
}
