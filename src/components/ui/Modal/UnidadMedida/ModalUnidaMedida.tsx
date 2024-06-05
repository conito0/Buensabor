import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";
import UnidadMedidaService from "../../../../services/UnidadMedidaService";
import { useEffect, useState } from "react";
import UnidadMedida from "../../../../types/UnidadMedida";

interface ModalUnidadMedidaProps {
  getUnidades: () => void;
  unidadToEdit?: UnidadMedida | null;
  modalName: string;
}

const ModalUnidadMedida: React.FC<ModalUnidadMedidaProps> = ({ modalName, getUnidades, unidadToEdit }) => {
  const unidadMedidaService = new UnidadMedidaService();
  const [initialValues, setInitialValues] = useState<UnidadMedida>({
    id: 0,
    eliminado: false,
    denominacion: "",
  });

  useEffect(() => {
    if (unidadToEdit) {
      setInitialValues(unidadToEdit);
    }
  }, [unidadToEdit]);

  const modal = useAppSelector((state) => state.modal[modalName]);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName }));
  };

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
        <Modal.Title>{unidadToEdit ? "Editar Unidad de Medida" : "Agregar Unidad de Medida"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
          })}
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={async (values: UnidadMedida, { setSubmitting }) => {
            try {
              if (unidadToEdit) {
                await unidadMedidaService.put(import.meta.env.VITE_API_URL + "unidadMedida", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                await unidadMedidaService.post(import.meta.env.VITE_API_URL + "unidadMedida", values);
                console.log("Se ha agregado correctamente.");
              }
              getUnidades();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off">
              <div className="mb-4">
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
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-success"
                  type="submit"
                  className="custom-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUnidadMedida;
