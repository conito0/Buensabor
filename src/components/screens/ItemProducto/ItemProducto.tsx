import './ItemProducto.css';
import ArticuloDto from "../../../types/dto/ArticuloDto";
import Imagen from "../../../types/Imagen";
import { useContext } from 'react';
import { CarritoContextProvider, CartContext } from '../../../context/CarritoContext';

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
    const { addCarrito, removeCarrito, removeItemCarrito, cart } = useContext(CartContext);

    const hasImages = args.imagenes.length > 0;

    // Check if the item is already in the cart
    const isItemInCart = cart.some(detalle => detalle.articulo.id === args.productoObject.id);

    return (
        <>
        <CarritoContextProvider>
        <div key={args.id} className="col-sm-4 mb-4 mb-sm-0 espacio">
                <div className="card tarjeta">
                    {hasImages && (
                        <img
                            src={args.imagenes[0].url}
                            className="card-img-top"
                            alt={args.imagenes[0].descripcion}
                        />
                    )}

                    <div className="card-body altura-cuerpo">
                        <p className="card-title">{args.denominacion}</p>
                        <p className="card-text h2">$ {args.precioVenta}</p>
                        <p className={`card-text`}>{args.descripcion}</p>
                        <p className='card-text'>Tiempo de preparacion: {args.tiempoEstimadoMinutos} minutos</p>
                        <hr></hr>
                        <div className="icon-container">
                            <a
                                className='iconoMasMenos'
                                onClick={() => removeItemCarrito(args.productoObject)}
                            >
                                -
                            </a>
                            <button
                                className='colorFondoBlanco'
                                onClick={() => {
                                    isItemInCart
                                        ? removeCarrito(args.productoObject)
                                        : addCarrito(args.productoObject);
                                }}
                            >
                                {isItemInCart ? (
                                    <i className="bi bi-cart-dash" title="Quitar"></i>
                                ) : (
                                    <i className="bi bi-cart-check" title="Comprar"></i>
                                )}
                            </button>
                            <a
                                className='iconoMasMenos'
                                onClick={() => addCarrito(args.productoObject)}
                            >
                                +
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </CarritoContextProvider>
        </>

    );
}

export default ItemProducto;
