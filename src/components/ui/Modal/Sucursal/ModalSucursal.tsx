import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";
import SucursalService from "../../../../services/SucursalService";
import Sucursal from "../../../../types/Sucursal";
import LocalidaService from "../../../../services/LocalidadService";
import { ChangeEvent, useEffect, useState } from "react";
import Localidad from "../../../../types/Localidad";
import { useParams } from "react-router-dom";
import EmpresaService from "../../../../services/EmpresaService";
import DomicilioService from "../../../../services/DomicilioService";
import ProvinciaService from "../../../../services/ProvinciaService";
import Provincia from "../../../../types/Provincia";
import PaisService from "../../../../services/PaisService";
import Pais from "../../../../types/Pais";
import {useAuth0} from "@auth0/auth0-react";

interface ModalSucursalProps {
  getSucursal: () => void;
  sucursalToEdit?: Sucursal | null;
  modalName: string;
  empresaTieneCasaMatriz: boolean; // Agrega la prop aquí
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({
  modalName,
  getSucursal,
  sucursalToEdit,
  empresaTieneCasaMatriz,
}) => {
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();

  const localidadService = new LocalidaService();
  const empresaService = new EmpresaService();
  const domicilioService = new DomicilioService();
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { empresaId } = useParams();
  const paisService = new PaisService();
  const [paises, setPaises] = useState<Pais[]>([]);
  const provinviaService = new ProvinciaService();
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(
    null
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const initialValues: Sucursal = sucursalToEdit
    ? {
      ...sucursalToEdit,
      localidadId: sucursalToEdit.domicilio.localidad.id,
    }
    : {
      id: 0,
      eliminado: false,
      nombre: "",
      horarioApertura: formatTime(new Date()),
      horarioCierre: formatTime(new Date()),
      esCasaMatriz: false,
      localidadId: 0, // Assuming localidadId is part of Sucursal
      imagen: {
        id: 0,
        name: "",
        url: "",
        eliminado: false,
      },
      domicilio: {
        id: 0,
        eliminado: false,
        calle: "",
        numero: 0,
        cp: 0,
        piso: 0,
        nroDpto: 0,
        localidad: {
          id: 0,
          eliminado: false,
          nombre: "",
          provincia: {
            id: 0,
            eliminado: false,
            nombre: "",
            pais: {
              id: 0,
              eliminado: false,
              nombre: "",
            },
          },
        },
      },
      empresa: {
        id: 0,
        eliminado: false,
        nombre: "",
        razonSocial: "",
        cuil: 0,
        imagen: {
          id: 0,
          name: "",
          url: "",
          eliminado: false,
        },
      },
    };

  const modal = useAppSelector((state: any) => state.modal[modalName]);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName }));
  };

  const fetchPais = async () => {
    try {
      const paisesData = await paisService.getAll(url + "pais", await getAccessTokenSilently({}));
      setPaises(paisesData);
    } catch (error) {
      console.error("Error al obtener los paises: ", error);
      setPaises([]);
    }
  };

  const fetchProvinciasData = async (paisId: number | null) => {
    try {
      const todasProvincias = await provinviaService.getAll(url + "provincia", await getAccessTokenSilently({}));
      if (paisId) {
        const provinciaPais = todasProvincias.filter(
          (provincia: any) => provincia.pais.id === paisId
        );
        setProvincias(provinciaPais);
      } else {
        setProvincias(todasProvincias);
      }
    } catch (error) {
      console.error("Error al obtener las provincias: ", error);
      setProvincias([]);
    }
  };

  const fetchLocalidadesData = async (provinciaId: number | null) => {
    try {
      const todasLocalidades = await localidadService.getAll(url + "localidad", await getAccessTokenSilently({}));
      if (provinciaId) {
        const localidadProvincia = todasLocalidades.filter(
          (localidad: any) => localidad.provincia.id === provinciaId
        );
        setLocalidades(localidadProvincia);
      } else {
        setLocalidades(todasLocalidades);
      }
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
      setLocalidades([]);
    }
  };

  useEffect(() => {
    fetchPais();
    if (sucursalToEdit) {
      const { domicilio } = sucursalToEdit;
      setSelectedPais(domicilio.localidad.provincia.pais.id);
      setSelectedProvincia(domicilio.localidad.provincia.id);
    } else {
      setSelectedPais(null);
      setSelectedProvincia(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucursalToEdit]);

  useEffect(() => {
    if (selectedPais) {
      fetchProvinciasData(selectedPais);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPais]);

  useEffect(() => {
    if (selectedProvincia) {
      fetchLocalidadesData(selectedProvincia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvincia]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
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
        <Modal.Title>
          {sucursalToEdit ? "Editar sucursal" : "Agregar sucursal"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            nombre: Yup.string().required("Campo requerido"),
            horarioApertura: Yup.string().required("Campo requerido"),
            horarioCierre: Yup.string().required("Campo requerido"),
            localidadId: Yup.number().required(
              "Debes seleccionar una localidad"
            ),
          })}
          initialValues={initialValues}
          onSubmit={async (values: Sucursal, { setSubmitting }) => {
            try {
              let newCompanyId: string | null = null;

              if (sucursalToEdit) {
                const localidad = await localidadService.get(
                  url + "localidad",
                  values.localidadId, await getAccessTokenSilently({})
                );
                values.domicilio.localidad = localidad;
                // Update address (domicilio)
                const domicilio = await domicilioService.put(
                  url + "domicilio",
                  values.domicilio.id.toString(),
                  values.domicilio, await getAccessTokenSilently({})
                );
                values.domicilio = domicilio;
                // Update branch details
                await sucursalService.put(
                  url + "sucursal",
                  values.id.toString(),
                  values, await getAccessTokenSilently({})
                );
                newCompanyId = values.id.toString(); //asigno el id de la sucursal
              } else {
                if (empresaId) {
                  const empresa = await empresaService.get(
                    url + "empresa",
                    empresaId, await getAccessTokenSilently({})
                  );
                  values.empresa = empresa;

                  const localidad = await localidadService.get(
                    url + "localidad",
                    values.localidadId, await getAccessTokenSilently({})
                  );
                  values.domicilio.localidad = localidad;

                  const domicilio = await domicilioService.post(
                    url + "domicilio",
                    values.domicilio, await getAccessTokenSilently({})
                  );
                  values.domicilio = domicilio;

                  // Verificar si la empresa ya tiene una sucursal que es casa matriz
                  if (values.esCasaMatriz && empresaTieneCasaMatriz) {
                    alert("La empresa ya tiene una sucursal que es casa matriz. No se puede crear otra.");
                    return;
                  }

                  const response = await sucursalService.post(
                    url + "sucursal",
                    values, await getAccessTokenSilently({})
                  );
                  newCompanyId = response.id.toString();
                }
              }
              if (file && newCompanyId) {
                const response = await sucursalService.uploadFile(url + 'sucursal/uploads', file, newCompanyId, await getAccessTokenSilently({}));
                console.log('Upload successful:', response);
              }

              getSucursal();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form autoComplete="off">
              <Row>
                {/* Primera columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="nombre">Nombre:</label>
                  <Field
                    name="nombre"
                    type="text"
                    placeholder="nombre"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="nombre"
                    className="error-message"
                    component="div"
                  />
                </Col>
                {/* Séptima columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="horarioApertura">Horario apertura:</label>
                  <Field
                    name="horarioApertura"
                    type="time"
                    step="1"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("horarioApertura", value);
                    }}
                  />
                  <ErrorMessage
                    name="horarioApertura"
                    className="error-message"
                    component="div"
                  />
                </Col>
                {/* Octava columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="horarioCierre">Horario cierre:</label>
                  <Field
                    name="horarioCierre"
                    type="time"
                    step="1"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("horarioCierre", value);
                    }}
                  />
                  <ErrorMessage
                    name="horarioCierre"
                    className="error-message"
                    component="div"
                  />
                </Col>
              </Row>
              <Row>
                {/* Segunda columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="paisId">País:</label>
                  <Field
                    name="paisId"
                    as="select"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = Number(e.target.value);
                      setSelectedPais(value);
                      setFieldValue("paisId", value);
                      setFieldValue("provinciaId", ""); // Resetea el campo de provincia
                      setFieldValue("localidadId", ""); // Resetea el campo de localidad
                    }}
                    value={
                      selectedPais ||
                      initialValues.domicilio.localidad.provincia.pais.id
                    } // Agrega este valor
                  >
                    <option value="">
                      Seleccione un país
                    </option>
                    {paises.map((pais, index) => (
                      <option key={index} value={pais.id}>
                        {pais.nombre}
                      </option>
                    ))}
                  </Field>
                </Col>
                {/* Tercera columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="provinciaId">Provincia:</label>
                  <Field
                    name="provinciaId"
                    as="select"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = Number(e.target.value);
                      setSelectedProvincia(value);
                      setFieldValue("provinciaId", value);
                      setFieldValue("localidadId", ""); // Resetea el campo de localidad
                    }}
                    disabled={!selectedPais}
                    value={
                      selectedProvincia ||
                      initialValues.domicilio.localidad.provincia.id
                    } // Agrega este valor
                  >
                    <option value="">
                      Seleccione una provincia
                    </option>
                    {provincias.map((provincia, index) => (
                      <option key={index} value={provincia.id}>
                        {provincia.nombre}
                      </option>
                    ))}
                  </Field>
                </Col>
                {/* Cuarta columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="localidadId">Localidad:</label>
                  <Field
                    name="localidadId"
                    as="select"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = Number(e.target.value);
                      setFieldValue("localidadId", value);
                    }}
                    disabled={!selectedProvincia || !selectedPais} // Deshabilita el selector si no se ha seleccionado una provincia
                  >
                    <option value="">
                      Seleccione una localidad
                    </option>
                    {localidades.map((localidad, index) => (
                      <option key={index} value={localidad.id}>
                        {localidad.nombre}
                      </option>
                    ))}
                  </Field>
                </Col>
              </Row>
              <Row>
                {/* Quinta columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="domicilio.calle">Calle:</label>
                  <Field
                    name="domicilio.calle"
                    type="text"
                    placeholder="calle"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="domicilio.calle"
                    className="error-message"
                    component="div"
                  />
                </Col>
                {/* Sexta columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="domicilio.cp">Código Postal:</label>
                  <Field
                    name="domicilio.cp"
                    type="number"
                    placeholder="cp"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="domicilio.cp"
                    className="error-message"
                    component="div"
                  />
                </Col>
                <Col md={4} className="mb-4">
                  <label htmlFor="casaMatriz">Casa Matriz:</label>
                  <Field
                    name="esCasaMatriz"
                    as="select"
                    className="form-control mt-2"
                    disabled={empresaTieneCasaMatriz && !sucursalToEdit?.esCasaMatriz}
                    defaultValue={sucursalToEdit?.esCasaMatriz ? "true" : "false"}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = e.target.value === "true";
                      setFieldValue("esCasaMatriz", value);
                    }}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </Field>
                  {(empresaTieneCasaMatriz && !sucursalToEdit?.esCasaMatriz) && ( // Muestra el mensaje solo si empresaTieneCasaMatriz es true
                    <div className="error-message">
                      La empresa ya posee casa matriz
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                {/* Novena columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="logo">Logo:</label>
                  <br />
                  <input
                    name="imagen"
                    type="file"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      handleFileChange(event);
                    }}
                    className="form-control my-2"
                  />
                </Col>
              </Row>
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

export default ModalSucursal;
