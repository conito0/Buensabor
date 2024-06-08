import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setArticuloManufacturado } from "../../../redux/slices/ArticuloManufacturado";
import { toggleModal } from "../../../redux/slices/Modal";
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService.ts";
import AManufacturado from "../../../types/ArticuloManufacturado";
import TableComponent from "../../ui/Table/Table.tsx";
//import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
import ModalProducto from "../../ui/Modal/Producto/ModalProducto.tsx";
import ModalEliminarProducto from "../../ui/Modal/Producto/ModalEliminarProducto.tsx";
//import {handleSearch} from "../../../utils.ts/utils.ts";
import { CCol, CContainer, CRow } from "@coreui/react";
import UnidadMedida from "../../../types/UnidadMedida.ts";
import { handleSearch } from "../../../utils.ts/utils.ts";
import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
import { useParams } from "react-router-dom";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaProductos = () => {

  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const productoService = new ArticuloManufacturadoService();
  const [filteredData, setFilterData] = useState<Row[]>([]);
  const [productToEdit, setProductToEdit] = useState<AManufacturado | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const {sucursalId} = useParams();

  const globalArticuloManufacturado = useAppSelector(
      (state) => state.articuloManufacturado.data
  );
  

  const fetchImages = useCallback(async (productoId: string) =>{
    try{
      const response = await productoService.get(url + 'articuloManufacturado/getAllImagesByArticuloManufacturadoId', productoId);

      if(Array.isArray(response) && response.length > 0){
        return response[0].url;
      }
      return 'https://via.placeholder.com/150';
    }catch(error){
      return 'https://via.placeholder.com/150';
    }
  },[productoService, url]);

  const fetchProductos = useCallback(async () => {
    try {
      const productos = (await productoService.getAll(url + 'articuloManufacturado')).filter((v) => !v.eliminado);
      
      // Asegúrate de que sucursalId esté definido y conviértelo a un número
      if (sucursalId) {
        const sucursalIdNumber = parseInt(sucursalId); // Convertir sucursalId a número si es una cadena
        
        // Filtrar los productos por sucursal y categoría
        const productosFiltrados = productos.filter(producto =>
          producto.categoria && // Verificar si categoria está definido
          Array.isArray(producto.categoria.sucursales) && // Verificar si sucursales es un array en categoria
          producto.categoria.sucursales.some(sucursal => sucursal.id === sucursalIdNumber)
        );
  
        const productoConImagenes = await Promise.all(
          productosFiltrados.map(async (product) => {
            const imagenUrl = await fetchImages(product.id.toString());
            return { ...product, imagen: imagenUrl };
          })
        );
  
        dispatch(setArticuloManufacturado(productoConImagenes));
        setFilterData(productoConImagenes);
      } else {
        const productoConImagenes = await Promise.all(
          productos.map(async (product) => {
            const imagenUrl = await fetchImages(product.id.toString());
            return { ...product, imagen: imagenUrl };
          })
        );
  
        dispatch(setArticuloManufacturado(productoConImagenes));
        setFilterData(productoConImagenes);
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }, [dispatch, productoService, url, fetchImages, sucursalId]);
  
  useEffect(() => {
    fetchProductos();
    onSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleOpenDeleteModal = (rowData: Row) => {
    setProductToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      unidadMedida: rowData.unidadMedida,
      descripcion: rowData.descripcion,
      tiempoEstimadoMinutos: rowData.tiempoEstimadoMinutos,
      preparacion: rowData.preparacion,
      articuloManufacturadoDetalles: rowData.articuloManufacturado,
      categoria: rowData.categoria
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {

    console.log(deleteModalOpen)

    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
    fetchProductos();
  };

  const handleDelete = async () => {
    try {
      if (productToEdit && productToEdit.id) {
        await productoService.delete(url + 'articuloManufacturado', productToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); // Cerrar el modal de eliminación
        fetchProductos();
      } else {
        console.error('No se puede eliminar el producto porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };


  const handleAddProduct = () => {
    // Reset cuponToEdit to null when adding a new cupon
    setProductToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setProductToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      unidadMedida: rowData.unidadMedida,
      descripcion: rowData.descripcion,
      tiempoEstimadoMinutos: rowData.tiempoEstimadoMinutos,
      preparacion: rowData.preparacion,
      articuloManufacturadoDetalles: rowData.articuloManufacturadoDetalles,
      categoria: rowData.categoria
    });
    dispatch(toggleModal({ modalName: 'modal' }));
  };


  // Función para manejar la búsqueda de artículos manufacturados
  const onSearch = (query: string) => {
    handleSearch(query, globalArticuloManufacturado, setFilterData);
  };

  // Definición de las columnas para la tabla de artículos manufacturados
  const columns: Column[] = [
    // { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "categoria", label: "Categoria", renderCell: (rowData) => <>{rowData.categoria.denominacion}</> },
    { id: "precioVenta", label: "Precio", renderCell: (rowData) => <>{rowData.precioVenta}</> },
    { id: "descripcion", label: "Descripción", renderCell: (rowData) => <>{rowData.descripcion}</> },
    {
      id: "tiempoEstimadoMinutos",
      label: "Tiempo estimado en minutos",
      renderCell: (rowData) => <>{rowData.tiempoEstimadoMinutos}</>,
    }, 
    {
      id: "unidadMedida",
      label: "Unidad Medida",
      renderCell: (rowData) => {
        // Verifica si la unidad de medida está presente y si tiene la propiedad denominacion
        const unidadMedida: UnidadMedida = rowData.unidadMedida;
        if (unidadMedida && unidadMedida.denominacion) {
          return <span>{unidadMedida.denominacion}</span>;
        } else {
          // Si la unidad de medida no está presente o no tiene denominacion, muestra un valor por defecto
          return <span>Sin unidad de medida</span>;
        }
      }
    },
    {
      id: "imagenes",
      label: "Imágenes",
      renderCell: (rowData) => {
        const imagenes = rowData.imagenes;
        if (imagenes && imagenes.length > 0) {
          return (
            <div style={{ display: 'flex', gap: '5px' }}>
              {imagenes.map((imagen: any, index: number) => (
                <img key={index} src={imagen.url} alt={`Imagen ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
              ))}
            </div>
          );
        } else {
          return <span>No hay imágenes disponibles</span>;
        }
      }
    },
  ];

  return (
  <React.Fragment>
    <CContainer fluid style={{backgroundColor: "#fff"}}>
      <CRow>
        <CCol>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  my: 1,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Artículos Manufacturados
                </Typography>
                <button
                  className="btn btn-primary"
                  onClick={handleAddProduct}
                >
                  +
                  Artículos Manufacturados
                </button>
              </Box>
              {/* Barra de búsqueda */}
              <Box sx={{ mt: 2 }}>
                <SearchBar onSearch={onSearch} />
              </Box>
              {/* Componente de tabla para mostrar los artículos manufacturados */}
              <TableComponent data={filteredData} columns={columns} handleOpenDeleteModal={handleOpenDeleteModal} handleOpenEditModal={handleOpenEditModal} />

              {/* Llamando a ModalCupon con la prop fetchCupones y cuponToEdit */}
              <ModalProducto getProducts={fetchProductos} productToEdit={productToEdit !== null ? productToEdit : undefined} />

              <ModalEliminarProducto show={deleteModalOpen} onHide={handleCloseDeleteModal} product={productToEdit} onDelete={handleDelete} />
            </Container>
          </Box>
        </CCol>
      </CRow>
      </CContainer>
      </React.Fragment>

  );
}
