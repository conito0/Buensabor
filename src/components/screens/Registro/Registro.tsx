import {useAuth0} from "@auth0/auth0-react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import * as Yup from "yup";
import {Cliente} from "../../../types/Cliente.ts";
import ClientService from "../../../services/ClienteService.ts";

export const Registro = () => {

    const clienteService = new ClientService();
    const url = import.meta.env.VITE_API_URL;
    const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

    if (isAuthenticated) {
        return <div style={{height: "calc(100vh - 88px)"}} className="d-flex flex-column justify-content-center align-items-center">
            <h1>Ya estas registrado!</h1>
            <p>Ya podes disfrutar de nuestro catalogo.</p>
        </div>
    }

    if(isLoading) {
        return <div style={{height: "calc(100vh - 88px)"}}
                    className="d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border" role="status"></div>
        </div>
    }

    // Definir las reglas de validación para el formulario usando Yup
    const validationSchema = Yup.object({
        nombre: Yup.string().required("Campo requerido"),
        apellido: Yup.string().required("Campo requerido"),
        email: Yup.string().required("Campo requerido"),
        telefono: Yup.string().required("Campo requerido"),
    });

    const initialValues: Cliente = {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        usuario: {
            email: '',
            auth0Id: '',
            rol: '',
            username: ''
        }
    }

    return <>
        <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={async (values: Cliente) => {
                try {
                    await clienteService.post(url + "cliente", values);
                    console.log("Se ha actualizado correctamente.");

                    loginWithRedirect({
                        authorizationParams: {
                            screen_hint: 'signup',
                            login_hint: values.email
                        }
                    });
                } catch (error) {
                    console.error("Error al realizar la operación:", error);
                }
            }}
        >
            {() => (
                <div style={{width: '100%'}} className={"d-flex justify-content-center align-items-center m-5"}>
                    <Form style={{width: '700px'}} autoComplete="off">
                        <div style={{width: '700px'}} className="mb-4">
                            <label htmlFor="nombre">Nombre:</label>
                            <Field name="nombre" type="text" className="form-control mt-2"/>
                            <ErrorMessage name="nombre" className="error-message" component="div"/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="apellido">Apellido:</label>
                            <Field name="apellido" type="text" className="form-control mt-2"/>
                            <ErrorMessage name="apellido" className="error-message" component="div"/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email">Email:</label>
                            <Field name="email" type="text" className="form-control mt-2"/>
                            <ErrorMessage name="email" className="error-message" component="div"/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="telefono">Telefono:</label>
                            <Field name="telefono" type="text" className="form-control mt-2"/>
                            <ErrorMessage name="telefono" className="error-message" component="div"/>
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button variant={"link"} onClick={() => loginWithRedirect()} className="btn btn-link">
                                Ya estoy registrado
                            </Button>
                            <Button variant="outline-success" type="submit" className="custom-button">
                                Continuar con google / email
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    </>
}