import React, { useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Categoria from "../../../../types/Categoria";
import CategoriaService from "../../../../services/CategoriaService";
import CategoriaShorDto from "../../../../types/dto/CategoriaShorDto";
import CategoriaShorService from "../../../../services/dtos/CategoriaShorService";

// Define la interfaz para las props del componente
interface AgregarSubcategoriaModalProps {
  open: boolean;
  categoria: Categoria | null; // Categoría a la que se le agregará la subcategoría
  getCategories: () => void;
  onClose: () => void;
}

// Define el componente ModalSubCategoria
const ModalSubCategoria: React.FC<AgregarSubcategoriaModalProps> = ({
  open,
  categoria,
  getCategories,
  onClose,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const categoriaShortService = new CategoriaShorService();
  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;

  // Función para manejar el cierre del modal
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Define los valores iniciales del formulario
  const initialValues: CategoriaShorDto = {
    id: 0,
    eliminado: false,
    denominacion: "",
    subCategorias: [],
    sucursales: [],
    esInsumo: false,
  };

  return (
    <Modal
      show={open}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {categoria && `Agregar subcategoría a ${categoria.denominacion}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            setSubmitting(true);
            try {
              if (categoria) {
                const response = await categoriaService.get(
                  url + "categoria",
                  categoria.id.toString()
                );
                // la categoria que traemos se la asignamos a la categoria que recibe la modal
                categoria = response;
                //le asigno las mismas sucursales que la categoria padre
                values.sucursales = response.sucursales;
              }
              // Procesar el formulario
              const nombreSubcategoria = values.denominacion.trim();
              if (nombreSubcategoria && categoria) {
                // Enviar la subcategoría
                const subCategoria = await categoriaShortService.post(
                  url + "categoria",
                  values
                );

                // Agregar la subcategoría a la categoría actual
                if (categoria) {
                  categoria.subCategorias.push(subCategoria);
                  // Actualizar la categoría en el servidor
                  await categoriaService.put(
                    url + "categoria",
                    categoria.id.toString(),
                    categoria
                  );
                  console.log(
                    "Categoría actualizada con la nueva subcategoría:",
                    categoria
                  );
                }
                getCategories();
                handleClose();
              }
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form autoComplete="off" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="denominacion">Nombre:</label>
                <Field
                  name="denominacion"
                  type="text"
                  placeholder="Nombre de la Subcategoría"
                  className="form-control mt-2"
                />
                <ErrorMessage
                  name="denominacion"
                  className="error-message"
                  component="div"
                />
              </div>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="mr-2"
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  Guardar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSubCategoria;
