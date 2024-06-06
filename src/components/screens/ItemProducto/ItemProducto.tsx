import React from 'react';
import Imagen from "../../../types/Imagen";
import { useCarrito } from '../../../hooks/useHooks';
import './ItemProducto.css'; // Importa tu archivo CSS personalizado
import ArticuloDto from '../../../types/dto/ArticuloDto';

type ProductoParams = {
  id: number;
  denominacion: string;
  precioVenta: number;
  imagenes: Imagen[];
  descripcion: string;
  tiempoEstimadoMinutos: number;
  productoObject: ArticuloDto;
}

function ItemProducto(args: ProductoParams) {
  const { addCarrito, removeCarrito, removeItemCarrito, cart } = useCarrito();

  const hasImages = args.imagenes.length > 0;
  const isItemInCart = cart.some(detalle => detalle.articulo.id === args.productoObject.id);

  return (
    <div className="card tarjeta">
      {hasImages && (
        <>
          <div className="image-container">
            <img
              src={args.imagenes[0].url}
              className="card-img-top img-thumbnail img-custom" // Clase personalizada para ajustar el tamaño de la imagen
              alt={args.imagenes[0].name}
            />
          </div>
        </>
      )}
  
      <div className="card-body altura-cuerpo">
        <h5 className="card-title">{args.denominacion}</h5>
        <p className="card-text h2">$ {args.precioVenta}</p>
        <p className={`card-text`}>{args.descripcion}</p>
        <p className='card-text'>Tiempo de preparación: {args.tiempoEstimadoMinutos} minutos</p>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <button
            className={`btn ${isItemInCart ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => {
              isItemInCart
                ? removeCarrito(args.productoObject)
                : addCarrito(args.productoObject);
            }}
          >
            {isItemInCart ? 'Quitar' : 'Comprar'}
          </button>
          <div className="icon-container">
            <button
              className='btn btn-outline-primary'
              onClick={() => removeItemCarrito(args.productoObject)}
            >
              -
            </button>
            <button
              className='btn btn-outline-primary'
              onClick={() => addCarrito(args.productoObject)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemProducto;
