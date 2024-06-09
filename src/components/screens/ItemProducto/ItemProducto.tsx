import Imagen from "../../../types/Imagen";
import { useCarrito } from '../../../hooks/useHooks';
import './ItemProducto.css';
import ArticuloDto from '../../../types/dto/ArticuloDto';
import { BiMinus, BiPlus } from "react-icons/bi";
import { BsCartDash, BsCartPlusFill } from "react-icons/bs";
import IArticuloInsumo from "../../../types/ArticuloInsumoType";
import IArticuloManufacturado from "../../../types/ArticuloManufacturado";

type ProductoParams = {
  id: number;
  denominacion: string;
  precioVenta: number;
  imagenes: Imagen[];
  descripcion: string;
  tiempoEstimadoMinutos: number;
  productoObject: ArticuloDto;
  insumos: IArticuloInsumo[];
  productos: IArticuloManufacturado[];
}


function ItemProducto(args: ProductoParams) {
  const { addCarrito, removeCarrito, removeItemCarrito, cart } = useCarrito();

  const hasImages = args.imagenes.length > 0;
  const isItemInCart = cart.some(detalle => detalle.articulo.id === args.productoObject.id);

  return (
    <div className="card tarjeta">
      {hasImages && (
        <>
          <div className="image-container p-1 rounded-image">
            <img
              src={args.imagenes[0]?.url}
              className="card-img-top img-thumbnail img-custom rounded-image"
              alt={args.imagenes[0]?.name}
            />
          </div>
        </>
      )}

      <div className="card-body altura-cuerpo">
        <h5 className="card-title text-truncate">{args.denominacion}</h5>
        <div className="precio-container">
          <p className="card-text h2">$ {args.precioVenta}</p>
        </div>
        <p className={`card-text text-truncate`}>{args.descripcion}</p>
        {args.tiempoEstimadoMinutos
            ? <p className='card-text'>Preparación: {args.tiempoEstimadoMinutos} minutos</p>
            : <div style={{lineHeight: "1.5rem", height: "1.5rem"}}></div>
        }

        <hr/>
        <div className="d-flex justify-content-center align-items-center">

          <div className="icon-container d-flex justify-content-between align-items-center mb-2">
            <button
              className='btn btn-outline-primary me-2'
              onClick={() => removeItemCarrito(args.productoObject)}
            >
              <BiMinus size={20} /> {/* Icono menos */}
            </button>
            <button
              className={`btn me-2 ${isItemInCart ? 'btn-danger' : 'btn-primary'}`}
              onClick={() => {
                isItemInCart
                  ? removeCarrito(args.productoObject)
                  : addCarrito(args.productoObject, args.insumos, args.productos);
              }}
            >
              {isItemInCart ? <BsCartDash size={20} /> : <BsCartPlusFill size={20} />} {/* Iconos de carrito */}
            </button>
            <button
              className='btn btn-outline-primary me-2'
              onClick={() => addCarrito(args.productoObject, args.insumos, args.productos)}
            >
              <BiPlus size={20} /> {/* Icono más */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemProducto;
