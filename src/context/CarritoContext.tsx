import { createContext, useState, ReactNode, useEffect } from "react";

import PedidoService from "../services/PedidoService";
import DetallePedido from "../types/DetallePedido";
// import DetallePedidoService from '../services/DetallePedidoService';
import ArticuloDto from "../types/dto/ArticuloDto";
import Pedido from "../types/Pedido";
import { useParams } from "react-router-dom";
import SucursalShortDtoService from "../services/dtos/SucursalShortDtoService";
import SucursalShorDto from "../types/dto/SucursalShortDto";
import ArticuloManufacturadoService from "../services/ArticuloManufacturadoService";
import ArticuloInsumoService from "../services/ArticuloInsumoService";
import IArticuloInsumo from "../types/ArticuloInsumoType";
import IArticuloManufacturado from "../types/ArticuloManufacturado";
import { useAuth0 } from "@auth0/auth0-react";
import ClientService from "../services/ClienteService";
import Cliente from "../types/Cliente";
import { TipoEnvio } from "../types/enums/TipoEnvio";
import Domicilio from "../types/Domicilio";
import { FormaPago } from "../types/enums/FormaPago";

interface CartContextType {
  cart: DetallePedido[];
  addCarrito: (
    product: ArticuloDto,
    insumos: IArticuloInsumo[],
    productos: IArticuloManufacturado[]
  ) => void;
  removeCarrito: (product: ArticuloDto) => void;
  removeItemCarrito: (product: ArticuloDto) => void;
  limpiarCarrito: () => void;
  crearPedidoDetalle: (tipoEnvio: TipoEnvio, formaPago : FormaPago, domicilio?: Domicilio) => Promise<number>;
}

