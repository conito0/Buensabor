import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import UsuarioService from "../../../../services/UsuarioService";
import Usuario from "../../../../types/Usuario.ts";
import { toggleModal } from "../../../../redux/slices/Modal";

interface ModalUsuarioProps {
  getUsuarios: () => void;
  usuarioToEdit?: Usuario;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ getUsuarios, usuarioToEdit }) => {
  const usuarioService = new UsuarioService();
  const url = import.meta.env.VITE_API_URL;

  // Definir las reglas de validación para el formulario usando Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Campo requerido"),
    auth0Id: Yup.string().required("Campo requerido"),
  });

  // Valores iniciales del formulario, si hay un usuario para editar, se usan esos valores
  const initialValues: Usuario = usuarioToEdit
    ? usuarioToEdit
    : {
      id: 0,
      eliminado: false,
      auth0Id: "",
      username: ""
    };

  const modal = useAppSelector((state) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
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
        <Modal.Title>{usuarioToEdit ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={async (values: Usuario) => {
            try {
              if (usuarioToEdit) {
                // Lógica para editar el usuario existente
                await usuarioService.put(url + "usuarios", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar un nuevo usuario
                await usuarioService.post(url + "usuarios", values);
                console.log("Se ha agregado correctamente.");
              }
              getUsuarios();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {() => (
            <Form autoComplete="off">
              <div className="mb-4">
                <label htmlFor="username">Usuario:</label>
                <Field name="username" type="text" className="form-control mt-2" />
                <ErrorMessage name="username" className="error-message" component="div" />
              </div>
              <div className="mb-4">
                <label htmlFor="auth0Id">Auth0Id:</label>
                <Field name="auth0Id" type="text" className="form-control mt-2" />
                <ErrorMessage name="auth0Id" className="error-message" component="div" />
              </div>
              <div className="d-flex justify-content-end">
                <Button variant="outline-success" type="submit" className="custom-button">
                  Enviar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUsuario;
