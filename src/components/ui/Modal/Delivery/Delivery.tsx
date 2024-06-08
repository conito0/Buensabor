import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Domicilio from "../../../../types/Domicilio";
import LocalidadService from "../../../../services/LocalidadService";
import ProvinciaService from "../../../../services/ProvinciaService";
import PaisService from "../../../../services/PaisService";
import Localidad from "../../../../types/Localidad";
import Provincia from "../../../../types/Provincia";
import Pais from "../../../../types/Pais";

interface DeliveryModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (domicilio: Domicilio) => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const [domicilio, setDomicilio] = useState<Domicilio>(new Domicilio());
  const [paises, setPaises] = useState<Pais[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(
    null
  );

  const localidadService = new LocalidadService();
  const provinciaService = new ProvinciaService();
  const paisService = new PaisService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPaises();
  }, []);

  useEffect(() => {
    if (selectedPais) {
      fetchProvincias(selectedPais);
    }
  }, [selectedPais]);

  useEffect(() => {
    if (selectedProvincia) {
      fetchLocalidades(selectedProvincia);
    }
  }, [selectedProvincia]);

  const fetchPaises = async () => {
    try {
      const paisesData = await paisService.getAll(url + "pais");
      setPaises(paisesData);
    } catch (error) {
      console.error("Error fetching countries: ", error);
    }
  };

  const fetchProvincias = async (paisId: number) => {
    try {
      const todasProvincias = await provinciaService.getAll(url + "provincia");
      const provinciasFiltradas = todasProvincias.filter(
        (provincia) => provincia.pais.id === paisId
      );
      setProvincias(provinciasFiltradas);
    } catch (error) {
      console.error("Error fetching provinces: ", error);
    }
  };

  const fetchLocalidades = async (provinciaId: number) => {
    try {
      const todasLocalidades = await localidadService.getAll(url + "localidad");
      const localidadesFiltradas = todasLocalidades.filter(
        (localidad) => localidad.provincia.id === provinciaId
      );
      setLocalidades(localidadesFiltradas);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomicilio((prevDomicilio) => ({
      ...prevDomicilio,
      [name]: value,
    }));
  };

  const handleLocalidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localidadId = parseInt(e.target.value, 10);
    const selectedLocalidad = localidades.find(
      (localidad) => localidad.id === localidadId
    );
    if (selectedLocalidad) {
      setDomicilio((prevDomicilio) => ({
        ...prevDomicilio,
        localidad: selectedLocalidad,
      }));
    }
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const provinciaId = parseInt(e.target.value, 10);
    const selectedProvincia = provincias.find(
      (provincia) => provincia.id === provinciaId
    );
    if (selectedProvincia) {
      setDomicilio((prevDomicilio) => ({
        ...prevDomicilio,
        localidad: {
          ...prevDomicilio.localidad,
          provincia: selectedProvincia,
        },
      }));
      setSelectedProvincia(provinciaId);
    }
  };

  const handlePaisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paisId = parseInt(e.target.value, 10);
    const selectedPais = paises.find((pais) => pais.id === paisId);
    if (selectedPais) {
      setDomicilio((prevDomicilio) => ({
        ...prevDomicilio,
        localidad: {
          ...prevDomicilio.localidad,
          provincia: {
            ...prevDomicilio.localidad.provincia,
            pais: selectedPais,
          },
        },
      }));
      setSelectedPais(paisId);
    }
  };

  const onSave = () => {
    handleSave(domicilio);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-xl">
      <Modal.Header closeButton>
        <Modal.Title>Ingresar Domicilio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Calle</Form.Label>
            <Form.Control
              type="text"
              name="calle"
              value={domicilio.calle}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="row">
            <div className="col">
              <Form.Group>
                <Form.Label>Numero</Form.Label>
                <Form.Control
                  type="number"
                  name="numero"
                  value={domicilio.numero}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group>
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  type="number"
                  name="cp"
                  value={domicilio.cp}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Form.Group>
                <Form.Label>Piso</Form.Label>
                <Form.Control
                  type="number"
                  name="piso"
                  value={domicilio.piso}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group>
                <Form.Label>Número de Departamento</Form.Label>
                <Form.Control
                  type="number"
                  name="nroDpto"
                  value={domicilio.nroDpto}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
          <hr />
          <h5>Localidad</h5>
          <Form.Group>
            <Form.Label>País</Form.Label>
            <Form.Control
              as="select"
              name="paisId"
              value={selectedPais ?? ""}
              onChange={handlePaisChange}
            >
              <option value="">Seleccione un país</option>
              {paises.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Provincia</Form.Label>
            <Form.Control
              as="select"
              name="provinciaId"
              value={selectedProvincia ?? ""}
              onChange={handleProvinciaChange}
              disabled={!selectedPais}
            >
              <option value="">Seleccione una provincia</option>
              {provincias.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre de Localidad</Form.Label>
            <Form.Control
              as="select"
              name="localidadId"
              value={domicilio.localidad.id}
              onChange={handleLocalidadChange}
              disabled={!selectedProvincia}
            >
              <option value="">Seleccione una localidad</option>
              {localidades.map((localidad) => (
                <option key={localidad.id} value={localidad.id}>
                  {localidad.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeliveryModal;
