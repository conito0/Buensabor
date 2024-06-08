import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ArticuloInsumoService from "../../../../services/ArticuloInsumoService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import IUnidadMedida from "../../../../types/UnidadMedida";
import { toggleModal } from "../../../../redux/slices/Modal";
import ArticuloInsumo from "../../../../types/ArticuloInsumoType";
import UnidadMedidaService from "../../../../services/UnidadMedidaService";
import { useEffect, useState, ChangeEvent, useCallback } from "react";
import CategoriaService from "../../../../services/CategoriaService";
import Categoria from "../../../../types/Categoria";
import ImagenArticulo from "../../../../types/ImagenArticulo";
import { useParams } from "react-router-dom";

interface ModalArticuloInsumoProps {
  getArticulosInsumo: () => void;
  articuloToEdit?: ArticuloInsumo;
}

const ModalArticuloInsumo: React.FC<ModalArticuloInsumoProps> = ({
  getArticulosInsumo,
  articuloToEdit,
}) => {
  const articuloInsumoService = new ArticuloInsumoService();
  const unidadService = new UnidadMedidaService();
  const categoriaService = new CategoriaService();
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const url = import.meta.env.VITE_API_URL;

  const initialValues: ArticuloInsumo = {
    id: articuloToEdit ? articuloToEdit.id : 0,
    eliminado: articuloToEdit ? articuloToEdit.eliminado : false,
    denominacion: articuloToEdit ? articuloToEdit.denominacion : "",
    precioVenta: articuloToEdit ? articuloToEdit.precioVenta : 0,
    precioCompra: articuloToEdit ? articuloToEdit.precioCompra : 0,
    stockActual: articuloToEdit ? articuloToEdit.stockActual : 0,
    stockMaximo: articuloToEdit ? articuloToEdit.stockMaximo : 0,
    stockMinimo: articuloToEdit ? articuloToEdit.stockMinimo : 0,
    esParaElaborar: articuloToEdit ? articuloToEdit.esParaElaborar : false,
    imagenes: articuloToEdit
      ? articuloToEdit.imagenes?.map(
          (imagen: any) =>
            ({
              url: imagen.url,
              eliminado: false,
              name: imagen.name,
            } as ImagenArticulo)
        )
      : [],
    unidadMedida:
      articuloToEdit && articuloToEdit.unidadMedida
        ? { ...articuloToEdit.unidadMedida }
        : {
            id: 0,
            eliminado: false,
            denominacion: "",
          },
    categoria:
      articuloToEdit && articuloToEdit.categoria
        ? articuloToEdit.categoria
        : {
            id: 0,
            eliminado: false,
            denominacion: "",
            esInsumo: false,
            subCategorias: [],
            sucursales: [],
          },
  };
  const { sucursalId } = useParams();
  const modal = useAppSelector((state) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const fetchCategorias = useCallback(async () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, categoriaService, url]);

  const fetchUnidadesMedida = async () => {
    try {
      const unidades = await unidadService.getAll(url + "unidadMedida");
      setUnidadesMedida(unidades);
    } catch (error) {
      console.error("Error al obtener las unidades de medida:", error);
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Modal.Header closeButton>
        <Modal.Title>
          {articuloToEdit
            ? "Editar Artículo de Insumo"
            : "Agregar Artículo de Insumo"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            precioVenta: Yup.number().required("Campo requerido"),
            precioCompra: Yup.number().required("Campo requerido"),
            stockActual: Yup.number().required("Campo requerido"),
            stockMaximo: Yup.number().required("Campo requerido"),
            esParaElaborar: Yup.boolean().required("Campo requerido"),
          })}
          initialValues={initialValues}
          onSubmit={async (values: ArticuloInsumo) => {
            try {
              let articuloId: string | null = null;

              if (articuloToEdit) {
                await articuloInsumoService.put(
                  url + "articuloInsumo",
                  values.id.toString(),
                  values
                );
                console.log("Se ha actualizado correctamente.");
                articuloId = values.id.toString();
              } else {
                console.log(values);

                const response = await articuloInsumoService.post(
                  url + "articuloInsumo",
                  values
                );

                console.log("Se ha agregado correctamente.");

                articuloId = response.id.toString();
              }

              if (file && articuloId) {
                const response = await articuloInsumoService.uploadFile(
                  url + "articuloInsumo/uploads",
                  file,
                  articuloId
                );
                console.log("Upload successful:", response);
              }

              getArticulosInsumo();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form autoComplete="off">
              <Row>
                <Col>
                  <label htmlFor="denominacion">Denominación:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Denominación"
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
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precioVenta"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="precioCompra">Precio de Compra:</label>
                  <Field
                    name="precioCompra"
                    type="number"
                    placeholder="Precio de Compra"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precioCompra"
                    className="error-message"
                    component="div"
                  />
                </Col>
                <Col>
                  <label htmlFor="stockActual">Stock Actual:</label>
                  <Field
                    name="stockActual"
                    type="number"
                    placeholder="Stock Actual"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="stockActual"
                    className="error-message"
                    component="div"
                  />
                  <label htmlFor="stockMaximo">Stock Máximo:</label>
                  <Field
                    name="stockMaximo"
                    type="number"
                    placeholder="Stock Máximo"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="stockMaximo"
                    className="error-message"
                    component="div"
                  />
                  <label htmlFor="stockMinimo">Stock Minimo:</label>
                  <Field
                    name="stockMinimo"
                    type="number"
                    placeholder="Stock Máximo"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="stockMinimo"
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

                  <label htmlFor="esParaElaborar" className="mt-3">
                    Es para elaborar:
                  </label>
                  <Field
                    name="esParaElaborar"
                    type="checkbox"
                    className="form-check-input mx-2 mt-4"
                    style={{ border: "1px solid #333" }}
                  />
                  <ErrorMessage
                    name="esParaElaborar"
                    className="error-message"
                    component="div"
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <label htmlFor="imagenes">Imágenes:</label>
                  <input
                    name="imagen"
                    type="file"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const files = event.target.files;
                      if (files && files.length > 0) {
                        // Si se selecciona una imagen nueva, maneja el cambio de archivo
                        handleFileChange(event);
                      } else {
                        
                        // Si no se selecciona ninguna imagen nueva, no hagas nada para mantener las imágenes existentes
                      }
                    }}
                    className="form-control my-2"
                  />
                </Col>
              </Row>
              <Row>
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
                      console.error("No se encontró la categoria seleccionada");
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
              </Row>
              <Row className="mt-4">
                <Col className="text-end">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    className="me-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalArticuloInsumo;
