import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import PedidoService from '../../../services/PedidoService';
import Pedido from '../../../types/Pedido';

interface ModalEliminarPedidoProps {
  show: boolean;
  onHide: () => void;
  pedido: Pedido;
  orderDate: any;
}

const ModalEliminarPedido: React.FC<ModalEliminarPedidoProps> = ({ show, onHide, pedido, orderDate }) => {
    const pedidoService = new PedidoService();
    const url = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false); // State to manage loading state

    const handleDelete = async () => {
      setLoading(true); // Set loading to true when delete starts
      try {
        await pedidoService.delete(url + 'pedido', pedido.id.toString());
        console.log('Se ha eliminado correctamente.');
        onHide(); // Close modal on successful delete
      } catch (error) {
        console.error('Error al eliminar el pedido:', error);
      } finally {
        setLoading(false); // Reset loading state regardless of success or failure
      }
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Pedido con fecha {orderDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar el pedido de tu historial?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default ModalEliminarPedido;