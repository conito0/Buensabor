import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Categoria from '../../../../types/Categoria';
import CategoriaService from '../../../../services/CategoriaService';
import CategoriaShorService from '../../../../services/dtos/CategoriaShorService';
import {useAuth0} from "@auth0/auth0-react";

interface ModalEliminarCategoriaProps {
    show: boolean;
    categoria: Categoria | null;
    getCategories: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const ModalEliminarCategoria: React.FC<ModalEliminarCategoriaProps> = ({ show, categoria, onClose, getCategories }) => {
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;
    const { getAccessTokenSilently } = useAuth0();
    const categoriaShortService = new CategoriaShorService();

    const handleEliminar = async () => {
        try {
            if (categoria && categoria.id) {
                // Elimino las subcategorias de la categoria que elimino
                categoria.subCategorias.map(async subCategoria => {
                    await categoriaShortService.delete(url + 'categoria', subCategoria.id.toString(), await getAccessTokenSilently({}));
                });

                await categoriaService.delete(url + 'categoria', categoria.id.toString(), await getAccessTokenSilently({}));
                console.log('Se ha eliminado correctamente.');
                getCategories();
                onClose(); // Cerramos el modal después de eliminar
            } else {
                console.error('No se puede eliminar la categoría porque no se proporcionó un ID válido.');
            }
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estás seguro de que deseas eliminar la categoría "{categoria?.denominacion}"?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleEliminar}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminarCategoria;
