import './ItemProducto.css'
import ArticuloManufacturado from "../../../types/ArticuloManufacturado";
import Imagen from "../../../types/Imagen";

type ProductoParams = {
    id: number;
    denominacion: string;
    precioVenta: number;
    imagenes: Imagen[];
    descripcion: string;
    tiempoEstimadoMinutos: number;
    productoObject: ArticuloManufacturado;
}

function ItemProducto(args: ProductoParams) {

    const hasImages = args.imagenes.length > 0;

    return (
        <>
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
                            <a className='iconoMasMenos'
                            // onClick={() => removeItemCarrito(args.instrumentoObject)}
                            >
                                -
                            </a>
                            <button className='colorFondoBlanco'
                            // onClick={() => {
                            //     isInstrumentoInCarrito
                            //         ? removeCarrito(args.instrumentoObject)
                            //         : addCarrito(args.instrumentoObject)
                            // }}
                            >
                                {
                                    // isInstrumentoInCarrito
                                    //     ? <i className="bi bi-cart-dash" title="Quitar"></i>
                                    //     : <i className="bi bi-cart-check" title="Comprar"></i>
                                }
                            </button>
                            <a className='iconoMasMenos'
                            // onClick={() => addCarrito(args.instrumentoObject)}
                            >
                                +
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ItemProducto;
