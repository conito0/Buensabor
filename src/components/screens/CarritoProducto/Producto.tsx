import { useEffect, useState, useContext } from "react";
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ItemProducto from "../ItemProducto/ItemProducto";
import ArticuloDto from "../../../types/dto/ArticuloDto";
import {
  CarritoContextProvider,
  CartContext,
} from "../../../context/CarritoContext";
import { Carrito } from "../../ui/carrito/Carrito";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import Categoria from "../../../types/Categoria";
import CategoriaService from "../../../services/CategoriaService";
import "./Producto.css";
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import IArticuloInsumo from "../../../types/ArticuloInsumoType";
import IArticuloManufacturado from "../../../types/ArticuloManufacturado";
import { Button } from "react-bootstrap";
import DeliveryModal from "../../ui/Modal/Delivery/Delivery";
import { TipoEnvio } from "../../../types/enums/TipoEnvio";

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
const Producto = () => {
  const [productos, setProductos] = useState<ArticuloDto[]>([]);
  const productoService = new ArticuloManufacturadoService();
  const articuloInsumoService = new ArticuloInsumoService();
  const url = import.meta.env.VITE_API_URL;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const categoriaService = new CategoriaService();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [articuloInsumo, setArticuloInsumo] = useState<IArticuloInsumo[]>([]);
  const [articuloManufacturado, setArticuloManufacturado] = useState<
    IArticuloManufacturado[]
  >([]);

  const estaEnHorarioDeAtencion = (date: Date) => {
    const diaSemana = date.getDay();
    const horas = date.getHours();
    const minutos = date.getMinutes();

    const estaDentroRango = (
      horaInicio: any,
      minInicio: any,
      horaFin: any,
      minFin: any
    ) => {
      const tiempoActual = horas * 60 + minutos;
      const tiempoInicio = horaInicio * 60 + minInicio;
      const tiempoFin = horaFin * 60 + minFin;

      if (tiempoInicio < tiempoFin) {
        return tiempoActual >= tiempoInicio && tiempoActual < tiempoFin;
      } else {
        return tiempoActual >= tiempoInicio || tiempoActual < tiempoFin;
      }
    };

    const horarioLunesADomingo = estaDentroRango(0, 0, 23, 59);
    const horarioSabadoDomingo = estaDentroRango(0, 0, 23, 59);

    const esFinDeSemana = diaSemana === 6 || diaSemana === 0;

    if (esFinDeSemana) {
      return horarioLunesADomingo || horarioSabadoDomingo;
    } else {
      return horarioLunesADomingo;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const productData = await productoService.getAll(
        url + "articuloManufacturado"
      );
      const insumData = await articuloInsumoService.getAll(
        url + "articuloInsumo"
      );

      // Filtrar los productos manufacturados y los insumos
      const insumos = insumData.filter((insumo) => !insumo.esParaElaborar);
      setArticuloManufacturado(productData);
      setArticuloInsumo(insumos);
      // Combinar los productos manufacturados y los insumos en un solo array

      const combinedData = [...productData, ...insumos];

      const categories = await categoriaService.getAll(url + "categoria");
      setCategorias(categories);

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
        unidadMedida: value.unidadMedida,
      }));

      setProductos(mergedProducts);
    };
    fetchData();
  }, []);

  const handleCategoryFilter = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue ? parseInt(selectedValue) : null);
  };

  const filteredProducts = selectedCategory
    ? productos.filter((producto) => producto.categoria.id === selectedCategory)
    : productos;
  {
    filteredProducts.map((_producto: ArticuloDto, index) => (
      <div className="col-sm-3 mb-3" key={index}>
        {/* Contenido del producto */}
      </div>
    ));
  }

  if (!estaEnHorarioDeAtencion(new Date())) {
    return (
      <>
        <BaseNavBar />
        <div
          style={{ height: "calc(100vh - 56px)" }}
          className={
            "d-flex p-5 text-center flex-column justify-content-center align-items-center w-100"
          }
        >
          <div className={"h1"}>
            <b>El local se encuentra cerrado en este momento</b>
          </div>
          <div>
            Horario: Lunes a domingos de 20:00 a 12:00, y de sábados y domingos
            de 11:00 a 15:00.
          </div>
        </div>
      </>
    );
  }

  if (productos.length === 0) {
    return (
      <>
        <BaseNavBar />
        <div
          style={{ height: "calc(100vh - 56px)" }}
          className={
            "d-flex flex-column justify-content-center align-items-center w-100"
          }
        >
          <div className="spinner-border" role="status"></div>
          <div>Cargando los productos</div>
        </div>
      </>
    );
  }

  return (
    <>
      <BaseNavBar />
      <div className="container-fluid producto-container">
        <div className="row">
          <CarritoContextProvider>
            <div className="col-md-9">
              <select
                className="w-100 form-control custom-select mt-3"
                onChange={handleCategoryFilter}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.denominacion}
                  </option>
                ))}
              </select>
              <div className="row">
                {filteredProducts.map((producto: ArticuloDto, index) => (
                  <div className="col-sm-4 mb-3" key={index}>
                    <div className="producto-card">
                      <ItemProducto
                        id={producto.id}
                        denominacion={producto.denominacion}
                        descripcion=""
                        precioVenta={producto.precioVenta}
                        imagenes={[producto.imagen]}
                        tiempoEstimadoMinutos={producto.tiempoEstimadoMinutos}
                        productoObject={producto}
                        insumos={articuloInsumo}
                        productos={articuloManufacturado}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="card carrito-card">
                <Carrito
                  // insumos={articuloInsumo}
                  // productos={articuloManufacturado}
                ></Carrito>
                <CarritoButtons />
              </div>
            </div>
          </CarritoContextProvider>
        </div>
      </div>
    </>
  );
};

const CarritoButtons = () => {
  const { cart } = useContext(CartContext);
  // Agregamos un estado para el tipo de envío

  const maxTiempoEstimado =
    cart.length > 0
      ? Math.max(...cart.map((item) => item.articulo.tiempoEstimadoMinutos))
      : 0;
  const [showModalDelivery, setShowModalDelivery] = useState(false); // Estado para controlar la visibilidad del modal
  const [showModalPago, setShowModalPago] = useState(false); // Estado para controlar la visibilidad del modal
  const [tipoEnvio, setTipoEnvio] = useState("DELIVERY"); // Estado para el tipo de envío

  // Función para abrir el modal
  const handleOpenModalPago = (tipo: TipoEnvio) => {
    setTipoEnvio(tipo); // Establece el tipo de envío
    setShowModalPago(true);
  };

  // Función para cerrar el modal
  const handleCloseModalPago = () => {
    setShowModalPago(false);
  };

  // Función para abrir el modal
  const handleOpenModalDelivery = () => {
    setShowModalDelivery(true);
  };

  // Función para cerrar el modal
  const handleCloseModalDelivery = () => {
    setShowModalDelivery(false);
  };
  return (
    <div className="d-flex justify-content-center my-3">
      <button
        className="btn btn-primary mx-2"
        onClick={() => handleOpenModalPago(TipoEnvio.TAKEAWAY)}
      >
        Retiro
        <div>{maxTiempoEstimado} minutos</div>
      </button>
      <div>
        <Button
          className="btn btn-secondary mx-2"
          onClick={handleOpenModalDelivery}
        >
          Delivery
          <div>{maxTiempoEstimado + 20} minutos</div>
        </Button>
      </div>
      <DeliveryModal
        show={showModalDelivery} // Pasa el estado de visibilidad
        handleClose={handleCloseModalDelivery} // Pasa la función para cerrar el modal
        handleSave={(domicilio) => {
          // Aquí puedes manejar la lógica para guardar el domicilio
          console.log("Domicilio guardado:", domicilio);
        }}
      />
    </div>
  );
};
export default Producto;
