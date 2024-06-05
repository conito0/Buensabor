import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import ArticuloManufacturadoDetalleService from "../../../../services/ArticuloManufacturadoDetalleService.ts";
import ArticuloManufacturadoService from "../../../../services/ArticuloManufacturadoService.ts";
import UnidadMedidaService from "../../../../services/UnidadMedidaService.ts";
// import ArticuloInsumoService from "../../../../services/ArticuloInsumoService.ts";
import CategoriaService from "../../../../services/CategoriaService.ts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts";
import { toggleModal } from "../../../../redux/slices/Modal.ts";
import ArticuloManufacturado from "../../../../types/ArticuloManufacturado.ts";
import UnidadMedida from "../../../../types/UnidadMedida.ts";
// import ArticuloInsumoType from "../../../../types/ArticuloInsumoType.ts";
import Categoria from "../../../../types/Categoria.ts";
import ModalInsumo from "./ModalInsumo.tsx";
import ArticuloManufacturadoDetalle from "../../../../types/ArticuloManufacturadoDetalle.ts";
import ArticuloInsumoShortDto from "../../../../types/dto/ArticuloInsumoShortDto.ts";
import ArticuloInsumoShortService from "../../../../services/dtos/ArticuloInsumoShortService.ts";
// import CategoriaShorService from '../../../../services/dtos/CategoriaShorService.ts';
// import CategoriaShorDto from '../../../../types/dto/CategoriaShorDto.ts';
import ArticuloManufacturadoDetalleService from "../../../../services/ArticuloManufacturadoDetalleService.ts";
import { useParams } from "react-router-dom";

interface ModalProductProps {
  getProducts: () => void;
  productToEdit?: ArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductProps> = ({
  getProducts,
  productToEdit,
}) => {
  const productoService = new ArticuloManufacturadoService();
  const unidadService = new UnidadMedidaService();
  // const insumoService = new ArticuloInsumoService();
  const insumoService = new ArticuloInsumoShortService();
  const { sucursalId } = useParams();
  const categoriaService = new CategoriaService();
  // const categoriaService = new CategoriaShorService();
  const articuloDetalleService = new ArticuloManufacturadoDetalleService();
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [insumos, setInsumos] = useState<ArticuloInsumoShortDto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  // const [selectedInsumo, setSelectedInsumo] = useState<number | null>(null);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [articuloManufacturadoDetalles, setArticuloManufacturadoDetalles] =
    useState<ArticuloManufacturadoDetalle[]>(
      productToEdit?.articuloManufacturadoDetalles || []
    );
  const url = import.meta.env.VITE_API_URL;
  const [modalColor, setModalColor] = useState<string>(""); // Estado para controlar el color de fondo de la modal
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);

  const initialValues: ArticuloManufacturado = {
    id: productToEdit ? productToEdit.id : 0,
    eliminado: productToEdit ? productToEdit.eliminado : false,
    denominacion: productToEdit?.denominacion || "",
    precioVenta: productToEdit?.precioVenta || 0,
    imagenes:
      productToEdit?.imagenes?.map((imagen: any) => imagen.denominacion) || [],
    unidadMedida: productToEdit?.unidadMedida
      ? { ...productToEdit.unidadMedida }
      : {
          id: 0,
          eliminado: false,
          denominacion: "",
        },
    descripcion: productToEdit?.descripcion || "",
    tiempoEstimadoMinutos: productToEdit?.tiempoEstimadoMinutos || 0,
    preparacion: productToEdit?.preparacion || "",
    articuloManufacturadoDetalles: productToEdit?.articuloManufacturadoDetalles
      ? productToEdit.articuloManufacturadoDetalles.map((detalle: any) => ({
          id: 0,
          cantidad: detalle.cantidad,
          eliminado: detalle.eliminado,
          articuloInsumo: {
            id: detalle.articuloInsumo.id,
            eliminado: detalle.eliminado,
            denominacion: detalle.articuloInsumo.denominacion,
            precioVenta: detalle.articuloInsumo.precioVenta,
            unidadMedida: detalle.unidadMedida,
            precioCompra: detalle.precioCompra,
            stockActual: detalle.stockActual,
            stockMaximo: detalle.stockMaximo,
            esParaElaborar: detalle.esParaElaborar,
            categoria: detalle.articuloInsumo.categoria
              ? {
                  id: detalle.articuloInsumo.categoria.id,
                  eliminado: detalle.articuloInsumo.categoria.eliminado,
                  denominacion: detalle.articuloInsumo.categoria.denominacion,
                  esInsumo: detalle.articuloInsumo.categoria.esInsumo,
                }
              : {
                  id: 0,
                  eliminado: false,
                  denominacion: "",
                  esInsumo: false,
                },
          },
        }))
      : [],
    categoria: productToEdit?.categoria
      ? { ...productToEdit.categoria }
      : {
          id: 0,
          eliminado: false,
          denominacion: "",
          esInsumo: false,
          subCategorias: [],
          sucursales: [],
        },
  };

