import { useEffect, useState, useContext } from "react";
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ItemProducto from "../ItemProducto/ItemProducto";
import ArticuloDto from "../../../types/dto/ArticuloDto";
import { CarritoContextProvider, CartContext } from "../../../context/CarritoContext";
import { Carrito } from "../../ui/carrito/Carrito";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import Categoria from "../../../types/Categoria";
import CategoriaService from "../../../services/CategoriaService";
import "./Producto.css";
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import { Button } from "react-bootstrap";
import Domicilio from "../../../types/Domicilio";
import DeliveryModal from "../../ui/Modal/Delivery/Delivery";

const Producto = () => {
  const [productos, setProductos] = useState<ArticuloDto[]>([]);
  const productoService = new ArticuloManufacturadoService();
  const articuloInsumoService = new ArticuloInsumoService();
  const url = import.meta.env.VITE_API_URL;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const categoriaService = new CategoriaService();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);


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

      const insumos = insumData.filter((insumo) => !insumo.esParaElaborar);

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
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-3 mt-3">
              <div className="card carrito-card">
                <Carrito></Carrito>
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
  
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSave = (domicilio: Domicilio) => {
    // Handle the save logic here
    console.log('Domicilio saved:', domicilio);
  };

  const maxTiempoEstimado = cart.length > 0 
    ? Math.max(...cart.map(item => item.articulo.tiempoEstimadoMinutos))
    : 0;

  return (
    <div className="d-flex justify-content-center my-3">
      <button className="btn btn-primary mx-2">
        Local
        <div>{maxTiempoEstimado} minutos</div>
      </button>
      <div>
      <Button className="btn btn-secondary mx-2" onClick={handleShow}>
        Delivery
        <div>{maxTiempoEstimado + 20} minutos</div>
      </Button>
      <DeliveryModal show={showModal} handleClose={handleClose} handleSave={handleSave} />
    </div>
    </div>
  );
};

export default Producto;