export const CartContext = createContext<CartContextType>({
  cart: JSON.parse(localStorage.getItem("cart") || "[]") || [],
  addCarrito: () => {},
  removeCarrito: () => {},
  removeItemCarrito: () => {},
  limpiarCarrito: () => {},
  crearPedidoDetalle: async () => 0,
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<DetallePedido[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  // const pedidoDetalleService = new DetallePedidoService();
  const pedidoService = new PedidoService();
  const url = import.meta.env.VITE_API_URL;
  const { sucursalId } = useParams();
  const sucursalService = new SucursalShortDtoService();
  const [sucursal, setSucursal] = useState<SucursalShorDto>(); // Inicialización del estado
  const { isAuthenticated, user } = useAuth0();
  const clienteService = new ClientService();
  const [client, setClient] = useState<Cliente | null>(null);
  const fetchSucursalData = async () => {
    try {
      if (sucursalId) {
        const sucursal = await sucursalService.get(
          url + "sucursal",
          sucursalId
        );
        console.log(sucursal)
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

  // TRUE si no son suficientes, si son suficientes devuelve FALSE
  const verificarStockInsuficiente = async (
    detalle: DetallePedido,
    insumos: IArticuloInsumo[],
    productos: IArticuloManufacturado[]
  ) => {
    const productoService = new ArticuloManufacturadoService();
    const articuloInsumoService = new ArticuloInsumoService();
    const url = import.meta.env.VITE_API_URL;
    const idArticulo = detalle.articulo.id.toString();

    try {
      let stockInsuficiente = false;

      // Verificar si el artículo existe en los artículos insumos
      const encontradoEnInsumos = insumos.find(
        (insumo) => insumo.id === detalle.articulo.id
      );
      if (encontradoEnInsumos) {
        const insumoId = detalle.articulo.id;
        const cantidad = detalle.cantidad;

        const insumData = await articuloInsumoService.descontarStock(
          url + `articuloInsumo/descontarStock`,
          insumoId,
          cantidad
        );

        if (insumData <= encontradoEnInsumos.stockMinimo) {
          stockInsuficiente = true;
        }
      } else {
        // Si no se encuentra en los insumos, buscar en los artículos manufacturados
        const encontradoEnManufacturados = productos.some(
          (manufacturado) => manufacturado.id === detalle.articulo.id
        );

        if (encontradoEnManufacturados) {
          const productData = await productoService.get(
            url + "articuloManufacturado",
            idArticulo
          );
          // Iterar sobre cada detalle de articuloManufacturadoDetalles
          for (const detalleProducto of productData.articuloManufacturadoDetalles) {
            // Verificar si el detalle tiene un atributo 'articuloInsumo'
            if (detalleProducto.articuloInsumo) {
              const stockMinimo = detalleProducto.articuloInsumo.stockMinimo;
              const insumoId = detalleProducto.articuloInsumo.id;
              const cantidadProduct =
                detalleProducto.cantidad * detalle.cantidad;

              const insumData = await articuloInsumoService.descontarStock(
                url + `articuloInsumo/descontarStock`,
                insumoId,
                cantidadProduct
              );

              if (insumData <= stockMinimo) {
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
  const addCarrito = async (
    product: ArticuloDto,
    insumos: IArticuloInsumo[],
    productos: IArticuloManufacturado[]
  ) => {
    // Sincronizar el carrito desde el localStorage
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(currentCart);

    // Verificar si el producto ya existe en el carrito
    const existe = currentCart.some(
      (detalle: any) => detalle.articulo.id === product.id
    );
    // console.log("Existe en carrito: ", existe);

    if (existe) {
      // Crear un clon del carrito con la cantidad incrementada
      const cartClonado = currentCart.map((detalle: any) =>
        detalle.articulo.id === product.id
          ? { ...detalle, cantidad: detalle.cantidad + 1 }
          : detalle
      );

      // Verificar el stock de cada detalle en el carrito clonado
      const verificacionStock = await Promise.all(
        cartClonado.map(async (detalle: any) => {
          // console.log(detalle);
          const tieneStockSuficiente = await verificarStockInsuficiente(
            detalle,
            insumos,
            productos
          );
          // console.log(tieneStockSuficiente);
          return {
            ...detalle,
            tieneStockSuficiente,
          };
        })
      );

      // Verificar si todos los detalles tienen suficiente stock
      const todosTienenStock = verificacionStock.every(
        (detalle) => !detalle.tieneStockSuficiente
      );

      if (todosTienenStock) {
        // Actualizar el estado del carrito y el localStorage
        setCart(cartClonado);
        localStorage.setItem("cart", JSON.stringify(cartClonado));
        // console.log(
        //   "Stock suficiente para todos los productos. Carrito actualizado.",
        //   cartClonado
        // );
      } else {
        alert("El producto se encuentra sin stock");
        // console.log(
        //   "No hay suficiente stock para todos los productos. Carrito no actualizado.",
        //   verificacionStock
        // );
      }
    } else {
      // Crear un nuevo detalle para agregar al carrito
      const nuevoDetalle: DetallePedido = {
        id: currentCart.length + 1,
        eliminado: false,
        cantidad: 1,
        subTotal: product.precioVenta,
        articulo: product,
      };

      nuevoDetalle.subTotal =
        nuevoDetalle.articulo.precioVenta * nuevoDetalle.cantidad;

      // Agregar el nuevo detalle al carrito
      const newCart = [...currentCart, nuevoDetalle];

      // Verificar el stock de cada detalle en el nuevo carrito
      const verificacionStock = await Promise.all(
        newCart.map(async (detalle) => {
          // console.log(detalle);
          const tieneStockSuficiente = await verificarStockInsuficiente(
            detalle,
            insumos,
            productos
          );
          // console.log(tieneStockSuficiente);
          return {
            ...detalle,
            tieneStockSuficiente,
          };
        })
      );

      // Verificar si todos los detalles tienen suficiente stock
      const todosTienenStock = verificacionStock.every(
        (detalle) => !detalle.tieneStockSuficiente
      );

      if (todosTienenStock) {
        // Actualizar el estado del carrito y el localStorage
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        // console.log(
        //   "Stock suficiente para todos los productos. Carrito actualizado.",
        //   newCart
        // );
      } else {
        alert("El producto se encuentra sin stock");
        // console.log(
        //   "No hay suficiente stock para todos los productos. Carrito no actualizado.",
        //   verificacionStock
        // );
      }
    }
  };

  const removeItemCarrito = (product: ArticuloDto) => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));

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

      localStorage.setItem("cart", JSON.stringify(cartClonado));
    }
  };
  const removeCarrito = (product: ArticuloDto) => {
    // Obtener el carrito actual del localStorage
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    // lógica para eliminar un producto completamente del carrito
    const updatedCart = currentCart.filter((detalle: any) => detalle.articulo.id !== product.id);
  
    // Actualizar el estado del carrito y almacenarlo en el localStorage
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const limpiarCarrito = () => {
    // lógica para limpiar todo el carrito
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const crearPedidoDetalle = async (tipoEnvio: TipoEnvio, formaPago: FormaPago, domicilio?: Domicilio): Promise<number> => {
    console.log(tipoEnvio)
    try {
      // Crear detalles del pedido y asignarles el pedido
      const detallesConPedido: DetallePedido[] = cart.map((detalle) => {
        const pedidoDetalle = new DetallePedido();
        pedidoDetalle.articulo = detalle.articulo;
        pedidoDetalle.cantidad = detalle.cantidad;
        pedidoDetalle.subTotal =
          detalle.articulo.precioVenta * detalle.cantidad;
        return pedidoDetalle;
      });
      // console.log(cart);
      // console.log(detallesConPedido);

      // Filtra los detalles del carrito cuyo tiempo estimado no sea 0
      const detallesConTiempo = cart.filter(
        (detalle) => detalle.articulo.tiempoEstimadoMinutos !== 0
      );

      // Calcula la suma de los tiempos estimados de los detalles filtrados
      const sumaTiempos = detallesConTiempo.reduce(
        (total, detalle) =>
          total + detalle.articulo.tiempoEstimadoMinutos * detalle.cantidad,
        0
      );

      // Obtén la fecha y hora actual
      const fechaActual = new Date();

      // Calcula la hora estimada de finalización
      const horaActual = fechaActual.getHours();
      const minutosActuales = fechaActual.getMinutes();
      const totalMinutos = minutosActuales + sumaTiempos;

      // Calcula las horas y minutos totales
      const horasAdicionales = Math.floor(totalMinutos / 60);
      // const minutosEstimados = totalMinutos % 60;
      // const horaEstimada = (horaActual + horasAdicionales) % 24;
      let minutosEstimados = totalMinutos % 60;
      let horaEstimada = (horaActual + horasAdicionales) % 24;
      
      // Agregar 10 minutos si el tipo de envío es DELIVERY
      if (tipoEnvio === TipoEnvio.DELIVERY) {
        minutosEstimados += 10;
        if (minutosEstimados >= 60) {
          minutosEstimados -= 60;
          horaEstimada = (horaEstimada + 1) % 24;
        }
      }
      // Formatea la hora y los minutos
      const horaEstimadaFormateada = String(horaEstimada).padStart(2, "0");
      const minutosEstimadosFormateados = String(minutosEstimados).padStart(
        2,
        "0"
      );

      // Resultado final
      const tiempoEstimado = `${horaEstimadaFormateada}:${minutosEstimadosFormateados}`;

      // console.log(`Hora estimada de finalización: ${tiempoEstimado}`);
      const total = 0;
      const subtotal = cart.reduce(
        (total, detalle) =>
          total + detalle.articulo.precioVenta * detalle.cantidad,
        0
      );
      const totalPedido = tipoEnvio === TipoEnvio.TAKEAWAY ? subtotal * 0.9 : subtotal; // Aplicar un descuento del 10% si es TAKEAWAY
      console.log('Total con descuento (si aplica):', total);

      // Crea el objeto Pedido
      const nuevoPedido = new Pedido();
      nuevoPedido.fechaPedido = fechaActual;
      nuevoPedido.total = totalPedido;
      nuevoPedido.detallePedidos = detallesConPedido;
      nuevoPedido.horaEstimadaFinalizacion = `${tiempoEstimado}`;
      if (sucursal) {
        nuevoPedido.sucursal = sucursal;
      } else {
        console.error("La sucursal no está definida");
      }
      if(tipoEnvio == TipoEnvio.DELIVERY){
        if(domicilio){
          nuevoPedido.domicilio = domicilio;
        }
        nuevoPedido.formaPago = formaPago;
      }
      if(tipoEnvio == TipoEnvio.TAKEAWAY){
        if(domicilio){
          nuevoPedido.domicilio = undefined;
        }
        nuevoPedido.formaPago = formaPago;
      }
      if (isAuthenticated && user && user.email) {
        try {
          const cliente = await clienteService.getByEmail(url + "cliente", user.email);
          setClient(cliente ?? null);
          if(cliente){
            nuevoPedido.cliente = cliente;
          }
          console.log(cliente)
        } catch (error) {
          setClient(null);
        }
      }

      nuevoPedido.tipoEnvio = tipoEnvio;
      nuevoPedido.factura = null;
      
      // Guardar el pedido en el backend  
      console.log(nuevoPedido);
      console.log(nuevoPedido.factura);
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
