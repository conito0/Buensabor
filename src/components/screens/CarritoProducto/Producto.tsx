import { useEffect, useState } from "react"
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService";
import ItemProducto from "../ItemProducto/ItemProducto";
import { BaseNavBar } from "../../ui/common/BaseNavBar";
import ArticuloDto from "../../../types/dto/ArticuloDto";
import { CarritoContextProvider } from "../../../context/CarritoContext";
import { Carrito } from "../../ui/carrito/Carrito";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import Categoria from "../../../types/Categoria";
import CategoriaService from "../../../services/CategoriaService";
import './Producto.css'

const Producto = () => {

  const [productos, setProductos] = useState<ArticuloDto[]>([]);
  const productoService = new ArticuloManufacturadoService();
  const articuloInsumoService = new ArticuloInsumoService();
  const url = import.meta.env.VITE_API_URL;
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const categoriaService = new CategoriaService();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const productData = await productoService.getAll(url + 'articuloManufacturado');
      const insumData = await articuloInsumoService.getAll(url + 'articuloInsumo');

      // Filtrar los productos manufacturados y los insumos
      const insumos = insumData.filter(insumo => !insumo.esParaElaborar);

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
              <select className="form-control custom-select" onChange={handleCategoryFilter}>
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
              </div>
            </div>
          </CarritoContextProvider>
        </div>
      </div>
    </>
  );


}

export default Producto;
