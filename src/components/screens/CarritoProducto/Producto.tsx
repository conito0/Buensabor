import { useEffect, useState } from "react"
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ItemProducto from "../ItemProducto/ItemProducto";
import ArticuloDto from "../../../types/dto/ArticuloDto";
import { CarritoContextProvider } from "../../../context/CarritoContext";
import { Carrito } from "../../ui/carrito/Carrito";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import Categoria from "../../../types/Categoria";
import CategoriaService from "../../../services/CategoriaService";
import './Producto.css'
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import IArticuloInsumo from "../../../types/ArticuloInsumoType";
import IArticuloManufacturado from "../../../types/ArticuloManufacturado";

const Producto = () => {

  const [productos, setProductos] = useState<ArticuloDto[]>([]);
  const productoService = new ArticuloManufacturadoService();
  const articuloInsumoService = new ArticuloInsumoService();
  const url = import.meta.env.VITE_API_URL;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const categoriaService = new CategoriaService();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [articuloInsumo, setArticuloInsumo] = useState<IArticuloInsumo[]>([]);
  const [articuloManufacturado, setArticuloManufacturado] = useState<IArticuloManufacturado[]>([]);

  const estaEnHorarioDeAtencion = (date: Date) => {
    // Obtén el día de la semana y la hora
    const diaSemana = date.getDay(); // 0 (domingo) - 6 (sábado)
    const horas = date.getHours();
    const minutos = date.getMinutes();

    // Función auxiliar para comparar tiempos
    const estaDentroRango = (horaInicio: any, minInicio: any, horaFin: any, minFin: any) => {
      const tiempoActual = horas * 60 + minutos;
      const tiempoInicio = horaInicio * 60 + minInicio;
      const tiempoFin = horaFin * 60 + minFin;

      if (tiempoInicio < tiempoFin) {
        // Rango normal (mismo día)
        return tiempoActual >= tiempoInicio && tiempoActual < tiempoFin;
      } else {
        // Rango nocturno (cruza medianoche)
        return tiempoActual >= tiempoInicio || tiempoActual < tiempoFin;
      }
    }

    // Definir los rangos horarios
    const horarioLunesADomingo = estaDentroRango(20, 0, 12, 0);
    const horarioSabadoDomingo = estaDentroRango(11, 0, 15, 0);

    // Verificar si es fin de semana
    const esFinDeSemana = (diaSemana === 6) || (diaSemana === 0);

    if (esFinDeSemana) {
      // Sábados y domingos tienen dos rangos horarios
      return horarioLunesADomingo || horarioSabadoDomingo;
    } else {
      // Lunes a viernes solo tienen un rango horario
      return horarioLunesADomingo;
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const productData = await productoService.getAll(url + 'articuloManufacturado');
      const insumData = await articuloInsumoService.getAll(url + 'articuloInsumo');

      // Filtrar los productos manufacturados y los insumos
      const insumos = insumData.filter(insumo => !insumo.esParaElaborar);
      setArticuloManufacturado(productData)
      setArticuloInsumo(insumos)
      // Combinar los productos manufacturados y los insumos en un solo array
      const combinedData = [...productData, ...insumos];


      const categories = await categoriaService.getAll(url + 'categoria');
      setCategorias(categories);


      // Mapear el array combinado y ajustar los atributos necesarios
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
        unidadMedida: value.unidadMedida
      }));

      // Actualizar el estado con los productos combinados
      setProductos(mergedProducts);
    };
    fetchData();
  }, []);

  const handleCategoryFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    ))
  }

  // if(!estaEnHorarioDeAtencion(new Date())) {
  //   return (
  //       <>
  //         <BaseNavBar/>
  //         <div style={{height: "calc(100vh - 56px)"}} className={"d-flex p-5 text-center flex-column justify-content-center align-items-center w-100"}>
  //           <div className={"h1"}><b>El local se encuentra cerrado en este momento</b></div>
  //           <div>Horario: Lunes a domingos de 20:00 a 12:00, y de sábados y domingos de 11:00 a 15:00.</div>
  //         </div>
  //       </>
  //   );
  // }

  if (productos.length === 0) {
    return (
        <>
          <BaseNavBar/>
          <div style={{height: "calc(100vh - 56px)"}} className={"d-flex flex-column justify-content-center align-items-center w-100"}>
            <div className="spinner-border" role="status">
            </div>
            <div>Cargando los productos</div>
          </div>
        </>
    );
  }

  return (
      <>
        <BaseNavBar/>
        <div className="container-fluid producto-container">
          <div className="row">
            <CarritoContextProvider>
              <div className="col-md-9">
              <select className="w-100 form-control custom-select" onChange={handleCategoryFilter}>
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
                <Carrito insumos={articuloInsumo} productos={articuloManufacturado}></Carrito>
              </div>
            </div>
          </CarritoContextProvider>
        </div>
      </div>
    </>
  );


}

export default Producto;
