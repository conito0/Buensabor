import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Sucursal from '../../../../types/Sucursal';
import SucursalService from '../../../../services/SucursalService';
import {useAuth0} from "@auth0/auth0-react";

interface ModalEliminarSucursalProps {
  show: boolean;
  onHide: () => void;
  sucursal: Sucursal | null;
  onDelete: () => void;
}

const ModalEliminarSucursal: React.FC<ModalEliminarSucursalProps> = ({ show, onHide, sucursal }) => {
    const sucursalService = new SucursalService();
    const url = import.meta.env.VITE_API_URL;
    const { getAccessTokenSilently } = useAuth0();
  
    const handleDelete = async () => {
      try {
        if (sucursal && sucursal.id) {
          await sucursalService.delete(url + 'sucursales', sucursal.id.toString(), await getAccessTokenSilently({}));
          console.log('Se ha eliminado correctamente.');
          onHide(); // Cerramos el modal
        } else {
          console.error('No se puede eliminar la sucursal porque no se proporcionó un ID válido.');
        }
      } catch (error) {
        console.error('Error al eliminar la sucursal:', error);
      }
    };

    
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Sucursal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar la sucursal "{sucursal?.denominacion}"?</p>
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
  

export default ModalEliminarSucursal;
