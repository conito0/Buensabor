import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Domicilio from "../../../../types/Domicilio";

interface DeliveryModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (domicilio: Domicilio) => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ show, handleClose, handleSave }) => {
  const [domicilio, setDomicilio] = useState<Domicilio>(new Domicilio());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomicilio((prevDomicilio) => ({
      ...prevDomicilio,
      [name]: value,
    }));
  };

  const handleLocalidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomicilio((prevDomicilio) => ({
      ...prevDomicilio,
      localidad: {
        ...prevDomicilio.localidad,
        [name]: value,
      },
    }));
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomicilio((prevDomicilio) => ({
      ...prevDomicilio,
      localidad: {
        ...prevDomicilio.localidad,
        provincia: {
          ...prevDomicilio.localidad.provincia,
          [name]: value,
        },
      },
    }));
  };

  const handlePaisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDomicilio((prevDomicilio) => ({
      ...prevDomicilio,
      localidad: {
        ...prevDomicilio.localidad,
        provincia: {
          ...prevDomicilio.localidad.provincia,
          pais: {
            ...prevDomicilio.localidad.provincia.pais,
            [name]: value,
          },
        },
      },
    }));
  };

  const onSave = () => {
    handleSave(domicilio);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
          <Form.Group>
            <Form.Label>Numero</Form.Label>
            <Form.Control
              type="number"
              name="numero"
              value={domicilio.numero}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              type="number"
              name="cp"
              value={domicilio.cp}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Piso</Form.Label>
            <Form.Control
              type="number"
              name="piso"
              value={domicilio.piso}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Número de Departamento</Form.Label>
            <Form.Control
              type="number"
              name="nroDpto"
              value={domicilio.nroDpto}
              onChange={handleChange}
            />
          </Form.Group>
          <hr />
          <h5>Localidad</h5>
          <Form.Group>
            <Form.Label>Nombre de Localidad</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={domicilio.localidad.nombre}
              onChange={handleLocalidadChange}
            />
          </Form.Group>
          <hr />
          <h5>Provincia</h5>
          <Form.Group>
            <Form.Label>Nombre de Provincia</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={domicilio.localidad.provincia.nombre}
              onChange={handleProvinciaChange}
            />
          </Form.Group>
          <hr />
          <h5>Pais</h5>
          <Form.Group>
            <Form.Label>Nombre del Pais</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={domicilio.localidad.provincia.pais.nombre}
              onChange={handlePaisChange}
            />
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