  const modal = useAppSelector((state: any) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const fetchArticuloInsumo = async () => {
    try {
      const articulosInsumos = await insumoService.getAll(
        `${url}articuloInsumo`
      );

      // Asegúrate de que sucursalId esté definido y conviértelo a un número
      if (sucursalId) {
        const sucursalIdNumber = parseInt(sucursalId); // Convertir sucursalId a número si es una cadena

        // Filtrar los insumos por sucursal y categoría
        const insumosFiltrados = articulosInsumos.filter(
          (insumo) =>
            insumo.categoria && // Verificar si categoria está definido
            Array.isArray(insumo.categoria.sucursales) && // Verificar si sucursales es un array en categoria
            insumo.categoria.sucursales.some(
              (sucursal) => sucursal.id === sucursalIdNumber
            )
        );

        setInsumos(insumosFiltrados);
        console.log(insumosFiltrados);
      } else {
        setInsumos(articulosInsumos);
        console.log(articulosInsumos);
      }
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  };

  const fetchUnidadesMedida = async () => {
    try {
      const unidades = await unidadService.getAll(`${url}unidadMedida`);
      setUnidadesMedida(unidades);
      console.log(unidades);
    } catch (error) {
      console.error("Error al obtener las unidades de medida:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const categorias = await categoriaService.getAll(url + "categoria");

      if (sucursalId) {
        const parsedSucursalId = parseInt(sucursalId, 10);

        const categoriasFiltradas = categorias.filter((categoria) =>
          categoria.sucursales.some(
            (sucursal) => sucursal.id === parsedSucursalId
          )
        );
        setCategorias(categoriasFiltradas);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };
  useEffect(() => {
    fetchArticuloInsumo();
    fetchUnidadesMedida();
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Si la modal de insumos está abierta, establecer el color de fondo de la modal de producto
    if (showInsumoModal) {
      setModalColor("#f0f0f0");
    } else {
      setModalColor(""); // Si no, dejar el color de fondo predeterminado
    }
  }, [showInsumoModal]);

  const handleAddInsumo = (detalles: ArticuloManufacturadoDetalle[]) => {
    console.log("Detalles a guardar:", detalles);
    setArticuloManufacturadoDetalles(detalles);
    setDetalles(detalles); // Guardar los detalles en el estado
  };
  useEffect(() => {
    setDetalles(productToEdit?.articuloManufacturadoDetalles || []);
  }, [productToEdit]);

  // const handleAddD = (detalles: ArticuloManufacturadoDetalle[]) => {
  //     console.log("Detalles a guardar:", detalles);
  //     setDetalles(detalles); // Guardar los detalles en el estado
  // };

  return (
    <Modal
      id={"modal"}
      show={modal}
      onHide={handleClose}
      size={"lg"}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton style={{ backgroundColor: modalColor }}>
        <Modal.Title>
          {productToEdit ? "Editar Producto" : "Agregar Producto"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: modalColor }}>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            precioVenta: Yup.number().required("Campo requerido"),
            descripcion: Yup.string().required("Campo requerido"),
            preparacion: Yup.string().required("Campo requerido"),
            // categoria: Yup.number().required('Campo requerido'), // Agregar validación para la categoría
            // unidadMedida: Yup.string().required('Campo requerido'), // Agregar validación para la unidad de medida
            tiempoEstimadoMinutos: Yup.number().required("Campo requerido"),
          })}
          initialValues={initialValues}
          onSubmit={async (values: ArticuloManufacturado) => {
            console.log(values);
            try {
              let productoId: string | null = null;

              if (productToEdit) {
                const respuestas = await Promise.all(
                  detalles.map(async (detalle) => {
                    try {
                      // Verificar si el detalle ya existe
                      if (detalle.id) {
                        // Si el detalle tiene un ID, intenta actualizarlo
                        const respuesta2 = await articuloDetalleService.put(
                          url + "articuloManufacturadoDetalle",
                          detalle.id.toString(),
                          detalle
                        );
                        console.log("Detalle actualizado:", respuesta2);
                        return respuesta2; // Devolver la respuesta para procesamiento adicional
                      } else {
                        // Si el detalle no tiene un ID, insertarlo como nuevo
                        const respuesta2 = await articuloDetalleService.post(
                          url + "articuloManufacturadoDetalle",
                          detalle
                        );
                        console.log("Nuevo detalle insertado:", respuesta2);
                        return respuesta2; // Devolver la respuesta para procesamiento adicional
                      }
                    } catch (error) {
                      console.error("Error en articuloDetalleService:", error);
                      throw error; // Volver a lanzar el error para asegurar que Promise.all() falle
                    }
                  })
                );

                values.articuloManufacturadoDetalles = respuestas;

                // Actualizar el producto después de manejar los detalles
                await productoService.put(
                  url + "articuloManufacturado",
                  values.id.toString(),
                  values
                );
                console.log("Producto actualizado correctamente.");

                productoId = productToEdit.id.toString();
              } else {
                console.log(detalles);
                // Realizar todas las solicitudes 'post' de manera concurrente y recolectar sus respuestas
                const respuestas = await Promise.all(
                  detalles.map(async (detalle) => {
                    try {
                      // Realizar la solicitud 'post' para cada detalle
                      const respuesta2 = await articuloDetalleService.post(
                        url + "articuloManufacturadoDetalle",
                        detalle
                      );
                      console.log("Respuesta:", respuesta2);
                      return respuesta2; // Devolver la respuesta para procesamiento adicional
                    } catch (error) {
                      console.error(
                        "Error en articuloDetalleService.post():",
                        error
                      );
                      throw error; // Volver a lanzar el error para asegurar que Promise.all() falle
                    }
                  })
                );
                // Una vez que se recolectan todas las respuestas, actualizar el objeto 'values'
                values.articuloManufacturadoDetalles = respuestas;
                console.log("Valores actualizados:", values);

                console.log(values.articuloManufacturadoDetalles);
                const response = await productoService.post(
                  url + "articuloManufacturado",
                  values
                );
                console.log("Producto agregado correctamente.", values);

                productoId = response.id.toString();
              }

              console.log(file, productoId);

              if (file && productoId) {
                const response = await productoService.uploadFile(
                  url + "articuloManufacturado/uploads",
                  file,
                  productoId
                );
                console.log("Upload successful:", response);
              }

              getProducts();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
              console.log(JSON.stringify(values));
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form autoComplete="off">
              <Row>
                <Col>
                  <label htmlFor="denominacion">Nombre:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Nombre del Producto"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="denominacion"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="precioVenta">Precio de Venta:</label>
                  <Field
                    name="precioVenta"
                    type="number"
                    placeholder="Precio de Venta"
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="precioVenta"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="preparacion">Preparación:</label>
                  <Field
                    name="preparacion"
                    type="text"
                    placeholder="Preparación"
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="preparacion"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="categoria">Categoria:</label>
                  <Field
                    name="categoria"
                    as="select"
                    className="form-control"
                    onChange={(event: { target: { value: string } }) => {
                      const categoriaSelect = parseInt(event.target.value);
                      const selectedCategoria = categorias.find(
                        (categoria) => categoria.id === categoriaSelect
                      );

                      if (selectedCategoria) {
                        setFieldValue("categoria", selectedCategoria);
                      } else {
                        console.error(
                          "No se encontró la categoria seleccionada"
                        );
                      }
                    }}
                    value={values.categoria ? values.categoria.id : ""}
                  >
                    <option value="">Seleccionar categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.denominacion}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="categoria"
                    className="error-message"
                    component="div"
                  />
                </Col>
                <Col>
                  <label htmlFor="tiempoEstimadoMinutos">
                    Tiempo Estimado (en minutos):
                  </label>
                  <Field
                    name="tiempoEstimadoMinutos"
                    type="number"
                    placeholder="Tiempo Estimado"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="tiempoEstimadoMinutos"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="descripcion">Descripción:</label>
                  <Field
                    name="descripcion"
                    type="text"
                    placeholder="Descripción"
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="descripcion"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="unidadMedida">Unidad de Medida:</label>
                  <Field
                    name="unidadMedida"
                    as="select"
                    className="form-control"
                    onChange={(event: { target: { value: string } }) => {
                      const selectedUnitId = parseInt(event.target.value);
                      const selectedUnidad = unidadesMedida.find(
                        (unidad) => unidad.id === selectedUnitId
                      );

                      if (selectedUnidad) {
                        setFieldValue("unidadMedida", selectedUnidad);
                      } else {
                        console.error("No se encontró la unidad seleccionada");
                      }
                    }}
                    value={values.unidadMedida ? values.unidadMedida.id : ""}
                  >
                    <option value="">Seleccionar Unidad de Medida</option>
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.id} value={unidad.id}>
                        {unidad.denominacion}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="unidadMedida"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="imagen">Imagen:</label>
                  <input
                    name="imagen"
                    type="file"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      handleFileChange(event);
                    }}
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="imagen"
                    className="error-message"
                    component="div"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowInsumoModal(true)}
                  >
                    {productToEdit ? "Editar Insumos" : "Agregar insumos"}
                  </Button>
                </Col>
                {/* <Col>
                                    <ul className="list-group">
                                        {productToEdit ? (
                                            productToEdit.articuloManufacturadoDetalles.map((detalle, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span>{detalle.articuloInsumo.denominacion}</span>
                                                    <span>Cantidad: {detalle.cantidad}</span>
                                                </li>
                                            ))
                                        ) : (
                                            articuloManufacturadoDetalles.map((detalle, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span>{detalle.articuloInsumo.denominacion}</span>
                                                    <span>Cantidad: {detalle.cantidad}</span>
                                                </li>
                                            ))
                                        )}
                                    </ul>

                                </Col> */}
              </Row>
              <ModalInsumo
                insumos={insumos}
                show={showInsumoModal}
                handleClose={() => setShowInsumoModal(false)}
                handleAddInsumo={handleAddInsumo}
                initialDetalles={
                  productToEdit
                    ? productToEdit.articuloManufacturadoDetalles
                    : articuloManufacturadoDetalles || []
                }
              />
              <Button type="submit" className="btn btn-primary mt-3">
                {productToEdit ? "Guardar Cambios" : "Agregar Producto"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalProducto;
