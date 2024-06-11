import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import ArticuloInsumoService from '../../../../services/ArticuloInsumoService';
import ArticuloInsumo from '../../../../types/ArticuloInsumoType';
import {useAuth0} from "@auth0/auth0-react";

interface ModalEliminarArticuloInsumoProps {
  show: boolean;
  onHide: () => void;
  articuloInsumo: ArticuloInsumo | null;
}

const ModalEliminarArticuloInsumo: React.FC<ModalEliminarArticuloInsumoProps> = ({ show, onHide, articuloInsumo }) => {
    const articuloInsumoService = new ArticuloInsumoService();
    const url = import.meta.env.VITE_API_URL;
    const { getAccessTokenSilently } = useAuth0();

    const handleDelete = async () => {
      try {
        if (articuloInsumo && articuloInsumo.id) {
          await articuloInsumoService.delete(url + 'articuloInsumo',articuloInsumo.id.toString(), await getAccessTokenSilently({}));
          console.log('Se ha eliminado correctamente.');
          onHide(); // Cerramos el modal
        } else {
          console.error('No se puede eliminar el artículo de insumo porque no se proporcionó un ID válido.');
        }
      } catch (error) {
        console.error('Error al eliminar el artículo de insumo:', error);
      }
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Artículo de Insumo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar el artículo de insumo "{articuloInsumo?.denominacion}"?</p>
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

export default ModalEliminarArticuloInsumo;
