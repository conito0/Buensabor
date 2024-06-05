// import IArticuloManufacturado from "./ArticuloManufacturado";
import DataModel from "./DataModel";
import ArticuloManufacturadoShorDto from "./dto/ArticuloManufacturadoShorDto";

interface PromocionDetalle extends DataModel<PromocionDetalle>{
  cantidad: number,
  articuloManufacturado: ArticuloManufacturadoShorDto
}

export default PromocionDetalle;
