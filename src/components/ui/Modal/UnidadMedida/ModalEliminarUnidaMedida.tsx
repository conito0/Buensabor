import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import UnidadMedida from '../../../../types/UnidadMedida';
import UnidadMedidaService from '../../../../services/UnidadMedidaService';
import {useAuth0} from "@auth0/auth0-react";

interface ModalEliminarUnidadMedidaProps {
  show: boolean;
  onHide: () => void;
  unidad: UnidadMedida | null;
  onDelete: () => void;
}

const ModalEliminarUnidadMedida: React.FC<ModalEliminarUnidadMedidaProps> = ({ show, onHide, unidad, onDelete }) => {
    const unidadMedidaService = new UnidadMedidaService();
    const url = import.meta.env.VITE_API_URL;
    const { getAccessTokenSilently } = useAuth0();
  
    const handleDelete = async () => {
      try {
        if (unidad && unidad.id) {
          await unidadMedidaService.delete(url + 'unidadMedida', unidad.id.toString(), await getAccessTokenSilently({}));
          console.log('Se ha eliminado correctamente.');
          onDelete(); // Actualiza la lista de unidades de medida
          onHide(); // Cerramos el modal
        } else {
          console.error('No se puede eliminar la unidad de medida porque no se proporcionó un ID válido.');
        }
      } catch (error) {
        console.error('Error al eliminar la unidad de medida:', error);
      }
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Unidad de Medida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar la unidad de medida "{unidad?.denominacion}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
export default ModalEliminarUnidadMedida;
